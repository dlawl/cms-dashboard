import { create } from "zustand";

export interface AuthState {
  authenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  setAuthenticated: (auth: boolean) => set({ authenticated: auth }),
}));
