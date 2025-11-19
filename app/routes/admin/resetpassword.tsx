import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { apiFetch } from "../../lib/auth";
export function meta() {
    return [{ title: "Reset Password" }];
}   

export default function AdminResetPassword() {
    const [formData, setFormData] = useState({
        password: "",
        password_confirmation: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";
   
    function validate() {
        if (!formData.password) return "Password is required.";
        if (formData.password.length < 8) return "Password must be at least 8 characters.";
        if (formData.password !== formData.password_confirmation) return "Passwords do not match.";
        return null;
    }

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
        const clientError = validate();
        if (clientError) {
            setError(clientError);
            return;
        }
        setLoading(true);
        try {
            const res = await apiFetch('/api/admin/password/reset', {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ ...formData, token, email })
            });
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);

            navigate("/admin/login");
        }

        
    }

    return (
        <main className="max-w-md mx-auto p-6 text-center">
            <h1 className="text-2xl mb-4">Reset Password</h1>
            <form onSubmit={handleSubmit} aria-describedby="form-error">
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
                {loading ? "Resetting password..." : "Reset Password"}
                </button>
            </form>
        </main>
    );
}