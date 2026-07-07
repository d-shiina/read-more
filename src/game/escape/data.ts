/**
 * read more: ESCAPE — 全ゲームデータ。
 * 記事・ツイートの原文は blog-backup/README.md（彼のブログ全10記事＋2012年ツイート）から。
 */

/* ================= 共通スタイル ================= */

export const BTN =
  "mt-4 w-full rounded-xl bg-brand py-3 text-base font-black text-[#062a33] shadow-[0_0_16px_rgba(63,214,230,0.3)] transition hover:brightness-110 active:translate-y-px";
export const BTN_SUB =
  "mt-3 w-full rounded-xl border border-line bg-panel py-2.5 text-sm font-bold text-text transition hover:border-brand";

/* ================= こな度 ================= */

export const KONA_MAX = 6;
export const KONA_FACES = [
  "( ´・ω・)",
  "(・ω・)",
  "(・ω・)ノ",
  "(｀・ω・´)",
  "(*´ω｀*)",
  "(＞ω＜)",
  "(＞ω＜)💗",
];

/* ================= アイテム（第4章タイムラインの素材） ================= */

export interface ItemDef {
  id: string;
  icon: string;
  name: string;
  date: string;
  desc: string;
}

export const ITEMS: Record<string, ItemDef> = {
  bullet: {
    id: "bullet",
    icon: "🔫",
    name: "SRの弾丸",
    date: "2010年頃",
    desc: "SuddenAttack時代、Jokaに撃ち方を教わった頃の記念品。「エイムは、ずらして合わせろ」",
  },
  tag: {
    id: "tag",
    icon: "🏷️",
    name: "クランタグ「4g.」",
    date: "2011年4月16日",
    desc: "クラン4gotten（=forgotten）の一員である証。ガチガチでやるのはあまり好きじゃない。",
  },
  stub: {
    id: "stub",
    icon: "🎫",
    name: "受験票の半券",
    date: "2011年7月10日",
    desc: "基本情報技術者試験（FE）。自己採点の結果は聞くな。",
  },
  receipt: {
    id: "receipt",
    icon: "🧾",
    name: "サイゼのレシート",
    date: "2011年7月18日",
    desc: "ペペロンチーノ多数。AVAの話のはずが、なぜかカスタムロボの話で3時間。",
  },
};

/** 第4章: タイムラインの正しい並び（古い順） */
export const TIMELINE_ANSWER = ["bullet", "tag", "stub", "receipt"];

/* ================= 未練（章）メタ ================= */

export const SEALS = [
  { no: 1, icon: "🎫", title: "試験", hint: "「基本情報技術者試験（FE）」の記事に錠前がかかっている" },
  { no: 2, icon: "🎤", title: "クラン", hint: "「オフ会してきた！」の記事に錠前がかかっている" },
  { no: 3, icon: "🎯", title: "師匠", hint: "「TOP」の記事のどこかに、致命的なミスが眠っている" },
  { no: 4, icon: "🎞", title: "革命", hint: "未レンダリングのプロジェクトファイルが記事一覧に落ちている" },
  { no: 5, icon: "💗", title: "こなちゃん", hint: "old_twitter_backup.zip …… 開けるか？" },
];

/** 現在の目標テキスト */
export function objectiveText(chapter: number): string {
  switch (chapter) {
    case 0:
      return "本人確認: 最初の記事を読んで、自分のSkype IDを思い出せ";
    case 1:
      return "未練①「試験」— FEの記事の錠前を解け";
    case 2:
      return "未練②「クラン」— オフ会の記事の錠前を解け";
    case 3:
      return "未練③「師匠」— TOPの記事で、SRを構えろ";
    case 4:
      return "未練④「革命」— project_kakumei.aep をレンダリングせよ";
    case 5:
      return "未練⑤「こなちゃん」— old_twitter_backup.zip を開け";
    default:
      return "すべての未練は解かれた";
  }
}

/* ================= ブログ記事（原文） ================= */

export interface Article {
  id: string;
  date: string;
  title: string;
  cat: string;
  /** この章以降で解凍される */
  minChapter: number;
  /** モダンすぎるAI要約 */
  ai: string;
  /** リアクション初期値 */
  reactions: [number, number, number, number]; // 👍 ＞ｗ＜ 🔥 😢
  body: string[];
}

