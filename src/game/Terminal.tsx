"use client";

import { useEffect, useRef, useState } from "react";

type Line = { t: string; c?: string };

const BOOT: Line[] = [
  { t: "4gotten secure terminal — v0.9.3  (2011 build)", c: "term-dim" },
  { t: "establishing uplink ...................... OK" },
  { t: "handshake @ zaftzaft3 .................... OK" },
  { t: "mounting  /home/zaftx/blog .............. OK" },
  { t: "" },
  { t: "[auth]  user=SakayaN   clan=4gotten   rank=中尉4", c: "term-amber" },
  { t: "[auth]  last login: 2013-12-25  from GTX-780Ti", c: "term-dim" },
  { t: "[warn]  10 logs found — 9 ENCRYPTED", c: "term-amber" },
  { t: "" },
];

const BANNER = [
  "  ██████ ███████  █████  ██████    ███    ███  ██████  ██████  ███████",
  "  ██  ██ ██      ██   ██ ██   ██   ████  ████ ██    ██ ██   ██ ██     ",
  "  ██████ █████   ███████ ██   ██   ██ ████ ██ ██    ██ ██████  █████  ",
  "  ██  ██ ██      ██   ██ ██   ██   ██  ██  ██ ██    ██ ██   ██ ██     ",
  "  ██  ██ ███████ ██   ██ ██████    ██      ██  ██████  ██   ██ ███████",
];

const LS: Line[] = [
  { t: "zaftx@4gotten:~$ ls ./blog", c: "" },
  { t: "  2011-04-16_hajimete.log ........... [OPEN]", c: "term-cyan" },
  { t: "  2011-07-12_kihonjoho.log .......... [LOCKED]", c: "term-dim" },
  { t: "  2011-07-12_kakumei.log ............ [LOCKED]", c: "term-dim" },
  { t: "  2011-07-14_css.log ................ [LOCKED]", c: "term-dim" },
  { t: "  2011-07-18_offkai.log ............. [LOCKED]", c: "term-dim" },
  { t: "  2011-08-02_forgotten.log .......... [LOCKED]", c: "term-dim" },
  { t: "  2012-03-05_ohisashiburi.log ....... [LOCKED]", c: "term-dim" },
  { t: "  2013-12-25_newpc.log .............. [LOCKED]", c: "term-dim" },
  { t: "  2026-04-15_shibakuzo.log .......... [???]", c: "term-magenta" },
  { t: "" },
  { t: "kona@skype » おかえり。……まだ、このサーバー生きてたんだ。", c: "term-magenta" },
  { t: "kona@skype » 復号キーは、記事の中に散らばってる。1個ずつ、いこ？", c: "term-magenta" },
  { t: "" },
];

export default function Terminal() {
  const [shown, setShown] = useState(0);
  const [banner, setBanner] = useState(false);
  const [history, setHistory] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const total = BOOT.length + LS.length;
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 起動シーケンスを1行ずつ表示
  useEffect(() => {
    if (shown >= total) return;
    const isBanner = shown === BOOT.length;
    const t = setTimeout(
      () => {
        if (isBanner) setBanner(true);
        setShown((s) => s + 1);
      },
      shown < BOOT.length ? 260 : 90,
    );
    return () => clearTimeout(t);
  }, [shown, total]);

  const ready = shown >= total;

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [shown, history]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const out: Line[] = [{ t: `zaftx@4gotten:~$ ${cmd}` }];
    const c = cmd.toLowerCase();
    if (c === "help") {
      out.push(
        { t: "commands:", c: "term-amber" },
        { t: "  ls            — ログ一覧を表示", c: "term-dim" },
        { t: "  cat <file>    — ログを読む（復号キーが要る）", c: "term-dim" },
        { t: "  open <key>    — 鍵を入力してロックを解く", c: "term-dim" },
        { t: "  whoami        — ？", c: "term-dim" },
        { t: "", },
      );
    } else if (c === "whoami") {
      out.push({ t: "SakayaN / 4g.MiNaMi / さかやん / みるくふぁいたー …名前が多すぎる。", c: "term-cyan" }, { t: "" });
    } else if (c === "ls") {
      LS.slice(0, 10).forEach((l) => out.push(l));
      out.push({ t: "" });
    } else if (c.startsWith("cat")) {
      out.push({ t: "ENCRYPTED — このログは復号キーが必要。`open <key>` を試せ。", c: "term-amber" }, { t: "" });
    } else if (c === "") {
      // no-op
    } else {
      out.push({ t: `command not found: ${cmd}   （\`help\` で一覧）`, c: "term-amber" }, { t: "" });
    }
    setHistory((h) => [...h, ...out]);
    setInput("");
  };

  return (
    <div
      ref={scrollRef}
      className="crt min-h-[100dvh] w-full overflow-y-auto px-4 py-5 text-[13px] leading-relaxed sm:px-8 sm:text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mx-auto max-w-3xl">
        {/* boot lines */}
        {BOOT.slice(0, Math.min(shown, BOOT.length)).map((l, i) => (
          <div key={`b${i}`} className={l.c}>
            {l.t || " "}
          </div>
        ))}

        {/* banner */}
        {banner && (
          <pre className="my-2 select-none whitespace-pre text-[7px] leading-[1.1] text-[color:var(--term)] sm:text-[10px]">
            {BANNER.join("\n")}
          </pre>
        )}
        {banner && (
          <div className="term-dim mb-2">
            // 放置された個人サーバー。ログを復号して“続き”を読め。
          </div>
        )}

        {/* ls + kona */}
        {BOOT.length < shown &&
          LS.slice(0, shown - BOOT.length).map((l, i) => (
            <div key={`l${i}`} className={l.c}>
              {l.t || " "}
            </div>
          ))}

        {/* command history */}
        {history.map((l, i) => (
          <div key={`h${i}`} className={l.c}>
            {l.t || " "}
          </div>
        ))}

        {/* live prompt */}
        {ready && (
          <div className="flex items-center">
            <span className="mr-2 shrink-0">zaftx@4gotten:~$</span>
            <span className="whitespace-pre">{input}</span>
            <span className="cursor-blink">█</span>
            <input
              ref={inputRef}
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run(input)}
              className="absolute h-px w-px opacity-0"
              aria-label="コマンド入力"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}

        {ready && history.length === 0 && (
          <div className="term-dim mt-4">▸ `help` と打つと使えるコマンドが出る。</div>
        )}
      </div>
    </div>
  );
}
