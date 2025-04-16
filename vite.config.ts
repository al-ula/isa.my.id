import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";

export default defineConfig({
  plugins: [
    cloudflareDevProxy(),
    reactRouter(),
    reactRouterHonoServer({
      runtime: "cloudflare"
    }),
    tailwindcss(),
    tsconfigPaths()],
});
