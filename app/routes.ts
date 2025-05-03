import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

    route("login", "routes/_auth/login.tsx"),
    route("register", "routes/_auth/register.tsx"),
    route("passwords/forgot", "routes/_password/forgout.tsx"),
    route("passwords/reset", "routes/_password/reset.tsx"),

    route("dashboard", "routes/_user/dashboard.tsx"),
    
] satisfies RouteConfig;
