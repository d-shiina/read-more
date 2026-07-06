/**
 * 差し替え用の設定。実在ネタ（友人のハンドル／こなちゃん関連の言葉／思い出の日付など）を
 * ここに入れれば、コードを触らず謎の答えを変えられる。
 * ※ 縦スライスなので、いまは仮の答え。
 */
export const ANSWERS = {
  // こなちゃんの謎の答え：彼が「これは革命だ」と叫んだ動画編集ソフト＝AfterEffects（仮）
  frag: "aftereffects",
};

/** 表記ゆれ吸収：小文字化＋空白・記号を除去して比較 */
export function normalize(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s　・.／/-]+/g, "");
}

export function matches(input: string, answer: string): boolean {
  return normalize(input) === normalize(answer);
}
