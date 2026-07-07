import Link from "next/link";

export const metadata = {
  title: "サイゼリヤ 4gotten店",
  robots: { index: false },
};

/** 第8問の隠しページ。彼が全世界に晒したSkype IDが、そのまま住所になっている。 */
export default function HiddenSaizeriya() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-xl flex-col items-center justify-center px-6 py-10 text-center">
      <p className="text-xs tracking-widest text-accent2">ご来店ありがとうございます</p>
      <h1 className="mt-2 text-3xl font-black">サイゼリヤ 4gotten店</h1>
      <p className="mt-2 text-xs text-muted-foreground">（オフ会帰りの皆さまでにぎわっています）</p>

      <div className="mt-8 w-full rounded-lg border border-line bg-panel/70 p-6">
        <p className="text-xs text-muted-foreground">本日の合言葉</p>
        <p className="mt-2 text-3xl font-black text-gold">ぺぺろんちーの</p>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          ※ カスタムロボの話は、お席でお願いします。
          <br />
          ※ DeathVoiceの練習はご遠慮ください。
        </p>
      </div>

      <Link
        href="/"
        className="mt-8 rounded-md border border-brand/60 px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand/10"
      >
        ← ゲームに戻って合言葉を入力する
      </Link>
    </div>
  );
}
