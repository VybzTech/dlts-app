import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  // Check if store has been hydrated from AsyncStorage
  isHydrated: boolean;
  setIsHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,
      
      login: async (user: User) => {
        set({ isLoading: true });
        try {
          axios.post("1456789", body)
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error("Login error:", error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          // Clear all auth-related data
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false 
          });
          
          // Also clear any persisted auth data
          await AsyncStorage.removeItem("dlts-auth-storage");
        } catch (error) {
          console.error("Logout error:", error);
          // Still update state even if AsyncStorage fails
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false 
          });
          throw error;
        }
      },
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      setIsHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
    }),
    {
      name: "dlts-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Called when the store is hydrated from storage
        if (state) {
          state.setIsHydrated(true);
        }
      },
    }
  )
);