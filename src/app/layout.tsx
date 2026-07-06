import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "革命からの脱出 — kakumei escape",
  description:
    "オンラインゲーム「革命」に溺れた廃人の部屋から脱出せよ。クリック型の脱出ゲーム。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
