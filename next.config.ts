import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // 빌드/런타임에서 sharp 안 쓰기
    unoptimized: true,
    // PNG/JPG 등을 `import`로 집어넣지 않게 함 (원인은 import trace의 png)
    disableStaticImages: true,
  },
};

export default nextConfig;