export const ARTICLES: Article[] = [
  {
    id: "a10",
    date: "2026年04月15日 21:19",
    title: "お前らしばくぞｗ",
    cat: "",
    minChapter: 5,
    ai: "AIによる要約: 本文がありません。AIにも限界があります。",
    reactions: [1145, 141, 9, 3],
    body: ["（本文なし）"],
  },
  {
    id: "a9",
    date: "2013年12月25日 00:00",
    title: "TOP(最新の記事は下からどうぞ）",
    cat: "お知らせ",
    minChapter: 3,
    ai: "AIによる要約: PCの自慢です。",
    reactions: [24, 8, 3, 0],
    body: [
      "この記事は常にTOPに表示されます。",
      "このブログは主にA.V.A(Alliance of Variant Arms)について書いていきます。他のネットゲームについて触れたりもするかもしれません。",
      "日本語を上手にまとめるのは苦手です。読みにくい、日本語がおかしい、そんな点が多々あるとは思いますが温かい眼で見守ってやってください。",
      "NewPCになったのでTOPページ更新します！",
      "スペック↓ OS: Windows 7 Home Premium ／ CPU: Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz ／ RAM: 16GB ／ VGA: NVIDIA GeForce GTX 780 Ti ／ Sound: Sound Blaster ZxR ／ HeadSet: Sennheiser GAME ZERO ／ Mouse: SteelSeries SENSEI [RAW] ／ MousePad: ARTISAN 飛燕 XSOFT Lサイズ",
      "旧ＰＣには約6年お世話になりました。いままでありがとう！今までスペック不足に悩まされてきたので、今回少し奮発して予算にゆとりを持って組みました！次はモニターがほしい・・・ｗ",
    ],
  },
  {
    id: "a8",
    date: "2012年03月06日 18:36",
    title: "ブログネタ考察",
    cat: "雑談",
    minChapter: 2,
    ai: "AIによる要約: 画像を入れたいがスペックがない。以上。",
    reactions: [5, 12, 0, 2],
    body: [
      "ブログを更新することはできる。だが、文章しか書いていないことに気がついた。",
      "画像とか、動画とかを取り入れたほうがいいのかな？",
      "でも、動画取れるほどスペックないよね╰( ･´ｰ･｀)╯",
      "以上⌒*( ◖◡◗✰)*ﾟ⌒",
    ],
  },
  {
    id: "a7",
    date: "2012年03月05日 03:30",
    title: "お久しぶりです！",
    cat: "雑談",
    minChapter: 2,
    ai: "AIによる要約: みるくふぁいたー氏への風評被害が確認されました。",
    reactions: [8, 15, 1, 0],
    body: [
      "みなさんお久しぶり！4g.MiNaMiです。今日も自己満ブログ更新していくよ！？",
      "今日は久々にSuddenAttackをプレイした。旧友のInElyとCraneのみなさんと一緒にCWした。全然役に立てず、足引っ張ってばっかりだけど楽しかった！またやりましょう＞ｗ＜",
      "さてさてこの調子でブログ更新していこうと思います。みなさんよろしくお願いします！",
      "みるくふぁいたーのブログ更新する詐欺にならんように気を付けないと( ｰ`дｰ´)ｷﾘｯ",
    ],
  },
  {
    id: "a6",
    date: "2011年08月02日 06:40",
    title: "ブログの存在を忘れかけていたぜ・・・",
    cat: "雑談",
    minChapter: 2,
    ai: "AIによる要約: Jokaさまぁあああ（要約に失敗しました）",
    reactions: [11, 20, 2, 1],
    body: [
      "どうも、さかやんです。最近、4gotten内での意見の衝突などがあったりして、ブログの更新すっかり忘れてましたね＞ｗ＜",
      "次の目標は、10月のAVA RCT Season4でDランカー以上になること！！",
      "自分はクラン内でスナ専やってるんですが、基本詰めたがりだからたま～にイライラしちゃったりする。最初はやる人が居ないからSRを持っていたんだけど、最近はAIMも安定してきてスコアは安定するようになった。",
      "クラン内メンツの中では、一番FPS歴が長かったりするので教えられるよりも、教えるほうが多かったり＞ｗ＜ Jokaと一緒にSAやってたときは、色々と教えてもらってたなー。",
      "SRの立ち回りについて教えてよ！Jokaさまぁあああああああああああああああ",
      "ということで今度なんか一緒にやろうねぃ！",
    ],
  },
  {
    id: "a5",
    date: "2011年07月18日 22:24",
    title: "オフ会してきた！",
    cat: "雑談",
    minChapter: 1,
    ai: "AIによる要約: 全員リアフレのオフ会という高度な矛盾。楽しかったようです。",
    reactions: [33, 41, 6, 0],
    body: [
      "いかんいかん、微妙に更新サボってしまった。まあいつものことだけどね！！！！",
      "AVARCTは二回戦でボコボコにされてしまった。正直くやしい＞＜これからもっと練習や！見据えるのはSeason4！次こそはDランカーだ！",
      "今日は4gottenのメンツ（「4g.MiNaMi」「4g.KeNSiN」「4g.Ktarimo」「4g.Erwich」「hellfox」）でカラオケに行ってきた！オフ会っていっても全員リアフレなんだけどねｗ",
      "楓ことKeNSiNが歌うますぎて若干ひいた！そして彼のテンションは異常だった・・・！これからはクラン専属DeathVoice担当になってもらいますね！",
      "きいたりもんことKtarimoの持ち曲は「ハッチポッチステーション」だった。クランのチームワーク向上につながるらしい＞ｗ＜楓と組ませたら息がぴったりだった。",
      "フィッツことErwichは控えめに歌っていた！楓ときいたりもんのテンションに飲まれて浮いていた。CWの時はしっかり声だしていくんだぜ！？",
      "hellfoxことファミマの四つ星店員は、加藤ミリヤが好きのようだ。なぜかGongを歌う時だけやたらとテンションが高かったｗ今日もバイクに跨って帰っていった・・・",
      "そして私は・・・///",
      "カラオケの後は皆でサイゼリアにIN。ペペロンチーノなどを頼みAVAの話や、なぜかカスタムロボの話に発展！ワイワイガヤガヤ話して疲れました(*´ω｀*)",
      "楽しい一日でした！またいこうね（＞ｗ＜）ノシ",
    ],
  },
  {
    id: "a4",
    date: "2011年07月14日 03:36",
    title: "CS:Sのクランお誘い",
    cat: "雑談",
    minChapter: 1,
    ai: "AIによる要約: CS:Sは未購入のままやる気だけが先行しています。",
    reactions: [9, 14, 1, 1],
    body: [
      "どうも、さかやんですよん＞ｗ＜",
      "AVA大会組合せが発表されました。1試合目はBlackScent（綴りあってるかな？）とのことで特訓中であります。",
      "昨日、GSG9時代のクラン仲間だったテクからチャットが来た！なにごとぞ！？と思ったがとりあえず返信。",
      "さかやん「ひさしぶり＞ｗ＜」／てく「CS:Sやろうぜ！」／さかやん「！？」",
      "ということでCS:Sをやることになった次第であります。実はまだCS:S買ってないので、買ってからの活動開始になりますｗｗｗ",
      "最近Jokaはなにしてるんだろう？そう思うことがよくあります。ブログを見ても更新されてないしSkypeでもあまり見かけないことが多くなった。また今度一緒になんかやろうね！",
    ],
  },
  {
    id: "a3",
    date: "2011年07月12日 01:49",
    title: "ブログ更新続けれるかな！？",
    cat: "雑談",
    minChapter: 1,
    ai: "AIによる要約: 革命は起こりましたが、その後15年間何も起こっていません。（※ソフト名の綴りについては、指摘を控えます）",
    reactions: [19, 27, 15, 4],
    body: [
      "最近なぜブログを開設したのか分からないくらい、更新していなかった。急に更新意欲が湧いてきたので、更新しました＞ｗ＜",
      "最近フラグムービーに憧れるようになってきた。Jokaの新しいフラグムービーが楽しみで楽しみでしょうがないのだ。そうやって動画を見たりしてるうちに自分も、フラグムービーとまでは言わないが、動画を作ってみたいと思った。",
      "いいアイディアを動画に取り込んだり、遊びのある字幕などを作るのには、AfterEffectを使うことを初めて知った。",
      "正直自分の中で革命が起こったようだった・・・",
      "ということで、AfterEffectを使った画像の作成から初めてみようと思う。それが出来るようになったら、なんか動画作ってみようかなー（´◞≼⓪≽◟◞౪◟◞≼⓪≽◟｀）",
    ],
  },
  {
    id: "a2",
    date: "2011年07月12日 01:36",
    title: "基本情報技術者試験（FE）",
    cat: "雑談",
    minChapter: 1,
    ai: "AIによる要約: 落ちた。",
    reactions: [7, 31, 0, 22],
    body: [
      "みなさんお久しぶりです＞ｗ＜もう初夏だなんて言えないくらいの猛暑が続いてますね。みなさん、熱中症には気おつけてくださいねー。",
      "7月10日、午後13時～15時30分：基本情報技術者試験（FE）を受けてまいりました。",
      "問題を見た瞬間、「あ～ｗ詰んだくせぇ・・・」と思いましたが、自分の中で納得出来る解答を必死に考え解答してきました。",
      "結論から言うと、自己採点の結果「不合格・・・」になりました。",
      "選択式の問題なのですが、極端に合っている設問か、極端に間違っている設問の2つが目立ちました。心機一転気を引き締めて、秋の試験までに苦手分野を克服し次の試験こそは絶対受かってみせます！",
    ],
  },
  {
    id: "a1",
    date: "2011年04月16日 17:16",
    title: "記念すべき1回目の更新",
    cat: "雑談",
    minChapter: 0,
    ai: "AIによる要約: ゲームを2本紹介しています。クランメンバーは集まりませんでした。",
    reactions: [42, 18, 2, 0],
    body: [
      "どうも、さかやんです＞ｗ＜ 日本語に難があるのは仕様です。更新は気がつけば更新と言うことでお願いします！ｗ",
      "学業も就職活動もネット活動も忙しいというカオスな1年をすごしている今日この頃です。さて、実は書くことがないので現在やっているゲームの紹介をしますね！",
      "【Alliance of Valiant Arms（AVA）】CodeName: 瞳を知り尽した男 ／ 階級: 中尉3（99％）",
      "ＰＣ買ってからFPSをやってきましたが、最近はずっとAVAやってますねー＞ｗ＜ 無料FPSゲームの中では一番リアル（グラフィックがだよん）だと思います。",
      "現在クラン「4gotten」ではクランメンバーを募集しております。世間一般で言われるガチクランとは程遠いクランで現在は作戦などもない状況ですｗ 興味のある方はこの記事のコメントに書いていただくかSkypeで zaftzaft3 まで連絡頂けると幸いです。",
      "【Toy Wars】CodeName: SakayaN ／ 階級: 18",
      "最初はFPSだと思っていたのですが、プレイしてみるとTPSでした。「バズーカゲーｗｗｗ」の一言に尽きます。",
      "一緒にやろー！って方がもしいたら一緒にやりましょー＞ｗ＜それでは今日はこの辺でー",
    ],
  },
];

