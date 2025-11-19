import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { login } from "../../lib/auth";
import { useAuth } from "../../lib/auth-context";

export function meta() {
  return [{ title: "Admin Login" }];
}

export default function AdminLogin() {
  // const { updateUser } = useAuth(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, 'admin');
      
      // Update user context and verify admin status
      // await updateUser();
      
      // Verify that the user is an admin
      
        navigate("/admin/dashboard");

     
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Admin Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="text-red-600" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center">
          Forgot your password?{" "}
          <Link to="/admin/forgotpassword" className="text-blue-600 hover:underline">
            Reset it here
          </Link>
        </p>
      </form>
    </main>
  );
}