import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../types/user";
import * as authApi from "../api/authApi";
import { tokenStorage } from "../api/axiosClient";
import type { LoginInput, RegisterInput } from "../types/user";


interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (data: LoginInput) => Promise<User>;
  register: (data: RegisterInput) => Promise<User>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext =createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      const token = tokenStorage.get();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const me = await authApi.getMe();
        setUser(me);
      } catch {
        tokenStorage.clear();
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  async function login(data: LoginInput) {
    const res = await authApi.login(data);
    tokenStorage.set(res.token);
    setUser(res.user);
    return res.user;
  }

  async function register(data: RegisterInput) {
    const res = await authApi.register(data);
    tokenStorage.set(res.token);
    setUser(res.user);
    return res.user;
  }

  function logout() {
    tokenStorage.clear();
    setUser(null);
  }
  const isAdmin = user?.role === "Admin";
  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}