/** 各記事に紐づく錠前（この章のときだけパズルが出る） */
export const ARTICLE_PUZZLE: Record<string, number> = {
  a1: 0, // 本人確認（Skype ID）
  a2: 1, // 未練① 試験
  a5: 2, // 未練② クラン
  a9: 3, // 未練③ 師匠（誤字スナイプ）
};

/* ================= 未練① 試験 ================= */

export const EXAM_PIN = "0710";

export interface ExamQ {
  q: string;
  opts: string[];
  a: number;
}

/** 極端に合っている設問か、極端に間違っている設問しか出ない（原文再現） */
export const EXAM: ExamQ[] = [
  {
    q: "問1. 管理人のマウスパッドとして正しいものはどれか。",
    opts: ["ヨドバシカメラのチラシ", "現代アート", "ARTISAN 飛燕 XSOFT Lサイズ", "太もも"],
    a: 2,
  },
  {
    q: "問2. 管理人のAVAでのCodeNameとして正しいものはどれか。",
    opts: ["瞳を知り尽した男", "目がとてもいい男", "瞳を知りたい男（願望）", "視力2.0"],
    a: 0,
  },
  {
    q: "問3. 管理人をCS:Sに誘ったGSG9時代の旧友は誰か。",
    opts: ["Joka", "ひろゆき", "母", "テク"],
    a: 3,
  },
  {
    q: "問4. 2011年7月10日、FE試験の自己採点の結果はどうなったか。",
    opts: ["満点", "不合格", "合格", "試験会場を間違えた"],
    a: 1,
  },
];

