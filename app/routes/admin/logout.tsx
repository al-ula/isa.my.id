import { useEffect } from "react";
import type { Route } from "./+types/logout";
import { createCookie, redirect } from "react-router";
import { verify } from "../../auth/auth";
import LogoutBtn from "~/components/logout";
export async function action({ request, context }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie");
  const authCookie = createCookie("auth");
  const authLoad = await authCookie.parse(cookie);
  if (authLoad === null) {
    return "Not logged in";
  }
  return redirect("/admin/logout", {
    headers: {
      "Set-Cookie": await authCookie.serialize(""),
    },
  });
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie");
  const authCookie = createCookie("auth");
  const authLoad = await authCookie.parse(cookie);
  console.log("authLoad", authLoad);

  if (!authLoad) {
    return "Logged out!";
  }
  const authValuePromise = verify(
    authLoad,
    context.cloudflare.env.SECRET,
    "admin"
  );

  try {
    await authValuePromise;
    return "Logged in";
  } catch (e) {
    return "Invalid auth token";
  }
}

export default function Logout({ loaderData }: Route.ComponentProps) {
  if (loaderData === "Logged out!") {
    useEffect(() => {
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      return () => clearTimeout(timer);
    }, []);
    return (
      <div className="flex flex-col justify-center items-center p-8">
        <div role="alert" className="w-max alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current w-6 h-6 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Logged out!</span>
        </div>
      </div>
    );
  }
  if (loaderData === "Invalid auth token") {
    useEffect(() => {
      fetch("/admin/logout", {
        method: "POST",
      });
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      return () => clearTimeout(timer);
    }, []);
    return (
      <main>
        <div className="flex flex-col justify-center items-center p-8">
          <div role="alert" className="w-max alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current w-6 h-6 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Logged out!!</span>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main>
      <div className="flex flex-col justify-center items-center p-8">
        <LogoutBtn className="btn" />
      </div>
    </main>
  );
}
