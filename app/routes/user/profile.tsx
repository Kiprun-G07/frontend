import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch, fetchCurrentUser, type User } from "../../lib/auth";

export function meta() {
  return [{ title: "Edit User Profile" }];
}

type UserProfile = {
  id: number;
  name: string;
  email: string;
  faculty: string;
  matriculationId: string;
};

export default function UserProfileEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const user = await fetchCurrentUser();
        if (!mounted) return;
        
        if (!user) {
          navigate('/user/login');
          return;
        }

        // Load user's own profile
        const profileRes = await apiFetch(`/api/user/${user.id}`);
        const profileData = await profileRes.json();
        
        if (!mounted) return;
        setProfile(profileData);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || 'Failed to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, [navigate]);

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
      await apiFetch(`/api/user/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      
      // Refresh user data after update
      await fetchCurrentUser();
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="p-6">Loading...</main>;
  if (error) return <main className="p-6 text-red-600">{error}</main>;
  if (!profile) return <main className="p-6">Profile not found.</main>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Edit Profile</h1>
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

        <div>
          <label htmlFor="faculty" className="block mb-1">Faculty</label>
          <select
            id="faculty"
            name="faculty"
            required
            value={profile.faculty}
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

        <div>
          <label htmlFor="matriculationId" className="block mb-1">Matriculation ID</label>
          <input
            id="matriculationId"
            name="matriculationId"
            type="text"
            required
            value={profile.matriculationId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

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
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-100 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}