/**
 * ここは「差し替え用」の設定。実在ネタ（友人のハンドル／こなちゃん関連／思い出の日付など）を
 * ここに入れれば、コードを触らずに謎の答えを変えられる。
 *
 * ※ POC（最小版）なので、いまは仮の答えが入っている。
 */

export const ANSWERS = {
  // 第1話の答え：彼が「これは革命だ」と叫んだ動画編集ソフト＝AfterEffects（仮）
  chapter1: "aftereffects",
};

/** 表記ゆれ吸収：小文字化＋空白・記号を除去して比較する */
export function normalize(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s　・.／/]+/g, "");
}

export function matches(input: string, answer: string): boolean {
  return normalize(input) === normalize(answer);
}
