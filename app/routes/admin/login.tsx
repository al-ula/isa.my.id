import { createCookie, data, Form, redirect } from "react-router";
import type { Route } from "./+types/login";
import { token, verify } from "../../auth/auth";
import { use, useEffect, useState } from "react";

const payload = {
  aud: "admin",
  iat: Date.now() / 1000,
};

export async function loader({ request, context }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie");
  const authToken = await createCookie("auth").parse(cookie);
  console.log(authToken);
  const authValue = verify(
    authToken,
    context.cloudflare.env.SECRET,
    payload.aud
  );
  try {
    await authValue;
    return "Logged in";
  } catch (e) {
    console.log("Invalid token");
  }
}

export async function action({ request, context }: Route.ActionArgs) {
  const authToken = await token(payload, context.cloudflare.env.SECRET);

  const formData = await request.formData();
  console.log(formData);

  if (!formData) {
    return "Please enter a username and password";
  }

  const env_login = context.cloudflare.env.LOGIN;
  const env_password = context.cloudflare.env.PASSWORD;
  const username = formData.get("username") as string;
  const password = formData.get("password");

  if (!username || !password) {
    console.log("Invalid username/password");
    return "Please enter a username and password";
  }
  if (username !== env_login || password !== env_password) {
    console.log("Wrong username/password");
    return "Wrong username/password";
  }

  const isCookieSecure = context.cloudflare.env.COOKIE_SECURE === "true";
  const cookieBuilder = createCookie("auth", {
    maxAge: 604800,
    path: "/",
    sameSite: "lax",
    secure: isCookieSecure,
    httpOnly: true,
  });

  return redirect("/admin", {
    headers: {
      "Set-Cookie": await cookieBuilder.serialize(authToken),
    },
  });
}

export default function Login({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(actionData || loaderData || null);
    console.log(
      "Loader data is " + loaderData + ", action data is " + actionData
    );
  }, [loaderData, actionData]);

  useEffect(() => {
    if (error === "Logged in") {
      console.log("Redirecting");
      setTimeout(() => {
        window.location.href = "/admin";
      }, 2000);
    }
  }, [error]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form is about to submit");
  };

  return (
    <main>
      <div className="flex flex-col justify-center items-center p-8">
        <fieldset className="bg-base-200 p-4 border border-base-300 rounded-box w-xs fieldset">
          <legend className="fieldset-legend">Login</legend>
          {error && (
            <label className="text-error fieldset-label">{error}</label>
          )}
          <Form action="/admin/login" method="post" onSubmit={handleSubmit}>
            <label className="fieldset-label">Username</label>
            <input
              type="text"
              name="username"
              className="input"
              placeholder="Username"
            />

            <label className="fieldset-label">Password</label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder="Password"
            />

            <button type="submit" className="mt-4 btn btn-neutral">
              Login
            </button>
          </Form>
        </fieldset>
      </div>
    </main>
  );
}
