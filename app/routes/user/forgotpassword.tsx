import { useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../../lib/auth";

export function meta() {
    return [{ title: "Forgot Password" }];
}

export default function ForgotPassword() {
    const [formData, setFormData] = useState({ email: "" });
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
            const response = await apiFetch("/api/password/forgot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error("Failed to send reset password email");
            }
            navigate("/login");
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl mb-4">Reset your password</h1>

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
            {loading ? "Processing..." : "Reset Password"}
            </button>
        </form>
        </main>
    );
};