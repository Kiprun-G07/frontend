import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    
    // User routes - student/faculty access
        route("login", "routes/user/login.tsx"),
        route("register", "routes/user/register.tsx"),
        route("profile", "routes/user/profile.tsx"),

    
    // Admin routes
    route("admin", "routes/admin.tsx", [
        route("login", "routes/admin/login.tsx"),
        route("dashboard", "routes/admin/dashboard.tsx"),
        route("profile", "routes/admin/profile/index.tsx"),  // Self profile
        route("profile/$id", "routes/admin/profile/edit.tsx"),  // Edit other admin
    ]),
] satisfies RouteConfig;
