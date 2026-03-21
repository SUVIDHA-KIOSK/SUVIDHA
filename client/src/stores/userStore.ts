import { create } from "zustand";
import type { AuthUser } from "../types/user";

interface UserState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
