import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "read more — 謎解きゲーム",
  description:
    "ネトゲに溺れた夜と、こなちゃんと、フラグムービーへの憧れ。ブラウザで遊ぶ画像つき謎解きゲーム。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // 常にダークテーマ（shadcnのダーク変数を有効化）
  return (
    <html lang="ja" className="dark h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
