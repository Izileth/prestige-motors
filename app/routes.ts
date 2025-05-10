import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

    route("login", "routes/_auth/login.tsx"),
    route("register", "routes/_auth/register.tsx"),
    route("passwords/forgot", "routes/_password/forgout.tsx"),
    route("passwords/reset", "routes/_password/reset.tsx"),

    route("dashboard", "routes/_user/dashboard.tsx"),
    route("vehicles/user", "routes/_vehicle/_private/vehicle.user.tsx"),

    route("vehicles", "routes/_vehicle/vehicle.tsx"),
    route("vehicles/:id", "routes/_vehicle/_id/vehicleId.tsx"),
    route("vehicles/create", "routes/_vehicle/_create/create.tsx"),
    route("vehicles/update/:id", "routes/_vehicle/_update/update.tsx"),
    
    route("vehicles/category", "routes/_vehicle/_category/category.tsx"),
    
    route("vehicles/negociations", "routes/_vehicle/_negociation/negociation.tsx"),

    
] satisfies RouteConfig;
