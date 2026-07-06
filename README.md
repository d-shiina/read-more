# read more

何年も放置された友人（zaftx）の“黒歴史ブログ”に**ログインして、実在の記事を読み解く**——身内向けのブラウザ謎解きゲーム。

参考：[gakuyume.kirizou.site/nazo_main](https://gakuyume.kirizou.site/nazo_main) のような、
**サイドバー＋右コンテンツ**で、ブラウザそのものを盤面に使う謎解き。

イラストに頼らず、**実在ブログの本文**をコンテンツの主役にした「読み物＋謎解き」構成。

## いま遊べるもの（1記事＝1謎の縦スライス）

- タイトル →「ブログにログインする」
- **左サイドバー**：プロフィール（zaftx / 4g.MiNaMi）・アクセスカウンター・記事アーカイブ（🔒＝未開放）・進捗
- **右**：実在の記事「ブログ更新続けれるかな！？」（2011-07-12）を読む
- **「▼続きを読む」** で本文の続き（フラグムービー→AfterEffect→“革命が起こった”）が開く
- **こなちゃんがコメント欄で出題** → 答えると記事クリア → こなちゃんが返事
- **ブラウザ仕掛け**：ページのソースに次の合言葉を隠す／進行は `localStorage` に保存（リロードで消えない）

答え（AfterEffect）も、こなちゃんの台詞も、**本人のブログ本文に基づく**（2011-07-12「自分の中で革命が起こった」）。

## 技術構成

- **Next.js 16**（App Router）+ **React 19** + **TypeScript** + **Tailwind CSS v4**
- **shadcn/ui**（Button / Input / Dialog / Card）
- 状態管理：`useReducer` + Context（`src/game/store.tsx`）＋ `localStorage` 永続化

## ディレクトリ

```
src/game/
  Game.tsx        画面遷移（タイトル / リーダー）＋レイアウト
  store.tsx       進行状態（解いた記事）＋localStorage
  blog.ts         記事データ・アーカイブ・こなちゃんの謎
  config.ts       謎の答え（表記ゆれ吸収）
  ui/
    Title.tsx        タイトル
    BlogSidebar.tsx  左：プロフィール/カウンター/アーカイブ/進捗
    Article.tsx      右：記事本文＋「続きを読む」
    RiddleBox.tsx    こなちゃんのコメント＝謎＋解答
blog-backup/      友人ブログ全10記事のバックアップ（謎の元ネタ資料）
public/images/    こなちゃんの簡易アバター・タイトル背景（イラストは任意で差し替え）
```

## 謎の元ネタ・差し替え

- 元ネタ資料：`blog-backup/README.md`（全10記事＋固有名詞メモ）
- 答え：`src/game/config.ts` の `ANSWERS`
- 記事・出題・こなちゃんの台詞：`src/game/blog.ts`

## この先（謎バンク）

4gotten（クラン名）・AVA・Joka・オフ会マッチング・新PCのGTX780・基本情報(FE)・
Skype ID(zaftzaft3, URL入力向き)・2026年の「お前らしばくぞ」…を記事ごとに追加し、
最後は「結局、動画は作れたの？」＝フラグムービーの夢の回収でエンディング。

## 開発

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```
