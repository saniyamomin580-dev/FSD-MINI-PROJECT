import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => Boolean(sessionStorage.getItem('adminKey')));

  const login = useCallback(async (password) => {
    await api.post('/auth/login', { password }); // throws if the password is wrong
    sessionStorage.setItem('adminKey', password);
    setIsAdmin(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('adminKey');
    setIsAdmin(false);
  }, []);

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
