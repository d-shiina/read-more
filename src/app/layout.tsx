import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "read more ｜ 続きは、続きを読むからどうぞ！",
  description:
    "「続きを読む」を押すだけのゲーム。攻略はありません。続きは、続きを読むからどうぞ！＞ｗ＜",
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
