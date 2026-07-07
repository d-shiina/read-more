import type { NextConfig } from "next";

// GitHub Pages 公開用: リポジトリ名がそのままパスになる
// (https://<user>.github.io/read-more/) ため basePath が必要。
const repoName = "read-more";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