/* ================= 未練② クラン（カラオケ採点表） ================= */

export const KARAOKE_PEOPLE = [
  "楓（KeNSiN）",
  "きいたりもん（Ktarimo）",
  "フィッツ（Erwich）",
  "hellfox",
  "私（4g.MiNaMi）",
];

export const KARAOKE_TRAITS = [
  "歌うますぎて若干ひく。即日、クラン専属DeathVoice担当に任命",
  "持ち曲は「ハッチポッチステーション」。チームワーク向上につながるらしい",
  "控えめに歌う。二人のテンションに飲まれて浮いていた",
  "加藤ミリヤ推し。Gongの時だけ謎に覚醒し、バイクで帰宅",
  "・・・///（本人による記録はここで途切れている）",
];

/** i人目の正解トレイトindex */
export const KARAOKE_ANSWER = [0, 1, 2, 3, 4];
/** 初期割り当て（全員ハズレの完全順列） */
export const KARAOKE_INITIAL = [1, 2, 3, 4, 0];

export const KARAOKE_WORD = /^(forgotten|フォーガットン|フォーガトン)$/i;

/* ================= 未練③ 師匠（誤字スナイプ） ================= */

/** TOP記事をトークン化したもの。標的は実在の誤記「Variant」（正: Valiant） */
export const SNIPE_LINES: string[][] = [
  ["この記事は", "常に", "TOPに", "表示されます。"],
  [
    "このブログは", "主に", "A.V.A", "(", "Alliance", "of", "Variant", "Arms", ")",
    "について", "書いて", "いきます。",
  ],
  ["他の", "ネットゲーム", "について", "触れたり", "もする", "かもしれません。"],
  [
    "日本語を", "上手に", "まとめるのは", "苦手です。", "読みにくい、", "日本語が", "おかしい、",
    "そんな点が", "多々ある", "とは", "思いますが", "温かい眼で", "見守って", "やってください。",
  ],
];

