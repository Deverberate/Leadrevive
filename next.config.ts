import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NEXT_EXPORT === "true" ? { output: "export" } : {}),
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
