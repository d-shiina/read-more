import { ANSWERS } from "./config";

export interface Article {
  id: string; // URLスラッグ／識別子
  no: number;
  date: string; // 表示用
  title: string;
  category?: string;
  intro: string[]; // 「続きを読む」前
  more: string[]; // 「続きを読む」後
  riddle: {
    by: string; // 出題者（こな 等）
    comment: string; // ブログのコメント風の前振り
    question: string; // 設問
    hint?: string;
    answer: string | string[];
    /** ソースに隠すヒント（view-source用） */
    sourceClue?: string;
    /** 正解時のこなちゃんの返事 */
    reply: string[];
  };
}

/** サイドバーのアーカイブ表示用（実ブログの全10記事） */
export const ARCHIVE: { id: string; no: number; date: string; title: string }[] = [
  { id: "shibaku", no: 1, date: "2026-04-15", title: "お前らしばくぞｗ" },
  { id: "top", no: 2, date: "2013-12-25", title: "TOP(最新の記事は下からどうぞ）" },
  { id: "netakousatsu", no: 3, date: "2012-03-06", title: "ブログネタ考察" },
  { id: "ohisashiburi", no: 4, date: "2012-03-05", title: "お久しぶりです！" },
  { id: "wasure", no: 5, date: "2011-08-02", title: "ブログの存在を忘れかけていたぜ・・・" },
  { id: "offkai", no: 6, date: "2011-07-18", title: "オフ会してきた！" },
  { id: "css", no: 7, date: "2011-07-14", title: "CS:Sのクランお誘い" },
  { id: "kakumei", no: 8, date: "2011-07-12", title: "ブログ更新続けれるかな！？" },
  { id: "fe", no: 9, date: "2011-07-12", title: "基本情報技術者試験（FE）" },
  { id: "first", no: 10, date: "2011-04-16", title: "記念すべき1回目の更新" },
];

/** 縦スライスで実際に読める記事（AfterEffect＝革命の回） */
export const ARTICLES: Record<string, Article> = {
  kakumei: {
    id: "kakumei",
    no: 8,
    date: "2011年07月12日 01:49",
    title: "ブログ更新続けれるかな！？",
    category: "雑談",
    intro: [
      "最近なぜブログを開設したのか分からないくらい、更新していなかった。急に更新意欲が湧いてきたので、更新しました＞ｗ＜",
      "これからも更新していきたいと思うので是非SakayaNをよろしくお願いします！",
      "今日は、ネトゲの事ではなく最近興味が湧いてきたことを書いていこうかな( ´ﾟдﾟ｀)",
      "続きは、続きを読むからどうぞ！",
    ],
    more: [
      "最近フラグムービーに憧れるようになってきた。Jokaの新しいフラグムービーが楽しみで楽しみでしょうがないのだ。そうやって動画を見たりしてるうちに自分も、フラグムービーとまでは言わないが、動画を作ってみたいと思った。",
      "いいアイディアを動画に取り込んだり、遊びのある字幕などを作るのには、AfterEffectを使うことを初めて知った。",
      "正直自分の中で革命が起こったようだった・・・",
      "ということで、AfterEffectを使った画像の作成から初めてみようと思う。一から始めるので、分からないことばかりですが自分なりに調べたりして、ある程度使えるようになりたいと思います！！ それが出来るようになったら、なんか動画作ってみようかなー",
    ],
    riddle: {
      by: "こな",
      comment: "ねぇ、この記事、久しぶりに読み返したんだけど…あなたの“はじまり”だよね。",
      question:
        "この日、彼の中で「革命が起こった」。その革命を起こした動画編集ソフトの名前を、正式名称で答えて。",
      hint: "頭文字は Ae。空白や大文字小文字は気にしなくていい。",
      answer: ANSWERS.frag,
      sourceClue: "次の合言葉: 彼のクラン名は 4gotten（＝忘れられた）。",
      reply: [
        "……正解。ふふ、ちゃんと読んだね。",
        "「自分の中で革命が起こった」——このたった一行が、ぜんぶの始まりだった。",
        "フラグムービーに憧れて、AfterEffect を触りはじめた、あの夏。",
        "ねえ。結局あなた、あのあと……動画は作れたの？　……続きは、また今度ね。",
      ],
    },
  },
};

export const SLICE_ARTICLE_ID = "kakumei";
