import React, { useState } from "react";
import { useNavigate } from "react-router";

export function meta() {
  return [{ title: "Login" }];
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate() {
    if (!email.trim() || !password) return "Email and password are required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const clientError = validate();
    if (clientError) {
      setError(clientError);
      return;
    }

    setLoading(true);
    try {
      const { login } = await import("../lib/auth");
      const res = await login(email, password);
      // only store token if backend returned one (if backend uses HttpOnly cookies it may not)
      if (res?.token) {
        localStorage.setItem("auth_token", res.token);
      }
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Sign in</h1>

      <form onSubmit={handleSubmit} aria-describedby="form-error">
        <div className="mb-3">
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            autoComplete="email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div id="form-error" role="alert" className="text-red-600 mb-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
