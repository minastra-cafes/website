import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/caminho";

const nextConfig: NextConfig = {
  // Site estático no GitHub Pages, servido em minastra-cafes.github.io/website/.
  output: "export",
  basePath: BASE_PATH,
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
