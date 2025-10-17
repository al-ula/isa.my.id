import type { Config } from "@react-router/dev/config";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  async prerender() {
    // Read all markdown files from the blog directory
    const blogDir = join(process.cwd(), "app/blog");
    const files = await readdir(blogDir);

    const blogPaths = files
      .filter(file => file.endsWith(".md"))
      .map(file => `/blog/${file.replace(".md", "")}`);

    const totalPosts = files.filter(f => f.endsWith(".md")).length;
    const totalPages = Math.ceil(totalPosts / 10);
    const paginationPaths = Array.from(
      { length: totalPages },
      (_, i) => i === 0 ? "/blog" : `/blog?page=${i + 1}`
    );
    const indexTotalPages = Math.ceil(blogPaths.length / 5);
    const indexPaginationPaths = Array.from(
      { length: indexTotalPages },
      (_, i) => i === 0 ? "/" : `/?page=${i + 1}`
    );

    return [...indexPaginationPaths,...paginationPaths, ...blogPaths];
  },
} satisfies Config;
