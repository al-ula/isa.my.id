import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Isa Al Ula's" },
    { name: "description", content: "Isa Al Ula's Personal Website" },
  ];
}

export default function Home() {
  return(
    <article className="mx-auto prose">
      <h5>Welcome to My Personal Website</h5>
      <p>Stay tuned for more updates and content.</p>
      <section>
        <h2>My Projects</h2>
        <ul>
          <li><a href="https://github.com/al-ula/small_uid">SmallUID</a>: A multi-language library for generating url safe unique IDs for all js runtime and rust.</li>
        </ul>
      </section>

    </article>
  );
}
