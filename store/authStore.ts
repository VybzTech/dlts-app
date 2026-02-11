import { create } from "zustand";
import type { User } from "../src/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (user: User, token?: string) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  // Hydration is no longer strictly needed without persistence,
  // but we keep it to avoid breaking components that check it
  isHydrated: boolean;
  setIsHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: true, // Set to true by default since we aren't hydrating from storage

  login: async (user: User, token?: string) => {
    set({
      user,
      token: token || null,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      });
      // Optionally clear history if needed
      await AsyncStorage.removeItem("dlts-auth-storage");
    } catch (error) {
      console.error("Logout error:", error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      });
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setIsHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
}));
