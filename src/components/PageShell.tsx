import { ReactNode } from "react";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import SidePanel from "./SidePanel";

/**
 * 記事本文 ＋ 右カラム（再利用したTOCスペース）の2カラム。
 * `full` で Fumadocs 標準の右TOCは消し、代わりに自前のブログ風サイドバーを置く。
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <DocsPage full>
      <div className="mx-auto grid w-full max-w-5xl gap-8 xl:grid-cols-[minmax(0,1fr)_16rem]">
        <DocsBody className="min-w-0">{children}</DocsBody>
        <aside className="not-prose hidden xl:block">
          <div className="sticky top-24">
            <SidePanel />
          </div>
        </aside>
      </div>
    </DocsPage>
  );
}
