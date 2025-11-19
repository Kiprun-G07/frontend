import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("event/:id", "routes/event.tsx"),
    
    // User routes - student/faculty access
        route("login", "routes/user/login.tsx"),
        route("register", "routes/user/register.tsx"),
        route("profile", "routes/user/profile.tsx"),
        route("events", "routes/events.tsx"),
        route("about", "routes/about.tsx"),
        route("accountsuccess", "routes/user/accountsuccess.tsx"),
        route("verifysuccess", "routes/user/verifysuccess.tsx"),
        route("forgotpassword", "routes/user/forgotpassword.tsx"),
        route("resetpassword", "routes/user/resetpassword.tsx"),
    
    // Admin routes
    route("admin", "routes/admin.tsx", [
        route("login", "routes/admin/login.tsx"),
        route("dashboard", "routes/admin/dashboard.tsx"),
        route("profile", "routes/admin/profile/index.tsx"),  // Self profile
        route("profile/$id", "routes/admin/profile/edit.tsx"),  // Edit other admin\
        route("forgotpassword", "routes/admin/forgotpassword.tsx"),
        route("resetpassword", "routes/admin/resetpassword.tsx"),
    ]),
] satisfies RouteConfig;
