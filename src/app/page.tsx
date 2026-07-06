import { DocsTitle } from "fumadocs-ui/page";
import PageShell from "@/components/PageShell";
import AnswerForm from "@/components/AnswerForm";

export const metadata = { title: "第1話「これは、革命だ」" };

export default function Home() {
  return (
    <PageShell>
      <DocsTitle>第1話「これは、革命だ」</DocsTitle>
      <p className="text-sm text-fd-muted-foreground">2011-08-14 03:47 ｜ カテゴリ: 黒歴史</p>

      <p>
        どうも、zaftx です。深夜テンションで書いてます。
        きょう、とんでもないソフトに出会ってしまった。
      </p>
      <p>
        FPSのフラグムービー、あるじゃないですか。キル集にエフェクトかけて、
        曲に合わせてビタッと決まるやつ。あれ、ずっと「どうやって作ってんの？」って思ってた。
        で、先輩に聞いたら教えてくれたんですよ、その名を——
      </p>
      <blockquote>
        <p>「これは……革命だ」</p>
      </blockquote>
      <p>
        いや大げさじゃなくて。マジで革命。これさえあれば俺もフラグムービー作れる。
        こなちゃんにも見せたい。……という話は、<strong>続きを読む</strong>から。
      </p>

      <h2>謎</h2>
      <p>
        続きを読むには「呪文」が要ります。
        <br />
        僕が「これは革命だ」と叫んだ、その<strong>動画編集ソフトの名前</strong>を、こたえに入れて。
      </p>

      <AnswerForm placeholder="ソフトの名前を英語で" />

      <p className="text-xs text-fd-muted-foreground">
        ヒント：頭文字は <code>Ae</code>。空白や大文字小文字は気にしなくていい。
      </p>
    </PageShell>
  );
}
