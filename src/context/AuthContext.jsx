import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('@auth_user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error('Failed to load auth', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = (userData) => {
    setUser(userData);
    localStorage.setItem('@auth_user', JSON.stringify(userData));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('@auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, token: user?.token || null }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
