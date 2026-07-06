"use client";

import { useEffect, useState } from "react";

/**
 * 隠しページに到達したら localStorage に進行を保存する。
 * ＝リロードしても「解いた」状態が残る（ブラウザ機能を使う）。
 */
export default function Cleared({ chapter }: { chapter: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const key = "readmore.progress";
      const raw = localStorage.getItem(key);
      const set: string[] = raw ? JSON.parse(raw) : [];
      if (!set.includes(chapter)) {
        set.push(chapter);
        localStorage.setItem(key, JSON.stringify(set));
      }
      // localStorageへの書き込みは正当な副作用。保存済み表示のためにstateを更新する。
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaved(true);
      window.dispatchEvent(new Event("readmore:progress"));
    } catch {
      /* localStorage不可でも進行はできる */
    }
  }, [chapter]);

  return (
    <p className="not-prose mt-8 text-xs text-fd-muted-foreground">
      {saved ? "✓ 進行状況を保存しました（このブラウザに記録）" : ""}
    </p>
  );
}
