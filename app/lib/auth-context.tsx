import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../lib/auth';
import { fetchCurrentUser } from '../lib/auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  updateUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUser = async () => {
    const userData = await fetchCurrentUser();
    setUser(userData);
  };

  useEffect(() => {
    let mounted = true;
    updateUser().finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, updateUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}