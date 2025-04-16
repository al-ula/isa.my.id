import { createCookie, redirect } from "react-router";
import type { Route } from "./+types/admin";
import { verify } from "../../auth/auth";

export async function loader({ request, context }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie");
  const authCookie = createCookie("auth");
  const authLoad = await authCookie.parse(cookie);
  console.log("authLoad", authLoad);
  if (!authLoad) {
    console.log("redirecting");
    return redirect("/admin/login", {
      status: 302,
    });
  }
  const authValuePromise = verify(
    authLoad,
    context.cloudflare.env.SECRET,
    "admin"
  );
  try {
    await authValuePromise;
    return;
  } catch (e) {
    return redirect("/admin/login", {
      status: 302,
    });
  }
}

export default function Admin() {
  return(
    <div>
      <div></div>
      <div></div>
    </div>
  );
}