import Link from "next/link";
import { DocsTitle } from "fumadocs-ui/page";
import PageShell from "@/components/PageShell";

export const metadata = { title: "404" };

export default function NotFound() {
  return (
    <PageShell>
      <DocsTitle>404 — その記事は、まだ公開されていない</DocsTitle>
      <p className="text-sm text-fd-muted-foreground">エラー ｜ ページが見つかりません</p>

      <p>
        入力した「呪文」が違うのかもしれない。あるいは、まだ書かれていない“続き”を
        覗こうとしたのかもしれない。
      </p>
      <p>
        黒歴史は、正しい順番でしか読ませてもらえない。
        <br />
        もう一度、記事に戻ってこたえを確かめて。
      </p>

      <p className="not-prose mt-6">
        <Link
          href="/"
          className="inline-flex rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground transition hover:opacity-90"
        >
          ← 第1話に戻る
        </Link>
      </p>
    </PageShell>
  );
}
