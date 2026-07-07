# read more

**「続きは、続きを読むからどうぞ！」**——友人（zaftx / 4g.MiNaMi / さかやん）のブログの、あの定型文から生まれた**2窓謎解きゲーム**。

👉 **遊ぶ: https://d-shiina.github.io/read-more/**

## ルール

ブラウザを**2枚**開く。片方でこのゲーム、もう片方で**原典（本人の実ブログ）**。
全10問の答えは、ぜんぶ原典の中にある。公式攻略本は、本人のブログです。

- 出題範囲：2011年の1回目の更新〜2026年の「お前らしばくぞｗ」まで全記事
- 例外はブラウザ仕掛け問題：**隠しURL**（彼が晒したSkype IDが住所になっている）と**ソース読み**
- ヒントあり（使うと成績に響く）。スコアで称号判定（最高位：瞳を知り尽した男）
- **実績12個**：ノーヒント／ノーミス／15分以内／隠しページ／Joka召喚／コナミコマンド／開発者コンソール…
- 進行は localStorage にセーブ

## 元ネタ

`blog-backup/README.md` に彼のブログ全10記事＋2012年の実在ツイート（匿名化済み）。答えの出典は全部ここ。

## 技術

Next.js 16（App Router）+ React 19 + TypeScript + Tailwind v4。
`src/game/Quiz.tsx`（本体）＋`src/game/riddles.ts`（謎データ）。GitHub Pages に静的書き出しで自動デプロイ。

```bash
npm install
npm run dev   # http://localhost:3000
npm run build
```

続きは、原典を読むからどうぞ！＞ｗ＜
