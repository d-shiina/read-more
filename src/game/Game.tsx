"use client";

import { GameProvider, useGame } from "./store";
import Title from "./ui/Title";
import BlogSidebar from "./ui/BlogSidebar";
import ArticleView from "./ui/Article";
import { ARTICLES, SLICE_ARTICLE_ID } from "./blog";

function Reader() {
  const article = ARTICLES[SLICE_ARTICLE_ID];
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden">
      <BlogSidebar />
      <main className="flex-1 overflow-y-auto bg-bg">
        <ArticleView article={article} />
      </main>
    </div>
  );
}

function Root() {
  const { state } = useGame();
  return state.screen === "title" ? <Title /> : <Reader />;
}

export default function Game() {
  return (
    <GameProvider>
      <Root />
    </GameProvider>
  );
}
