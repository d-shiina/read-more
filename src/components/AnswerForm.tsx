"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * 答えをURLパスに変えて遷移する。＝「ブラウザである意味」の中核。
 * 正解なら隠しページが開き、外れなら専用404へ落ちる（判定はサーバー側）。
 */
export default function AnswerForm({ placeholder = "こたえ" }: { placeholder?: string }) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const go = () => {
    const v = value.trim();
    if (!v) return;
    router.push(`/${encodeURIComponent(v)}`);
  };

  return (
    <div className="not-prose my-6 rounded-xl border border-fd-border bg-fd-card p-4">
      <label className="mb-2 block text-sm font-medium text-fd-muted-foreground">
        「続きを読む」には、呪文（こたえ）が要る
      </label>
      <div className="flex gap-2">
        <input
          className="answer-input flex-1 rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-base outline-none focus:border-fd-primary"
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          onClick={go}
          className="rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground transition hover:opacity-90 active:scale-95"
        >
          続きを読む →
        </button>
      </div>
      <p className="mt-2 text-xs text-fd-muted-foreground">
        ※ 答えがわかったら、アドレスバーに <code>/こたえ</code> と打ってもいい。
      </p>
    </div>
  );
}
