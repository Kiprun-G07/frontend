import React, { useState } from "react";
import { useNavigate, Link } from "react-router";

export function meta() {
  return [{ title: "Student Registration" }];
}

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    faculty: "",
    matriculation_number: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate() {
    if (!formData.name.trim()) return "Name is required.";
    if (!formData.email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return "Please enter a valid email address.";
    if (!formData.password) return "Password is required.";
    if (formData.password.length < 8) return "Password must be at least 8 characters.";
    if (formData.password !== formData.password_confirmation) return "Passwords do not match.";
    if (!formData.faculty.trim()) return "Faculty is required.";
    if (!formData.matriculation_number.trim()) return "Matriculation Number is required.";
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      // Remove password confirmation before sending
      const { password_confirmation, ...dataToSend } = formData;
      
      const res = await fetch("https://gpsapi-production.up.railway.app/api/register", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(data.message || "Registration failed");
      }

      // Optionally get token from response if your API returns it
      const data = await res.json().then(async (data) => {
        const verify = await fetch("https://gpsapi-production.up.railway.app/api/email/verify/request", {
          method: "POST",
          headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ email: formData.email }),
        });

        if (!verify.ok) {
          const verifyData = await verify.json().catch(() => ({ message: verify.statusText }));
          throw new Error(verifyData.message || "Failed to send verification email");
        }
        
        if (data.token) {
          localStorage.setItem("auth_token", data.token);
        }
      });
      
      
      navigate("/accountsuccess");
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Create Student Account</h1>

      <form onSubmit={handleSubmit} aria-describedby="form-error">
        <div className="mb-3">
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            autoComplete="name"
          />
        </div>

        <div className="mb-3">
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

        <div className="mb-3">
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            autoComplete="new-password"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password_confirmation" className="block mb-1">Confirm Password</label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            required
            value={formData.password_confirmation}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            autoComplete="new-password"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="faculty" className="block mb-1">Faculty</label>
          <select
            id="faculty"
            name="faculty"
            required
            value={formData.faculty}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Faculty</option>
            <option value="FOCS">Faculty of Computing and Information Technology</option>
            <option value="FOE">Faculty of Engineering</option>
            <option value="FOM">Faculty of Management</option>
            <option value="FST">Faculty of Science and Technology</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="matriculation_number" className="block mb-1">Matriculation ID</label>
          <input
            id="matriculation_number"
            name="matriculation_number"
            type="text"
            required
            value={formData.matriculation_number}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., 1234567"
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
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}