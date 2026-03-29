import { create } from "zustand";
import type { User } from "@/types";
import { getToken, getUser, removeToken, removeUser, setToken, setUser } from "@/lib/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hydrate: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (token: string, user: User) => {
    setToken(token);
    setUser(user);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    removeToken();
    removeUser();
    set({ user: null, token: null, isAuthenticated: false });
  },
  hydrate: () => {
    const token = getToken();
    const user = getUser();
    if (token && user) {
      set({ user, token, isAuthenticated: true });
    }
  },
  updateUser: (user: User) => {
    setUser(user);
    set({ user });
  },
}));
