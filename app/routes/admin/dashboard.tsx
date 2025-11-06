import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch, fetchCurrentUser } from "../../lib/auth";

export function meta() {
  return [{ title: "Admin" }];
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await fetchCurrentUser(true);
      if (!mounted) return;
      setUser(u);
      setLoading(false);
      if (!u) {
        // not logged in -> redirect to login
        navigate('/login');
      } else if (!(u.is_admin || u.role === 'admin')) {
        // logged in but not admin -> redirect home or show message
        // navigate('/');
      }
    })();
    return () => { mounted = false };
  }, [navigate]);

  if (loading) return <main className="p-6">Loading...</main>;
  if (!user) return <main className="p-6">Redirecting to login...</main>;
  if (!(user.is_admin || user.role === 'admin'))
    return (
      <main className="p-6">
        <h1 className="text-2xl mb-4">Access denied</h1>
        <p>You do not have permission to view this page.</p>
      </main>
    );

  const [tab, setTab] = useState<'users' | 'logs'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (tab === 'users') {
        try {
          const res = await apiFetch('/api/admin/users');
          const d = await res.json().catch(() => []);
          if (!mounted) return;
          setUsers(Array.isArray(d) ? d : []);
        } catch (err) {
          console.error('Failed to load users', err);
        }
      } else {
        try {
          const res = await apiFetch('/api/admin/audit');
          const d = await res.json().catch(() => []);
          if (!mounted) return;
          setLogs(Array.isArray(d) ? d : []);
        } catch (err) {
          console.error('Failed to load logs', err);
        }
      }
    }
    load();
    return () => { mounted = false };
  }, [tab]);

  async function toggleActive(u: any) {
    if (!u || !u.id) return;
    const action = u.active ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} ${u.email || u.name}?`)) return;
    setBusy(true);
    try {
      // Try a conventional endpoint; backend may vary — adapt as needed
      const res = await apiFetch(`/api/admin/users/${u.id}/${action}`, { method: 'POST' });
      if (res.ok) {
        setUsers(prev => prev.map(p => p.id === u.id ? { ...p, active: !p.active } : p));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update user');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <p>Welcome back, {user.name ?? user.email} — admin tools below.</p>

      <div className="mt-6">
        <nav className="flex gap-3 mb-4">
          <button className={`px-3 py-1 rounded ${tab==='users' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab('users')}>Users</button>
          <button className={`px-3 py-1 rounded ${tab==='logs' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab('logs')}>Audit Logs</button>
        </nav>

        {tab === 'users' && (
          <section>
            <h2 className="text-lg mb-2">Users</h2>
            <div className="overflow-x-auto border rounded">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Faculty</th>
                    <th className="text-left p-2">Matric</th>
                    <th className="text-left p-2">Active</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-t">
                      <td className="p-2">{u.id}</td>
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.faculty}</td>
                      <td className="p-2">{u.matriculationId ?? u.matric}</td>
                      <td className="p-2">{u.active ? 'Yes' : 'No'}</td>
                      <td className="p-2">
                        <button disabled={busy} onClick={() => toggleActive(u)} className="text-sm px-2 py-1 bg-gray-100 rounded">
                          {u.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <div className="p-4">No users found.</div>}
            </div>
          </section>
        )}

        {tab === 'logs' && (
          <section>
            <h2 className="text-lg mb-2">Audit Logs</h2>
            <div className="overflow-x-auto border rounded p-2">
              {logs.length === 0 && <div>No logs found.</div>}
              <ul className="text-sm">
                {logs.map((l, idx) => (
                  <li key={idx} className="mb-2">
                    <div className="text-xs text-gray-500">{new Date(l.created_at || l.timestamp || Date.now()).toLocaleString()}</div>
                    <div>{l.event_type || l.action}: {l.event_data ? JSON.stringify(l.event_data) : l.message}</div>
                    <div className="text-xs text-gray-500">{l.ip ?? l.ip_address} {l.user_agent ? `• ${l.user_agent}` : ''}</div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
