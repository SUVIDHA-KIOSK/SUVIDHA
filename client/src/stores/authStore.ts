import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storageKeys } from "../utils/storage";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setToken: (token) =>
        set({
          token,
          isAuthenticated: Boolean(token),
        }),
      logout: () =>
        set({
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: storageKeys.authToken,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