export const SNIPE_TARGET = "Variant";

/* ================= 未練④ 革命（フラグムービー） ================= */

/** 起動エラー: 15年間、革命の相手の名前を間違えて覚えていた（実話） */
export const SPELL_QUIZ: { label: string; ok: boolean; msg: string }[] = [
  {
    label: "AfterEffect",
    ok: false,
    msg: "それが15年間の間違いだ＞ｗ＜　ブログに何回書いたと思ってる。",
  },
  {
    label: "After Effects",
    ok: true,
    msg: "起動に成功しました。……そうか、最後に s が付くのか。15年目の真実。",
  },
  {
    label: "AfterEffects",
    ok: false,
    msg: "惜しい！　sは付けた。スペースだ、スペースが足りない！",
  },
  {
    label: "アフターエフェクト",
    ok: false,
    msg: "カタカナで逃げるな。",
  },
];

export const MOVIE_FRAMES: { t: string; s: string }[] = [
  { t: "2010", s: "SuddenAttack —— Jokaに出会う。SRを教わる。" },
  { t: "2011.04.16", s: "AVA。クラン「4gotten」。瞳を知り尽した男、爆誕。" },
  { t: "2011.07.10", s: "基本情報技術者試験。——詰んだくせぇ。" },
  { t: "2011.07.12", s: "AfterEffectを知る。革命が起こる。" },
  { t: "2011.07.18", s: "オフ会。カラオケ。サイゼのペペロンチーノ。" },
  { t: "2012", s: "タイムラインに、こなちゃんという光。" },
  { t: "2013.12.25", s: "NewPC。i7-4790K。次はモニターがほしい・・・ｗ" },
  { t: "・・・", s: "更新が、止まる。" },
  { t: "2026.04.15", s: "「お前らしばくぞｗ」——15年ぶりの生存報告。" },
  { t: "革命、完遂。", s: "Presented by 4g.MiNaMi ＞ｗ＜" },
];

/* ================= 未練⑤ こなちゃん（旧Twitterログ） ================= */

export interface Tweet {
  date: string;
  text: string;
}

