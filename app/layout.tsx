import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GAIA",
  description: "지구의 자연 파괴 이벤트를 해결하는 실시간 웹 게임"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
        <link rel="preload" as="image" href="/textures/earth_atmos_2048.jpg" />
        <link rel="preload" as="image" href="/textures/earth_clouds_1024.png" />
        <link rel="preload" as="image" href="/textures/earth_normal_2048.jpg" />
        <link rel="preload" as="image" href="/textures/earth_specular_2048.jpg" />
      </head>
      {/* 
        Next.js Hydration Warning 방지:
        브라우저 확장 프로그램(번역기, 다크모드 등)이 <body> 태그에 동적으로 속성(attribute)을 주입할 경우
        서버 렌더링 마크업과 클라이언트의 첫 렌더 마크업 불일치로 인해 발생하는 Hydration 경고를 무시합니다.
      */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
