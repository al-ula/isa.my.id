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
  ...prefix("blog", [
    index("routes/blog/index.tsx"),
    route(":slug", "routes/blog/blog.tsx"),
  ])
] satisfies RouteConfig;
