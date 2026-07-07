import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "read more ｜ 続きは、原典を読むからどうぞ！",
  description:
    "ブラウザを2枚開いて、本人のブログを読みながら解く全10問の謎解き。公式攻略本は、本人のブログです。",
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
