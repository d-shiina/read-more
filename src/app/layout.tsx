import "./globals.css";
import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { tree } from "@/lib/tree";

export const metadata: Metadata = {
  title: {
    default: "read more",
    template: "%s ｜ read more",
  },
  description: "続きは、続きを読むからどうぞ！",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <RootProvider
          theme={{ defaultTheme: "dark", enableSystem: true }}
          search={{ enabled: false }}
        >
          <DocsLayout tree={tree} nav={{ title: "read more" }}>
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
