import type { Route } from "./+types/home";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Isa Al Ula's" },
    { name: "description", content: "Isa Al Ula's Personal Website" },
  ];
}

const POSTS_PER_PAGE = 5;

interface BlogPost {
  slug: string;
  date: string;
  title: string;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const blogDir = join(process.cwd(), "app/blog");
  const files = await readdir(blogDir);

  const posts = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(".md", "");
      // Extract date from yyy-mm-dd_some-long-title format
      const [date, ...titleParts] = slug.split("_");
      const title = titleParts.join(" ").replace(/-/g, " ");

      return { slug, date, title };
    })
    .sort((a, b) => b.date.localeCompare(a.date)); // Newest first

  return posts;
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");

  const allPosts = await getBlogPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(start, start + POSTS_PER_PAGE);

  return { posts, page, totalPages };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts, page, totalPages } = loaderData;
  return (
    <article className="mx-auto prose">
      <h1>Isa's Personal Website</h1>
      <p>Stay tuned for more updates and content.</p>
      <section>
        <h2>My Projects</h2>
        <ul>
          <li>
            <a href="https://github.com/al-ula/small_uid">SmallUID</a>: A
            multi-language library for generating url safe unique IDs for all js
            runtime and rust.
          </li>
          <li>
            <a href="https://pasted.my.id">Pasted</a>: A simple and secure
            pastebin for sharing code snippets.
          </li>
          <li>
            <a href="https://www.teknokarta.biz.id">Teknokarta</a>: My Indonesian website dev freelancing.
            </li>
        </ul>
      </section>
      <section>
        <h2>Blogs</h2>

        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/blog/${post.slug}`}>
                <time>{post.date}</time> - {post.title}
              </Link>
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <nav>
            {page > 1 && <Link to={`/blog?page=${page - 1}`}>← Previous</Link>}
            <span>
              {" "}
              Page {page} of {totalPages}{" "}
            </span>
            {page < totalPages && (
              <Link to={`/blog?page=${page + 1}`}>Next →</Link>
            )}
          </nav>
        )}
      </section>
    </article>
  );
}
