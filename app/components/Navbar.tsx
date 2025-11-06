import React from "react";
import { Link, useNavigate } from "react-router";
import { logoutServer } from "../lib/auth";
import { useAuth } from "../lib/auth-context";

export default function Navbar() {
  const { user, loading, setUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutServer();
    setUser(null);
    navigate('/');
  }

  return (
    <header className="bg-white border-b text-gray-800">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold text-lg">GPS</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm">Home</Link>
          {!loading && !user && (
            <>
              <Link to="/login" className="text-sm">Sign in</Link>
              <Link to="/register" className="text-sm">Register</Link>
            </>
          )}

          {!loading && user && (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-sm">Hello, {user.name ?? user.email}</Link>
              { (user.is_admin || user.role === 'admin') && (
                <Link to="/admin" className="text-sm">Admin</Link>
              ) }
              <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
