import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { apiFetch, fetchCurrentUser } from "../../lib/auth";

export function meta() {
  return [{ title: "Edit Admin Profile" }];
}

type AdminProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_admin: boolean;
};

export default function AdminProfileEditor() {
  const { id: adminId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const currentAdmin = await fetchCurrentUser();
        if (!mounted) return;
        
        if (!currentAdmin || !currentAdmin.is_admin) {
          navigate('/admin/login');
          return;
        }

        // Load admin profile
        const endpoint = adminId 
          ? `/api/admin/profile/${adminId}` 
          : `/api/admin/profile/${currentAdmin.id}`;
          
        const profileRes = await apiFetch(endpoint);
        const profileData = await profileRes.json();
        
        if (!mounted) return;
        setProfile(profileData);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || 'Failed to load admin profile');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, [navigate, adminId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setError(null);
    setSaving(true);
    
    try {
      await apiFetch(`/api/admin/profile/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      
      // If editing someone else's profile, go back to admin dashboard
      if (adminId) {
        navigate('/admin');
      } else {
        // Refresh admin data and stay on page
        await fetchCurrentUser();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="p-6">Loading...</main>;
  if (error) return <main className="p-6 text-red-600">{error}</main>;
  if (!profile) return <main className="p-6">Profile not found.</main>;

  const editingOther = adminId && String(adminId) !== String(profile.id);

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">
          {editingOther ? `Edit Admin: ${profile.name}` : 'Edit Admin Profile'}
        </h1>
        {editingOther && (
          <button 
            type="button"
            onClick={() => navigate('/admin')}
            className="px-3 py-1 text-sm bg-gray-100 rounded"
          >
            Back to Dashboard
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={profile.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={profile.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {editingOther && (
          <div>
            <label htmlFor="role" className="block mb-1">Role</label>
            <select
              id="role"
              name="role"
              value={profile.role}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        )}

        {error && (
          <div className="text-red-600" role="alert">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(editingOther ? '/admin' : '/admin/dashboard')}
            className="px-4 py-2 bg-gray-100 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}