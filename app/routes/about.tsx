import { useState, useEffect } from "react";
import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Isa Al Ula's" },
    { name: "description", content: "About Isa Al Ula's Personal Website" },
  ];
}

export default function About() {
  return (
    <main>
      <article className="mx-auto prose">
        <h1>About Me</h1>
        <p>
          I'm <a href="/">Isa Al Ula</a> a passionate developer and tech
          enthusiast. I love building modern web applications and exploring new
          technologies.
        </p>
        <h4>Technologies used in this project:</h4>
        <figure>
          <img
            src="https://workers.cloudflare.com/logo.svg"
            alt="Cloudflare Workers®"
            width="200"
          />
          <figcaption>Cloudflare Workers®</figcaption>
        </figure>
        <ReactRouterLogo />
        <figure>
          <img
            src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.d52e9897.svg"
            alt="Tailwind CSS"
            width="200"
            height="50"
          />
          <figcaption>Tailwind CSS</figcaption>
        </figure>
        <figure>
          <img
            src="https://img.daisyui.com/images/daisyui/mark-rotating.svg"
            alt="daisyUI"
            width="200"
          />
          <figcaption>daisyUI</figcaption>
        </figure>
      </article>
    </main>
  );
}


function ReactRouterLogo() {
  const [theme, setTheme] = useState('dark'); // Default to 'dark' or detect initial theme

  useEffect(() => {
    // Function to update the theme state based on system preference
    const updateTheme = () => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    };

    // Initial theme detection
    updateTheme();

    // Listen for changes in the system theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);

    // Cleanup listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', updateTheme);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const logoSrc =
    theme === 'dark'
      ? 'https://reactrouter.com/_brand/React%20Router%20Brand%20Assets/React%20Router%20Logo/Dark.svg'
      : 'https://reactrouter.com/_brand/React%20Router%20Brand%20Assets/React%20Router%20Logo/Light.svg';

  return (
    <figure>
      <img
        src={logoSrc}
        alt="React Router"
        width="200"
        height="50"
      />
      <figcaption>React Router</figcaption>
    </figure>
  );
}