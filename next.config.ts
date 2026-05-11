import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

/** 親フォルダに別の package-lock があると Turbopack が誤ったルートを推論するため、このリポジトリに固定する */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
