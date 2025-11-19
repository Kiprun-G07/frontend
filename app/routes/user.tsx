import { Outlet, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../lib/auth";

// Layout component for user routes that checks auth
export default function UserLayout() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const user = await fetchCurrentUser();
      // Allow access only if user exists and is not an admin
      setIsAuthenticated(!!user && !user.is_admin);
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}