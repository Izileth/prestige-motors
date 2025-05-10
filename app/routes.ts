import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
        
    route("about", "routes/_about/_us/us.tsx"),
    route("history", "routes/_about/_mission/mission.tsx"),
    route("support", "routes/_about/_support/support.tsx"),

    route("polities/ecological", "routes/_about/_ecological/ecological.tsx"),
    
    route("newsletter", "routes/_newsletter/newsletter.tsx"),

    route("polities/cookies", "routes/_policy/cookies.tsx"),
    route("polities/privacy", "routes/_policy/privacy.tsx"),
    route("polities/conditions", "routes/_policy/terms.tsx"),
        
    route("destacts", "routes/_destacts/destacts.tsx"),

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
