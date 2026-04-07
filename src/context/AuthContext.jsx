import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const STATIC_USER = { id: 'user', password: 'pass123' };

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('crypto-wallet-auth') === 'true';
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('crypto-wallet-user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (id, password) => {
    if (id === STATIC_USER.id && password === STATIC_USER.password) {
      setIsAuthenticated(true);
      setUser(STATIC_USER);
      localStorage.setItem('crypto-wallet-auth', 'true');
      localStorage.setItem('crypto-wallet-user', JSON.stringify(STATIC_USER));
    } else {
      throw new Error('Invalid ID or password');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('crypto-wallet-auth');
    localStorage.removeItem('crypto-wallet-user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
