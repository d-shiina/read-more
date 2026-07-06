/**
 * 差し替え用の設定。謎の答えをここに集約。実在ネタ（zaftxブログ由来）に対応。
 * 参考資料は blog-backup/README.md。
 */
export const ANSWERS = {
  // 第1の謎：Jokaのフラグムービーに憧れ、知って「革命が起こった」動画編集ソフト
  // ブログ本文の表記は "AfterEffect"（実製品は "After Effects"）。両方＋カタカナを許容。
  frag: [
    "aftereffect",
    "aftereffects",
    "アフターエフェクト",
    "アフターエフェクツ",
  ],
};

/** 表記ゆれ吸収：小文字化＋空白・記号を除去して比較 */
export function normalize(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s　・.／/-]+/g, "");
}

/** 単一 or 複数の正解いずれかに一致すれば true */
export function matches(input: string, answer: string | string[]): boolean {
  const list = Array.isArray(answer) ? answer : [answer];
  const n = normalize(input);
  return list.some((a) => normalize(a) === n);
}
