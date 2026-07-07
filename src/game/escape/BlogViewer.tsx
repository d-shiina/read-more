"use client";

import { useState } from "react";
import type { GameApi, GameState } from "./types";
import { ARTICLES, ARTICLE_PUZZLE, BTN_SUB, LOCK_FILES, objectiveText, type Article } from "./data";
import { Ch0Skype, Ch1Exam, Ch2Karaoke, Ch3Snipe, Ch4Timeline, Ch5Terminal } from "./puzzles";

interface BP {
  state: GameState;
  api: GameApi;
}

/* ================= 検索（隠し要素の入口） ================= */

function SearchResult({ query, state, api }: BP & { query: string }) {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  if (q.includes("マイクラ") || q.includes("minecraft") || q.includes("まいくら")) {
    return (
      <div className="anim-fadeup mt-3 rounded-2xl border border-line bg-panel/60 p-4 text-sm">
        <p className="text-xs text-muted-foreground">検索結果: 1件（外部アーカイブ）</p>
        <p className="mt-2 rounded-xl bg-black/30 p-3">
          <span className="text-xs text-muted-foreground">@zaftx ・ 2012.03.12</span>
          <br />
          二度寝とか甘えー、こなちゃんマイクラの鯖立ててからいってくれたらうれしい！
        </p>
        {!state.flags.minecraft ? (
          <button
            onClick={() => {
              api.setFlag("minecraft");
              api.addKona(2);
              api.grantA("minecraft");
              api.ping();
            }}
            className={BTN_SUB}
          >
            ⛏ 鯖を立てる（14年越し）
          </button>
        ) : (
          <p className="mt-2 text-xs font-bold text-brand">✓ 鯖は稼働中です（14年越し）。DMを確認しよう。</p>
        )}
      </div>
    );
  }

  if (q.includes("デザート") || q.includes("プリン") || q.includes("でざーと")) {
    return (
      <div className="anim-fadeup mt-3 rounded-2xl border border-line bg-panel/60 p-4 text-sm">
        <p className="text-xs text-muted-foreground">検索結果: 1件（外部アーカイブ）</p>
        <p className="mt-2 rounded-xl bg-black/30 p-3">
          <span className="text-xs text-muted-foreground">@zaftx ・ 2012.03.15</span>
          <br />
          なるほど、こなちゃんはデザートにうるさいお方とφ( ･´ｰ･｀)
        </p>
        {!state.flags.dessert ? (
          <button
            onClick={() => {
              api.setFlag("dessert");
              api.addKona(1);
              api.grantA("dessert");
              api.ping();
            }}
            className={BTN_SUB}
          >
            🍮 プリンを差し入れる
          </button>
        ) : (
          <p className="mt-2 text-xs font-bold text-brand">✓ プリンは届けられました。</p>
        )}
      </div>
    );
  }

  if (q.includes("joka") || q.includes("じょーか") || q.includes("ジョーカ")) {
    return (
      <div className="anim-fadeup mt-3 rounded-2xl border border-gold/40 bg-gold/5 p-4 text-sm">
        <p className="font-black text-gold">Joka「俺を検索してる暇があるなら、腕を磨け」</p>
        <p className="mt-1 text-xs text-muted-foreground">
          「……だが、最後の最後でどうしても困ったら、俺の名を呼べ」
        </p>
      </div>
    );
  }

  if (q.includes("続き") || q.includes("つづき")) {
    return (
      <div className="anim-fadeup mt-3 rounded-2xl border border-line bg-panel/60 p-4 text-sm">
        <p className="text-muted-foreground">
          🪦 旧作『read more（続きを読むばかゲー）』は<b>完全に削除されました</b>。
          いまはgit履歴の中で眠っています。続きは、脱出してからどうぞ。
        </p>
      </div>
    );
  }

  if (q.includes("こな")) {
    return (
      <div className="anim-fadeup mt-3 rounded-2xl border border-line bg-panel/60 p-4 text-sm">
        <p className="text-muted-foreground">……検索しなくても、DMにいるよ？</p>
      </div>
    );
  }

  return (
    <div className="anim-fadeup mt-3 rounded-2xl border border-line bg-panel/60 p-4 text-sm">
      <p className="text-muted-foreground">「{query}」の検索結果: 0件＞ｗ＜</p>
    </div>
  );
}

/* ================= リアクションバー（モダンすぎる機能その1） ================= */

const REACTION_ICONS = ["👍", "＞ｗ＜", "🔥", "😢"];

