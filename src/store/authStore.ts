import { create } from "zustand";

export type UserRole = 'admin' | 'editor';

export interface AuthState {
  authenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  setAuthenticated: (auth: boolean) => set({ authenticated: auth }),
  role: 'admin',
  setRole: (role: UserRole) => set({ role }),
}));