export const TWEETS: Tweet[] = [
  { date: "2012.02.17", text: "こなちゃんおかえりー私はまだ学校にいるー＞ｗ＜後1時間くらいで家にいると思うー！今日は過疎るのかな？ｗ木曜日の次って大概過疎るよね(´・∀・｀)" },
  { date: "2012.02.21", text: "その発想はなかったｗぴかぴかりーん！こなちゃんはニコ動鑑賞してるん＞ｗ＜？" },
  { date: "2012.02.22", text: "こなちゃんTSこいやぁああああ⌒*( ◖◡◗✰)*ﾟ⌒" },
  { date: "2012.02.26", text: "やっと睡魔が襲ってきた⌒*( ◖◡◗✰)*ﾟ⌒こなちゃんちゃんと起きれたのだろうか？" },
  { date: "2012.03.08", text: "こなちゃん早く戻っておいでー" },
  { date: "2012.03.10", text: "こなちゃん起きるのはや！とか思ったけど……（義務教育ネタ、詳細割愛）" },
  { date: "2012.03.11", text: "暇ーこなちゃんTSはよ！" },
  { date: "2012.03.12", text: "二度寝とか甘えー、こなちゃんマイクラの鯖立ててからいってくれたらうれしい！" },
  { date: "2012.03.15", text: "なるほど、こなちゃんはデザートにうるさいお方とφ( ･´ｰ･｀)" },
  { date: "2012.03.17", text: "こなちゃん最近泣き顔文字ばっかやん！元気だせよ⌒*( ◖◡◗✰)*ﾟ⌒" },
  { date: "2012.05.12", text: "気合入ったこなちゃん想像して笑ったわ╰( ･´ｰ･｀)╯" },
  { date: "2012.05.13", text: "いつの間にかこなちゃん帰ってきとるやん(゜∀。)" },
  { date: "2012.06.27", text: "とりあえず8で作ることにした＞ｗ＜こなちゃんとか別の所で作ってるみたいやけど、みんな8おいで！" },
  { date: "2012.07.10", text: "こなだけに、粉まみれってか！九州と味違ったりしたー？⌒*( ◖◡◗✰)*ﾟ⌒" },
];

/** 送信直前で時が止まっているダジャレ */
export const FROZEN_TWEET = "こなだけに、粉まみれってか！九州と味違ったりしたー？⌒*( ◖◡◗✰)*ﾟ⌒";

/* ================= こなちゃんDMスクリプト ================= */

export interface DmChoice {
  label: string;
  reply: string;
  kona: number;
}

export interface DmExchange {
  id: string;
  minChapter: number;
  /** このフラグが立ったら出現（寄り道イベント） */
  requiresFlag?: string;
  lines: string[];
  choices?: DmChoice[];
  /** 選択後に出るモノローグ/ヒント */
  after?: string;
}

export const DM_SCRIPT: DmExchange[] = [
  {
    id: "dm0",
    minChapter: 1,
    lines: ["……え、このアカウント生きてたの？", "まさかと思うけど……さかやん？"],
    choices: [
      {
        label: "久しぶり。……その、元気だった？",
        reply: "！　うん、元気。……ほんとに久しぶりじゃん。14年ぶり？　ばか(´；ω；｀)",
        kona: 1,
      },
      {
        label: "誰でしたっけ",
        reply: "こ・な！　マイクラとニコ生の！　……忘れてたら泣くよ？",
        kona: 0,
      },
    ],
  },
  {
    id: "dm1",
    minChapter: 2,
    lines: ["ねえ、FEの記事見つけちゃった。『あ～ｗ詰んだくせぇ・・・』って", "ふふ"],
    choices: [
      {
        label: "笑うなよ、あれ本気で凹んだんだぞ",
        reply: "知ってる。次の日、TSでずーっと静かだったもん。……ちゃんと見てたよ",
        kona: 1,
      },
      {
        label: "記憶にないなあ",
        reply: "都合悪いことすぐ忘れるじゃん！＞ｗ＜",
        kona: 0,
      },
    ],
  },
  {
    id: "dm2",
    minChapter: 3,
    lines: ["オフ会の記事さ、『そして私は・・・///』で終わってるの、気になりすぎない？", "結局、何歌ったの？"],
    choices: [
      {
        label: "今度カラオケで直接聞かせるよ",
        reply: "え。……それ、誘ってる？　……行く(小声)",
        kona: 1,
      },
      {
        label: "加藤ミリヤ",
        reply: "それはhellfoxさんでしょ！＞ｗ＜",
        kona: 0,
      },
    ],
  },
  {
    id: "dm3",
    minChapter: 4,
    lines: [
      "ね、覚えてる？　マイクラの鯖、立てててって言ったの",
      "『二度寝とか甘えー』とか言われてさ。……結局、一緒に遊べずじまいだったね",
    ],
    choices: [
      {
        label: "その約束、まだ有効？",
        reply: "……！　有効。ずっと有効だったよ、ばか",
        kona: 1,
      },
      {
        label: "二度寝は甘え（14年ぶり2回目）",
        reply: "進歩なし！＞ｗ＜",
        kona: 0,
      },
    ],
    after: "（このブログ、検索欄があったな……。「マイクラ」……）",
  },
  {
    id: "dm_minecraft",
    minChapter: 1,
    requiresFlag: "minecraft",
    lines: ["え、待って。鯖立てたの？　今？", "14年越しじゃん……。ばか。……うれしい(´；ω；｀)"],
  },
  {
    id: "dm_dessert",
    minChapter: 1,
    requiresFlag: "dessert",
    lines: ["プリン！？　覚えててくれたの、デザートの話", "……デザートは全てを解決する。今も昔もね(｀・ω・´)"],
  },
  {
    id: "dm_thanks",
    minChapter: 5,
    requiresFlag: "thanks_kona",
    lines: ["ムービーのSpecial Thanks……ずるいよ、あんなの", "泣いちゃったじゃん"],
  },
  {
    id: "dm4",
    minChapter: 5,
    lines: ["ムービー見たよ。あなたの15年、ぎゅっとしてた", "……ねえ。最後の未練って、なに？"],
    choices: [
      {
        label: "多分、君のことだ",
        reply: "…………ばか。……早く解いてよ、それ",
        kona: 1,
      },
      {
        label: "AfterEffectの操作方法",
        reply: "そこはさっき解決したでしょ！＞ｗ＜",
        kona: 0,
      },
    ],
  },
];

