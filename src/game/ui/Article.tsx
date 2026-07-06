"use client";

import { useState } from "react";
import type { Article } from "../blog";
import RiddleBox from "./RiddleBox";

export default function ArticleView({ article }: { article: Article }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <article className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8">
      {/* view-source に隠すヒント（ブラウザである意味） */}
      {article.riddle.sourceClue && (
        <span
          aria-hidden
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{
            __html: `<!-- ${article.riddle.sourceClue} -->`,
          }}
        />
      )}

      <div className="mb-1 text-xs tracking-widest text-accent2">4g.MiNaMiの気まぐれ日記</div>
      <h1 className="text-2xl font-black sm:text-3xl">{article.title}</h1>
      <div className="mt-1 text-xs text-muted-foreground">
        {article.date}
        {article.category ? ` ｜ カテゴリ: ${article.category}` : ""}
      </div>

      <div className="mt-6 space-y-4 leading-relaxed text-foreground/95">
        {article.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        {!showMore ? (
          <button
            onClick={() => setShowMore(true)}
            className="mt-2 inline-flex items-center gap-1 rounded-lg border border-border bg-panel px-4 py-2 text-sm text-brand transition hover:border-brand"
          >
            ▼ 続きを読む
          </button>
        ) : (
          <div className="space-y-4 anim-fadeup border-l-2 border-brand/40 pl-4">
            {article.more.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </div>

      <RiddleBox article={article} />
    </article>
  );
}
