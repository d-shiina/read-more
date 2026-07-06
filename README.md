# read more

「続きは、続きを読むからどうぞ！」——友人（zaftx / 4g.MiNaMi）のブログの名（迷）フレーズだけで作った、身内向けの**馬鹿ゲー**。

「続きを読む」を押すたびに“続き”がまた「続きは続きを読むからどうぞ！」で、
彼の口ぐせ・顔文字・当時のネタ（AVA / 4gotten / こな / フラグムービー / 基本情報 / ＞ｗ＜）で
延々とボケ続ける。押した回数で**実績**が解除され、自己ベストは保存される。攻略は無い。

## 遊び方

`続きを読む →` を押す。以上。続きは、続きを読むからどうぞ！

## 技術構成

- **Next.js 16**（App Router）+ **React 19** + **TypeScript** + **Tailwind CSS v4** + shadcn/ui のトークン
- 実装は `src/game/BakaGame.tsx` ひとつ。ネタ文言は `CONTINUES`、実績は `ACHIEVEMENTS`。
- 自己ベストは `localStorage`。

## 元ネタ

`blog-backup/README.md` に友人ブログ全10記事のバックアップ（ネタの出典）。

## 開発

```bash
npm install
npm run dev   # http://localhost:3000
npm run build
```