function Reactions({ article, api }: { article: Article; api: GameApi }) {
  const [added, setAdded] = useState<boolean[]>([false, false, false, false]);
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {REACTION_ICONS.map((ic, i) => (
        <button
          key={i}
          onClick={() => {
            api.blip();
            setAdded((a) => a.map((v, j) => (j === i ? !v : v)));
          }}
          className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
            added[i] ? "border-brand bg-brand/15 text-brand" : "border-line bg-panel hover:border-brand"
          }`}
        >
          {ic} {article.reactions[i] + (added[i] ? 1 : 0)}
        </button>
      ))}
    </div>
  );
}

/* ================= 記事ビュー ================= */

function ArticleView({ article, state, api, onBack }: BP & { article: Article; onBack: () => void }) {
  const [ai, setAi] = useState(false);
  const puzzleChapter = ARTICLE_PUZZLE[article.id];

  return (
    <article className="anim-fadeup">
      <button onClick={onBack} className="text-xs font-bold text-accent2 hover:underline">
        ← 記事一覧へ
      </button>
      <div className="mt-3 rounded-2xl border border-line bg-panel/60 p-5 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span>{article.date}</span>
          {article.cat && (
            <span className="rounded-full bg-accent2/10 px-2 py-0.5 font-bold text-accent2">
              #{article.cat}
            </span>
          )}
          <span className="rounded-full bg-black/30 px-2 py-0.5">
            ⏱ 読了 約1分<span className="opacity-60">（続きを含む: 約15年）</span>
          </span>
        </div>
        <h2 className="mt-2 text-xl font-black leading-snug">{article.title}</h2>

        {/* モダンすぎる機能その2: AI要約 */}
        <button
          onClick={() => {
            api.blip();
            setAi((v) => !v);
          }}
          className="mt-3 rounded-full border border-line bg-gradient-to-r from-[#3fd6e6]/10 to-[#ff8ac2]/10 px-3 py-1.5 text-xs font-bold transition hover:border-brand"
        >
          ✨ AIで要約する
        </button>
        {ai && (
          <p className="anim-pop mt-2 rounded-xl border border-line bg-black/30 p-3 text-sm text-muted-foreground">
            {article.ai}
            <span className="mt-1 block text-[10px] opacity-60">
              ※ この要約は livedoor NEXT™ AI が思い出クレジット0で生成しました
            </span>
          </p>
        )}

        <div className="mt-4 space-y-3 text-sm leading-relaxed">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <Reactions article={article} api={api} />

        {/* 解決済みの錠前 */}
        {puzzleChapter !== undefined && puzzleChapter < state.chapter && (
          <p className="mt-5 rounded-xl border border-brand/30 bg-brand/5 p-3 text-xs text-brand">
            {article.id === "a9"
              ? "✅ この記事の誤字は狙撃されました：Alliance of Variant Arms → Valiant"
              : article.id === "a1"
                ? "✅ 本人確認済み。おかえり、4g.MiNaMi。"
                : `✅ 未練${["", "①", "②", "③"][puzzleChapter] ?? ""}は解放されました。`}
          </p>
        )}

        {/* 手がかり記事の案内（問題そのものは同じ画面に置かない。カンニング防止） */}
        {puzzleChapter === state.chapter && (
          <p className="mt-5 rounded-xl border border-gold/40 bg-gold/5 p-3 text-xs text-gold">
            📖 この記事のどこかに、手がかりがある。よく読んで覚えたら、記事一覧の錠前ファイル
            <b className="font-mono">「{LOCK_FILES[puzzleChapter].file.replace(/^\S+ /, "")}」</b>
            に挑め。
          </p>
        )}
      </div>
    </article>
  );
}

/* ================= 本体 ================= */

export default function BlogViewer({ state, api, showMission = true }: BP & { showMission?: boolean }) {
  const [view, setView] = useState<string>("list");
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");

  // 錠前ファイル（章0〜3）: 記事とは別画面で解く
  if (view === `lock${state.chapter}` && state.chapter <= 3) {
    const Lock = [Ch0Skype, Ch1Exam, Ch2Karaoke, Ch3Snipe][state.chapter];
    return (
      <div className="anim-fadeup">
        <button onClick={() => setView("list")} className="text-xs font-bold text-accent2 hover:underline">
          ← 記事一覧へ（記事を読み直すのは自由。行き来しろ）
        </button>
        <div className="mt-1">
          <Lock state={state} api={api} />
        </div>
      </div>
    );
  }

  if (view === "aep" && state.chapter === 4)
    return (
      <div className="anim-fadeup">
        <button onClick={() => setView("list")} className="text-xs font-bold text-accent2 hover:underline">
          ← 記事一覧へ
        </button>
        <div className="mt-3">
          <Ch4Timeline state={state} api={api} />
        </div>
      </div>
    );

  if (view === "tw" && state.chapter >= 5 && !state.ending)
    return (
      <div className="anim-fadeup">
        <button onClick={() => setView("list")} className="text-xs font-bold text-accent2 hover:underline">
          ← 記事一覧へ
        </button>
        <div className="mt-3">
          <Ch5Terminal state={state} api={api} />
        </div>
      </div>
    );

  const article = ARTICLES.find((a) => a.id === view);
  if (article && article.minChapter <= state.chapter)
    return <ArticleView article={article} state={state} api={api} onBack={() => setView("list")} />;

  return (
    <div className="anim-fadeup">
      {/* 現在の目標（PCではサイドバーに常設なので隠す） */}
      {showMission && (
        <div className="rounded-2xl border border-gold/30 bg-gold/5 p-3 text-sm">
          <span className="text-[10px] font-black tracking-widest text-gold">MISSION</span>
          <p className="mt-0.5 font-bold">{objectiveText(state.chapter)}</p>
        </div>
      )}

      {/* ブログ内検索（モダンすぎる機能その3） */}
      <div className="mt-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setSearched(query)}
          placeholder="🔎 思い出をセマンティック検索（β）"
          className="min-w-0 flex-1 rounded-full border border-line bg-panel/60 px-4 py-2 text-sm outline-none backdrop-blur focus:border-brand"
        />
        <button
          onClick={() => setSearched(query)}
          className="rounded-full border border-line bg-panel px-4 text-sm font-bold transition hover:border-brand"
        >
          検索
        </button>
      </div>
      {searched && <SearchResult query={searched} state={state} api={api} />}

      {/* 錠前ファイル（章の入口。記事と同じ画面に問題は置かない） */}
      {state.chapter <= 3 && (
        <button
          onClick={() => {
            api.blip();
            setView(`lock${state.chapter}`);
          }}
          className="anim-pop mt-4 block w-full rounded-2xl border border-gold/50 bg-gradient-to-r from-gold/10 to-transparent p-4 text-left transition hover:border-gold"
        >
          <div className="text-[10px] font-black tracking-widest text-gold">
            🗝 {LOCK_FILES[state.chapter].label}
          </div>
          <div className="mt-1 font-mono text-sm font-bold">{LOCK_FILES[state.chapter].file}</div>
          <div className="text-xs text-muted-foreground">{LOCK_FILES[state.chapter].desc}</div>
        </button>
      )}

      {/* 特殊ファイル（章の入口） */}
      {state.chapter === 4 && (
        <button
          onClick={() => setView("aep")}
          className="anim-pop mt-4 block w-full rounded-2xl border border-gold/50 bg-gradient-to-r from-gold/10 to-transparent p-4 text-left transition hover:border-gold"
        >
          <div className="text-[10px] font-black tracking-widest text-gold">🗝 未練④ — 見知らぬファイル</div>
          <div className="mt-1 font-mono text-sm font-bold">🎞 project_kakumei.aep</div>
          <div className="text-xs text-muted-foreground">最終更新: 2011年 ｜ 状態: 未レンダリング</div>
        </button>
      )}
      {state.chapter >= 5 && !state.ending && (
        <button
          onClick={() => setView("tw")}
          className="anim-pop mt-4 block w-full rounded-2xl border border-danger/50 bg-gradient-to-r from-danger/10 to-transparent p-4 text-left transition hover:border-danger"
        >
          <div className="text-[10px] font-black tracking-widest text-danger">🗝 未練⑤ — 最後のファイル</div>
          <div className="mt-1 font-mono text-sm font-bold">💾 old_twitter_backup.zip</div>
          <div className="text-xs text-muted-foreground">2012年 ｜ 14件 ｜ ⚠ 黒歴史を含む可能性があります</div>
        </button>
      )}

      {/* 記事一覧（PCは2列グリッド） */}
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {ARTICLES.map((a) => {
          const unlocked = a.minChapter <= state.chapter;
          const hasLock = ARTICLE_PUZZLE[a.id] === state.chapter;
          if (!unlocked)
            return (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-2xl border border-dashed border-line bg-black/20 p-4 opacity-60"
              >
                <span className="text-lg">🧊</span>
                <div>
                  <div className="text-sm font-bold text-muted-foreground">凍結された記事</div>
                  <div className="text-[11px] text-muted-foreground/60">{a.date} ｜ 未練を解くと解凍されます</div>
                </div>
              </div>
            );
          return (
            <button
              key={a.id}
              onClick={() => {
                api.blip();
                setView(a.id);
              }}
              className={`block w-full rounded-2xl border p-4 text-left transition hover:border-brand ${
                hasLock ? "border-gold/60 bg-gold/5" : "border-line bg-panel/60 backdrop-blur"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] text-muted-foreground">
                  {a.date}
                  {a.cat && ` ｜ #${a.cat}`}
                </div>
                {hasLock && (
                  <span className="shrink-0 animate-pulse rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-black text-gold">
                    📖 手がかり
                  </span>
                )}
              </div>
              <div className="mt-1 font-bold">{a.title}</div>
              <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">{a.body[0]}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
