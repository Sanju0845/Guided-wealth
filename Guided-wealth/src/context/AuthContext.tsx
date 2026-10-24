import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  _id: string;
  phone: string;
  name?: string;
  role: string;
  isPending: boolean;
  token: string;
  avatarColor?: string;
  hasCompletedRiskAssessment?: boolean;
  hasCompletedRetirementAnalysis?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoginOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginWithData: (userData: UserProfile) => void;
  logout: () => void;
  updateUser: (userData: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'guided_wealth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    // Guard for non-browser contexts (build-time prerender).
    if (typeof window === 'undefined' || !('localStorage' in window)) return;
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to load user state from localStorage', e);
    }
  }, []);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const loginWithData = (userData: UserProfile) => {
    const newUser = {
      ...userData,
      avatarColor: 'bg-accent',
    };
    setUser(newUser);
    if (typeof window !== 'undefined') localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUser = (userData: Partial<UserProfile>) => {
    if (user) {
      const newUser = { ...user, ...userData };
      setUser(newUser);
      if (typeof window !== 'undefined') localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoginOpen,
        openLoginModal,
        closeLoginModal,
        loginWithData,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
