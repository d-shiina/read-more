import Link from "next/link";

export const metadata = { title: "404" };

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-black text-brand">404</p>
      <h1 className="mt-3 text-xl font-bold">そのページは無い。</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        ……ブログの存在を忘れかけていたぜ・・・
        <br />
        （住所が違うのかもしれない。原典をもう一度よく読め）
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md border border-brand/60 px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand/10"
      >
        ← ゲームに戻る
      </Link>
    </div>
  );
}
