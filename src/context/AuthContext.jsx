import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const VALID_USERNAME = 'Dracula';
const VALID_PASSWORD = 'Tools';
const STORAGE_KEY = 'hubspace_auth_session';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      const session = sessionStorage.getItem(STORAGE_KEY);
      const saved = local || session;
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.username === VALID_USERNAME && Boolean(parsed?.authenticated);
      }
      return false;
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      const session = sessionStorage.getItem(STORAGE_KEY);
      const saved = local || session;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.username === VALID_USERNAME) {
          return { username: VALID_USERNAME };
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const login = (username, password, rememberMe = true) => {
    const cleanUser = username.trim();
    if (cleanUser === VALID_USERNAME && password === VALID_PASSWORD) {
      const authData = {
        username: VALID_USERNAME,
        authenticated: true,
        loginAt: new Date().toISOString(),
      };
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
        sessionStorage.removeItem(STORAGE_KEY);
      } else {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
        localStorage.removeItem(STORAGE_KEY);
      }
      setIsAuthenticated(true);
      setCurrentUser({ username: VALID_USERNAME });
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid username or password. Please verify your credentials.',
    };
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Error clearing auth storage:', e);
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
      }}
    >
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
