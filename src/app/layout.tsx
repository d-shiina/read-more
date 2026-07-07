import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "read more: ESCAPE ｜ 続きは、脱出してからどうぞ！",
  description:
    "15年放置されたブログの中に閉じ込められた。彼の実際の投稿から謎を解き、5つの未練を解放して脱出せよ。こな度を上げれば、寝落ちもしもしエンドが待っている＞ｗ＜",
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
