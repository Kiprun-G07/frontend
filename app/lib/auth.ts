
// Auth helper that talks to a backend login endpoint.
// Assumptions:
// - POST /api/login accepts { email, password } and returns JSON { token } on success
//   OR sets an HttpOnly refresh cookie and returns 200 with optional JSON.
// - We use `credentials: "include"` so cookies set by the server are accepted.
// Replace URLs and response handling to match your backend as needed.

// Normalize API base to the host root (no trailing slash). Keep the `/api` prefix in request paths
const API_BASE_RAW = (import.meta.env.VITE_API_BASE as string) || "http://127.0.0.1:8000";
const API_BASE = API_BASE_RAW.replace(/\/+$/g, "");

export async function login(email: string, password: string, type?: string): Promise<{
  token?: string;
  tokenType?: string;
  expiresIn?: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}> {
  // Login endpoint lives under /api/login on the backend
  let url = `${API_BASE}/api/login`;

  if (type && type === 'admin') {
    // If type is provided, adjust URL for admin login
    url = `${API_BASE}/api/admin/login`;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json",
     },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    // Try to parse error body
    let body: any = null;
    try {
      body = await res.json();
    } catch (_) {
      // ignore
    }
    const message = body?.message || res.statusText || "Login failed";
    throw new Error(message);
  }

  // Parse response and extract access token + user data
  try {
    const body = await res.json().catch(() => null);
    if (body && typeof body === "object" && body.access_token) {
      // Store the access token for future requests
      localStorage.setItem("auth_token", body.access_token);
      
      // Store user data if present
      if (body.user) {
        localStorage.setItem("user", JSON.stringify(body.user));
      }
      
      return { 
        token: body.access_token,
        // Also return other relevant info from response
        tokenType: body.token_type,
        expiresIn: body.expires_in,
        user: body.user
      };
    }
  } catch (_) {
    // ignore JSON parse errors
  }

  // No token in response
  return {};
}

export function logout() {
  // Clear all auth-related data from localStorage
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
}

export function getToken() {
  return localStorage.getItem("auth_token");
}

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(opts.headers || {});
  
  // Always include Authorization header with Bearer token if we have one
  if (token) {
    const bearerToken = `Bearer ${token}`;
    headers.set("Authorization", bearerToken);
  }
  
  // Always include Accept header for JSON responses
  headers.set("Accept", "application/json");

  // Build URL carefully to avoid duplicated `/api` segments.
  // - absolute URLs (http/https) are used as-is
  // - paths starting with `/api` are appended to the API_BASE (which is the host root)
  // - other relative paths are also appended to API_BASE
  let url: string;
  if (path.startsWith('http')) {
    url = path;
  } else if (path.startsWith('/api')) {
    // API_BASE is host root (no trailing slash), so just concatenate
    url = `${API_BASE}${path}`;
  } else if (path.startsWith('/')) {
    // non-API absolute path on the host
    url = `${API_BASE}${path}`;
  } else {
    // relative path -> treat as under host root
    url = `${API_BASE}/${path}`;
  }

  const res = await fetch(url, { ...opts, headers, credentials: "include" });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || res.statusText);
  }
  return res;
}

// Fetch the currently authenticated user from the backend.
export type User = {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
  role?: string;
  faculty?: string;
  matriculationId?: string;
};

// Check if a user is an admin
export function isAdminUser(user: User | null): boolean {
  return !!user?.is_admin;
}

// Check if a user is a regular user (not an admin)
export function isRegularUser(user: User | null): boolean {
  return !!user && !user.is_admin;
}

export async function fetchCurrentUser(admin?: boolean): Promise<User | null> {
  try {
        // First check if we have stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Determine the correct endpoint based on user type
      const endpoint = admin ? '/api/admin/profile' : '/api/user';
      
      try {
        // Verify the stored data is still valid
        const res = await apiFetch(endpoint);
        const freshData = await res.json();
        localStorage.setItem('user', JSON.stringify(freshData));
        return freshData;
      } catch (err) {
        // If verification fails, clear stored data
        localStorage.removeItem('user');
        return null;
      }
    }

    // If no stored user, try regular user endpoint first
    try {
      const res = await apiFetch('/api/user');
      const data = await res.json();
      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
      }
      return data;
    } catch (err) {
      // If regular user fetch fails, try admin endpoint
      try {
        const adminRes = await apiFetch('/api/admin/profile');
        const adminData = await adminRes.json();
        if (adminData) {
          localStorage.setItem('user', JSON.stringify(adminData));
        }
        return adminData;
      } catch (err) {
        return null;
      }
    }
  } catch (err) {
    return null;
  }
}

// Call server logout endpoint and clear client state
export async function logoutServer() {
  try {
    await apiFetch('/api/logout', { method: 'POST' });
  } catch (_) {
    // ignore network errors
  }
  // clear local token
  logout();
}

