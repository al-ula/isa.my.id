import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Isa Al Ula's" },
    { name: "description", content: "Isa Al Ula's Personal Website" },
  ];
}

export default function Home() {
  return(
    <article className="mx-auto prose">
      <h1>Welcome to My Personal Website</h1>
      <p>This is a placeholder article for Isa Al Ula's website. Stay tuned for more updates and content!</p>
      <section>
        <h2>About Me</h2>
        <p>I'm <a href="/">Isa Al Ula</a> a passionate developer and tech enthusiast. I love building modern web applications and exploring new technologies.</p>
      </section>
      <section>
        <h2>My Projects</h2>
        <ul>
          <li>Project 1: <a href="https://github.com/al-ula/small_uid">SmallUID</a>, a multi-language library for generating url safe unique IDs for all js runtime and rust.</li>
          <li>Project 2: Simple blogging cms. (WIP, this blog)</li>
        </ul>
      </section>

    </article>
  );
}
