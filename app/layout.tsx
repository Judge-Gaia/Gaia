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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
