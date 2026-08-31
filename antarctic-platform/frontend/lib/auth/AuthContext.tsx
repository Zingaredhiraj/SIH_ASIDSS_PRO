'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'

const PERMISSIONS: Record<string, string[]> = {
  admin: ['VIEW_DASHBOARD','VIEW_PERSONNEL','VIEW_SECURITY','VIEW_LOGISTICS','VIEW_ENVIRONMENT','USE_POLAR_AI','TRIGGER_INCIDENT','ACK_INCIDENT','VIEW_DIGITAL_TWIN','MANAGE_USERS','MANAGE_ROLES','VIEW_AUDIT_LOG','VIEW_EMERGENCY'],
  operator: ['VIEW_DASHBOARD','VIEW_PERSONNEL','VIEW_SECURITY','VIEW_LOGISTICS','VIEW_ENVIRONMENT','USE_POLAR_AI','TRIGGER_INCIDENT','ACK_INCIDENT','VIEW_DIGITAL_TWIN','VIEW_EMERGENCY','VIEW_AUDIT_LOG'],
  scientist: ['VIEW_DASHBOARD','VIEW_ENVIRONMENT','USE_POLAR_AI','VIEW_DIGITAL_TWIN','VIEW_PERSONNEL'],
  security_officer: ['VIEW_DASHBOARD','VIEW_PERSONNEL','VIEW_SECURITY','USE_POLAR_AI','TRIGGER_INCIDENT','ACK_INCIDENT','VIEW_DIGITAL_TWIN','VIEW_EMERGENCY'],
  ncpor_hq: ['VIEW_DASHBOARD','VIEW_PERSONNEL','VIEW_LOGISTICS','VIEW_ENVIRONMENT','VIEW_DIGITAL_TWIN','VIEW_EMERGENCY','VIEW_AUDIT_LOG','USE_POLAR_AI']
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  hasPermission: () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        logout();
      }
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('access_token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    document.cookie = `access_token=${newToken}; path=/; max-age=86400`;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    document.cookie = `access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    window.location.href = '/login';
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    const rolePerms = PERMISSIONS[user.role] || [];
    return rolePerms.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