/** 現在見えているDM行数（未読バッジ用） */
export function dmLineCount(chapter: number, flags: Record<string, boolean>): number {
  let n = 0;
  for (const ex of DM_SCRIPT) {
    if (ex.minChapter > chapter) continue;
    if (ex.requiresFlag && !flags[ex.requiresFlag]) continue;
    n += ex.lines.length;
    if (ex.choices && flags[`dm:${ex.id}`]) n += 2;
  }
  return n;
}

/* ================= 実績 ================= */

export interface AchDef {
  id: string;
  label: string;
  hint: string;
}

export const ACH_DEFS: AchDef[] = [
  { id: "locked", label: "📖 閉じ込められた", hint: "ゲームを始める" },
  { id: "skype", label: "🔑 Skype世代", hint: "本人確認を突破する" },
  { id: "exam0", label: "📝 極端に間違っている", hint: "ミニ試験、逆にすごい点を取る" },
  { id: "exam4", label: "🎓 極端に合っている", hint: "ミニ試験、満点" },
  { id: "deathvoice", label: "🎤 採点表マスター", hint: "カラオケ採点表を一発で全問正解" },
  { id: "sniper", label: "🎯 Jokaの後継者", hint: "誤字をノーミスで狙撃（🪖と排他）" },
  { id: "grenade", label: "🪖 グレで飛びすぎ", hint: "狙撃を3回外す（🎯と排他）" },
  { id: "spell", label: "🔤 革命家、綴りを知る", hint: "あのソフト、15年間なんて呼んでた？" },
  { id: "movie", label: "🎞 革命、完遂", hint: "15年越しにレンダリングを完了する" },
  { id: "tweets", label: "🐦 全掘", hint: "黒歴史ツイート14本を全部読む" },
  { id: "minecraft", label: "⛏ 14年越しの鯖立て", hint: "検索欄が、約束を覚えている" },
  { id: "dessert", label: "🍮 デザートにうるさい", hint: "甘いものは、検索から差し入れる" },
  { id: "konamax", label: "💗 こな度カンスト", hint: "こな度を6にする" },
  { id: "kiriban", label: "🔢 キリ番自作自演", hint: "アクセスカウンターは、押せる" },
  { id: "joka", label: "🙏 他力本願", hint: "最後の最後で、師匠の名を呼ぶ" },
  { id: "endC", label: "🧂 歴史は繰り返した", hint: "あのダジャレを、もう一度送る" },
  { id: "endB", label: "🚪 14年越しの送信", hint: "言葉を直して、届ける" },
  { id: "endA", label: "💤 寝落ちもしもし", hint: "送信ではなく、発信を" },
  { id: "konami", label: "🎮 裏技", hint: "↑↑↓↓←→←→BA" },
  { id: "console", label: "🔍 開発者の声", hint: "F12の先に呪文が置いてある" },
];

export const ACH_LABEL: Record<string, string> = Object.fromEntries(
  ACH_DEFS.map((a) => [a.id, a.label]),
);
