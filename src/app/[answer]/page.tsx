import { notFound } from "next/navigation";
import { DocsTitle } from "fumadocs-ui/page";
import PageShell from "@/components/PageShell";
import Cleared from "@/components/Cleared";
import { ANSWERS, matches } from "@/game/config";

export const metadata = { title: "第2話" };

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ answer: string }>;
}) {
  const { answer } = await params;
  const decoded = decodeURIComponent(answer);

  // 正解以外のパスは、世界観に合わせた専用404へ落とす
  if (!matches(decoded, ANSWERS.chapter1)) {
    notFound();
  }

  return (
    <PageShell>
      <DocsTitle>第2話「続きを読む」</DocsTitle>
      <p className="text-sm text-fd-muted-foreground">2011-08-14 04:12 ｜ カテゴリ: 黒歴史</p>

      <p>
        呪文、正解。よく思い出したね。……というか、よく付き合ってくれてありがとう。
      </p>
      <p>
        AfterEffects を手に入れた僕は、来る日も来る日もキル集を編集していた。
        こなちゃんが寝落ちした後も、ひとり、レンダリングの進捗バーを眺めながら。
      </p>
      <p>
        次の話に進むには、また呪文が要る。……でも今回は、答えを本文には書いていない。
        <strong>このページのHTMLソースの中</strong>に隠してある。
      </p>
      <blockquote>
        <p>
          「ページのソースを表示」か、開発者ツールで、この記事のHTMLを覗いてごらん。
          <code>次の呪文</code> という置き手紙があるはずだ。
        </p>
      </blockquote>

      {/* --- ここから下は view-source 用の仕込み（POC） --- */}

      {/* 本物のHTMLコメントとしてソースに埋め込む（画面には出ない） */}
      <span
        aria-hidden
        dangerouslySetInnerHTML={{
          __html: "<!-- 次の呪文: konachan （※本番では実在ネタに差し替え） -->",
        }}
      />

      {/* スクリーンリーダー/ソースには残るが視覚的に隠れた手がかり */}
      <p className="sr-clue" data-hint="次の呪文はサイドバーのカウンターにも関係する">
        次の呪文: konachan
      </p>

      <Cleared chapter="第1話「これは、革命だ」" />

      <p className="not-prose mt-6 text-sm text-fd-muted-foreground">
        （最小版はここまで。ここから先に、本物のブログ連携・カレンダー日付謎・こなちゃんの
        コメントが続いていく想定です）
      </p>
    </PageShell>
  );
}
