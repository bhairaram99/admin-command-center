import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAIL = 'admin@ai.com';
const ADMIN_PASSWORD = 'bhai@123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    return sessionStorage.getItem('admin_email');
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Validate admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Verify backend is reachable
      try {
        const res = await fetch('http://localhost:5000/health');
        if (!res.ok) throw new Error('Backend not available');
      } catch {
        // Still allow login even if backend is temporarily down
        console.warn('Backend health check failed, proceeding with login anyway');
      }
      
      setIsAuthenticated(true);
      setAdminEmail(email);
      sessionStorage.setItem('admin_auth', 'true');
      sessionStorage.setItem('admin_email', email);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAdminEmail(null);
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('admin_email');
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
