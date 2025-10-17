import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import mdx from '@mdx-js/rollup'

export default defineConfig(({ isSsrBuild }) => {
  return {
    plugins: [
      cloudflareDevProxy(),
      reactRouterHonoServer({
        runtime: "cloudflare"
      }),
      mdx(),
      reactRouter(),
      tailwindcss(),
      tsconfigPaths()
    ],
    build: {
      minify: true,
      target: "esnext",
      ...(isSsrBuild && {
        minify: false, // Minifying server build broke wrangler cli
      }),
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  }
});
