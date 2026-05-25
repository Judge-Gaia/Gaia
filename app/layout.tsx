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
      <body>{children}</body>
    </html>
  );
}

