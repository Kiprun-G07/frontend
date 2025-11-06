import { Outlet, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../lib/auth";

// Layout component for admin routes that checks admin access
export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const user = await fetchCurrentUser();
      // Allow access only if user exists and is an admin
      setIsAdmin(!!user?.is_admin);
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // Redirect to admin login if not an admin
  if (!isAdmin && window.location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}