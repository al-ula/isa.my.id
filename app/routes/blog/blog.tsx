import type { Route } from "./+types/blog";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeModifyHeadingId from "~/utils/unified/rehype-modify-heading-id";
import rehypeAddHeadingClass from "~/utils/unified/rehype-add-heading-class";
import rehypeToc from "~/utils/unified/rehype-toc";

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;

  // Read and process markdown at build time
  const blogPath = join(process.cwd(), "app/blog", `${slug}.md`);
  const content = await readFile(blogPath, "utf-8");

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeModifyHeadingId, {
      method: "replace",
      value: "/article/{tagName}/{id}", // The template for the new ID
      excludeIds: ["toc"], // Exclude the TOC heading from modification
    })
    .use(rehypeAddHeadingClass, {
      method: "add",
      value: ["group", "relative"], // The classes to add for Tailwind hover
      excludeIds: ["toc"], // Also exclude the TOC heading here
    })
    .use(rehypeAutolinkHeadings, {
      behavior: "prepend",
      properties: {
        className: [
          "no-underline",
          "absolute",
          "-ml-[1em]",
          "pr-[0.5em]",
          "text-slate-400",
          "opacity-0",
          "group-hover:opacity-100",
        ],
      },
      content: { type: "text", value: "#" },
    })
    .use(rehypeToc, {
      id: "/article/h2/contents",
      className: "toc",
      listClassName: "toc-list",
      itemClassName: "toc-item",
      linkClassName: "toc-link",
    })
    .use(rehypeStringify)
    .process(content);
  const articleDate = slug.split("_")[0];
  const articleTitle = slug.split("_")[1].replace(/-/g, " ");
  // split at "_" inverse the array then join using " at "
  const articleDesc = `Isa's blog post at ${articleDate}: ${articleTitle}`;
  return {
    html: result.toString(),
    slug,
    title: articleTitle,
    desc: articleDesc
  };
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  return (
    <article className="mx-auto prose">
      <title>{loaderData.title}</title>
      <meta name="description" content={`Isa's blog post: ${loaderData.desc}`} />
      <div dangerouslySetInnerHTML={{ __html: loaderData.html }} />
    </article>
  );
}
