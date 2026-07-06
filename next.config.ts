import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 自作の信頼できるSVGプレースホルダを next/image で扱うため
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
};

export default nextConfig;
