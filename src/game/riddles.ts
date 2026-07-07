/**
 * 謎データ。全10問。
 * 原則：答えはゲーム画面内に存在しない。原典（本人の実ブログ）を読まないと解けない。
 * 例外はブラウザ仕掛け問題（Q8=隠しURL / Q9=ソース読み）。
 */

export const BLOG_URL = "http://blog.livedoor.jp/zaftx/";

export interface Riddle {
  id: string;
  no: number;
  q: string[]; // 問題文（段落）
  placeholder: string;
  answers: string[]; // normalize後に比較
  hint: string; // ヒント（使用すると成績に響く）
  /** 正解時の一言 */
  ok: string;
}

export const RIDDLES: Riddle[] = [
  {
    id: "clan",
    no: 1,
    q: [
      "まずは原典を開け（上の「原典を開く」からどうぞ）。",
      "2011年4月16日、記念すべき1回目の更新。彼がメンバーを募集していたクランの名前は？",
    ],
    placeholder: "半角英数",
    answers: ["4gotten"],
    hint: "原典の一番古い記事（アーカイブの最下部）。クラン名は英数7文字。",
    ok: "そう、4gotten。今思えば名前が結末の予言だった。",
  },
  {
    id: "codename",
    no: 2,
    q: ["同じ記事より。", "AVAにおける彼のCodeNameは？　※恥ずかしい方。"],
    placeholder: "そのまま入力",
    answers: ["瞳を知り尽した男", "瞳を知り尽くした男", "瞳を知りつくした男"],
    hint: "「Alliance of Valiant Arms」の紹介欄。階級は中尉3（99％）。",
    ok: "瞳を知り尽した男（中尉3・99％）。何の瞳を、何のために。",
  },
  {
    id: "kakumei",
    no: 3,
    q: [
      "2011年7月12日 01:49 の記事。",
      "この夜、彼の中で“革命”が起こった。革命を起こした動画編集ソフトを、彼の表記どおりに答えよ。",
      "（ヒント：正式名称より1文字足りない）",
    ],
    placeholder: "英語で",
    answers: ["aftereffect", "aftereffects", "アフターエフェクト", "アフターエフェクツ"],
    hint: "記事「ブログ更新続けれるかな！？」の“続き”の中。Jokaのフラグムービーに憧れた流れで登場する。",
    ok: "AfterEffect（正式には After Effects）。革命は、まだ起こっていない。",
  },
  {
    id: "fe",
    no: 4,
    q: [
      "実は同じ夜、彼は12分前にもう1本記事を書いている。",
      "受験して、自己採点で落ちた国家試験。その略称（アルファベット2文字）は？",
    ],
    placeholder: "例: IT",
    answers: ["fe"],
    hint: "2011年7月12日 01:36 の記事。タグにも堂々と書いてある。",
    ok: "FE（基本情報技術者試験）。「あ～ｗ詰んだくせぇ・・・」は名言。",
  },
  {
    id: "song",
    no: 5,
    q: [
      "オフ会記事（2011年7月18日）より。",
      "カラオケで持ち曲が『ハッチポッチステーション』だった男。彼のクラン名義（4g.◯◯◯◯◯◯◯）は？",
    ],
    placeholder: "4g.は省略可",
    answers: ["ktarimo", "4g.ktarimo", "きいたりもん"],
    hint: "「クランのチームワーク向上につながるらしい」の人。楓と息がぴったりだった。",
    ok: "Ktarimo（きいたりもん）。選曲の意図は15年経っても不明。",
  },
  {
    id: "hellfox",
    no: 6,
    q: ["同じオフ会記事より。", "hellfox の勤務先コンビニは？（カタカナ4文字）"],
    placeholder: "カタカナ4文字",
    answers: ["ファミマ", "ふぁみま"],
    hint: "「◯◯◯◯の四つ星店員」。加藤ミリヤのGongだけ異様に上手い。",
    ok: "ファミマの四つ星店員。四つ星の基準は今も謎。",
  },
  {
    id: "forgotten",
    no: 7,
    q: [
      "クラン名『4gotten』——“4”を英語で読むと、ひとつの英単語が現れる。その単語は？",
      "……そして彼は2011年8月2日、その単語を地で行くタイトルの記事を書いた。",
    ],
    placeholder: "英単語",
    answers: ["forgotten"],
    hint: "4 = four = for。あとはくっつけて読む。記事タイトルは「ブログの存在を忘れかけていたぜ・・・」。",
    ok: "forgotten＝忘れられた。クラン名が伏線だった。",
  },
  {
    id: "hidden",
    no: 8,
    q: [
      "1回目の記事で、彼が全世界に公開してしまった連絡先ID（Skype）。",
      "そのIDは、このサイトの“隠しページの住所”でもある。",
      "いま見ているこのサイトのURLの末尾に /そのID を付けて開き、そこに書かれた合言葉を入力せよ。",
    ],
    placeholder: "合言葉",
    answers: ["ぺぺろんちーの", "ペペロンチーノ", "ぺぺろんちいの"],
    hint: "IDは z から始まる9文字。URL例：このページのアドレスの後ろに /zaft…… と続ける。",
    ok: "ご注文ありがとうございます。サイゼは今日も平和。",
  },
  {
    id: "source",
    no: 9,
    q: [
      "この問題の答えは、原典には無い。",
      "いま見ている“このページのソース”の中に置いてきた。",
      "（右クリック →「ページのソースを表示」、または F12）",
    ],
    placeholder: "ソースで見つけた言葉",
    answers: ["かすたむろぼ", "カスタムロボ"],
    hint: "HTMLのコメント（<!-- --> で囲まれた部分）を探せ。Ctrl+F が速い。",
    ok: "カスタムロボ。サイゼで白熱した、あの話題。",
  },
  {
    id: "shibaku",
    no: 10,
    q: [
      "最終問題。",
      "15年の沈黙を破った、2026年4月15日の更新。",
      "そのタイトルを、一字一句そのまま入力せよ。",
    ],
    placeholder: "一字一句そのまま",
    answers: ["お前らしばくぞｗ", "お前らしばくぞw", "おまえらしばくぞw", "おまえらしばくぞｗ"],
    hint: "原典のトップ、いちばん新しい記事。本文は無い。タイトルだけがある。",
    ok: "15年ぶりの生存報告が、恫喝。それでこそ彼。",
  },
];

/** 表記ゆれ吸収 */
export function normalize(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s　・.．。、！!？?／/\-＿_「」『』（）()]+/g, "");
}

export function matches(input: string, answers: string[]): boolean {
  const n = normalize(input);
  return answers.some((a) => normalize(a) === n);
}
