import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  layout("routes/admin/dashboard.layout.tsx", [
    route("admin", "routes/admin/admin.tsx"),   
  ]),
  ...prefix("admin", [
    route("login", "routes/admin/login.tsx"),
    route("logout", "routes/admin/logout.tsx"),
  ]),
] satisfies RouteConfig;
