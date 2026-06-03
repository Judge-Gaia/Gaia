import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdmin } from "@/lib/supabase/server";

const rankingSchema = z.object({
  playerName: z.string().trim().min(1).max(24),
  score: z.number().int().min(0),
  durationSeconds: z.number().int().min(0),
  resolvedCount: z.number().int().min(0),
  failedCount: z.number().int().min(0),
  achievements: z.array(z.string().min(1)).max(30),
  gameMode: z.enum(["basic", "ultra"]).optional().default("basic")
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "basic";

  const supabase = createSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ items: [], configured: false });
  }

  const { data, error } = await supabase
    .from("rankings")
    .select("id, player_name, score, duration_seconds, resolved_count, failed_count, created_at")
    .eq("game_mode", mode)
    .order("score", { ascending: false })
    .order("duration_seconds", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    items: data.map((item, index) => ({
      rank: index + 1,
      id: item.id,
      playerName: item.player_name,
      score: item.score,
      durationSeconds: item.duration_seconds,
      resolvedCount: item.resolved_count,
      failedCount: item.failed_count,
      createdAt: item.created_at
    }))
  });
}

export async function POST(request: Request) {
  const parsed = rankingSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ configured: false, rankingId: null, rank: null });
  }

  const payload = parsed.data;
  const { data, error } = await supabase
    .from("rankings")
    .insert({
      player_name: payload.playerName,
      score: payload.score,
      duration_seconds: payload.durationSeconds,
      resolved_count: payload.resolvedCount,
      failed_count: payload.failedCount,
      game_mode: payload.gameMode
    })
    .select("id, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (payload.achievements.length > 0) {
    const { error: achievementError } = await supabase.from("achievement_records").insert(
      payload.achievements.map((achievementId) => ({
        ranking_id: data.id,
        achievement_id: achievementId
      }))
    );

    if (achievementError) {
      return NextResponse.json({ error: achievementError.message }, { status: 500 });
    }
  }

  const { count, error: rankError } = await supabase
    .from("rankings")
    .select("id", { count: "exact", head: true })
    .eq("game_mode", payload.gameMode)
    .or(
      `score.gt.${payload.score},and(score.eq.${payload.score},duration_seconds.lt.${payload.durationSeconds}),and(score.eq.${payload.score},duration_seconds.eq.${payload.durationSeconds},created_at.lt.${data.created_at})`
    );

  if (rankError) {
    return NextResponse.json({ error: rankError.message }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    rankingId: data.id,
    rank: (count ?? 0) + 1
  });
}
