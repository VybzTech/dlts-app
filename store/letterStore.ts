import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Letter, LetterStatus } from "@/src/types/letter.types";
import { letterService } from "@/src/api/services/letter.service";

interface LetterState {
  letters: Letter[];
  filteredLetters: Letter[];
  isLoading: boolean;
  error: string | null;
  currentFilter: LetterStatus | "all";
  currentPage: number;
  totalPages: number;
  totalLetters: number;

  // Actions
  fetchLetters: (page?: number, status?: LetterStatus | "all") => Promise<void>;
  setLetters: (letters: Letter[]) => void;
  setFilter: (filter: LetterStatus | "all") => void;
  markAsInTransit: (id: string) => Promise<void>;
  markAsDelivered: (id: string, payload: any) => Promise<void>;
  markAsUndelivered: (id: string, reason: string) => Promise<void>;
  approveLetter: (id: string) => Promise<void>;
  rejectLetter: (id: string, reason?: string) => Promise<void>;
  refreshLetters: () => Promise<void>;
  getStats: () => {
    total: number;
    pending: number;
    inTransit: number;
    delivered: number;
    undelivered: number;
  };
}

export const useLetterStore = create<LetterState>()(
  persist(
    (set, get) => ({
      letters: [],
      filteredLetters: [],
      isLoading: false,
      error: null,
      currentFilter: "all",
      currentPage: 1,
      totalPages: 1,
      totalLetters: 0,

      fetchLetters: async (page = 1, status = "all") => {
        set({ isLoading: true, error: null });
        try {
          const statusFilter =
            status === "all" ? undefined : (status as LetterStatus);
          const response = await letterService.getLetters(
            page,
            20,
            statusFilter,
          );

          const filteredLetters =
            status === "all"
              ? response.letters
              : response.letters.filter((l) => l.status === status);

          set({
            letters: response.letters,
            filteredLetters,
            currentPage: response.pagination.page,
            totalPages: response.pagination.pages,
            totalLetters: response.pagination.total,
            currentFilter: status as any,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch letters",
            isLoading: false,
          });
        }
      },

      setLetters: (letters) => set({ letters, filteredLetters: letters }),

      setFilter: (filter) => {
        const { letters } = get();
        let filtered = letters;

        if (filter !== "all") {
          if (filter === ("Pending" as any)) {
            filtered = letters.filter((l) =>
              [
                "Pending_Approval",
                "Registered",
                "Approved",
                "Assigned",
              ].includes(l.status),
            );
          } else {
            filtered = letters.filter((l) => l.status === filter);
          }
        }

        set({
          currentFilter: filter,
          filteredLetters: filtered,
          currentPage: 1,
        });
      },

      markAsInTransit: async (id: string) => {
        try {
          await letterService.markInTransit(id);
          // Update local state
          set((state) => ({
            letters: state.letters.map((l) =>
              l.id === id ? { ...l, status: "In_Transit" } : l,
            ),
            filteredLetters: state.filteredLetters.map((l) =>
              l.id === id ? { ...l, status: "In_Transit" } : l,
            ),
          }));
        } catch (error: any) {
          set({ error: error.message || "Failed to mark as in-transit" });
          throw error;
        }
      },

      markAsDelivered: async (id: string, payload: any) => {
        try {
          await letterService.markDelivered(id, payload);
          set((state) => ({
            letters: state.letters.map((l) =>
              l.id === id ? { ...l, status: "Delivered" } : l,
            ),
            filteredLetters: state.filteredLetters.map((l) =>
              l.id === id ? { ...l, status: "Delivered" } : l,
            ),
          }));
        } catch (error: any) {
          set({ error: error.message || "Failed to mark as delivered" });
          throw error;
        }
      },

      markAsUndelivered: async (id: string, reason: string) => {
        try {
          await letterService.markUndelivered(id, { reason });
          set((state) => ({
            letters: state.letters.map((l) =>
              l.id === id ? { ...l, status: "Undelivered" } : l,
            ),
            filteredLetters: state.filteredLetters.map((l) =>
              l.id === id ? { ...l, status: "Undelivered" } : l,
            ),
          }));
        } catch (error: any) {
          set({ error: error.message || "Failed to mark as undelivered" });
          throw error;
        }
      },

      approveLetter: async (id: string) => {
        try {
          await letterService.approveLetter(id);
          set((state) => ({
            letters: state.letters.map((l) =>
              l.id === id ? { ...l, status: "Approved" } : l,
            ),
            filteredLetters: state.filteredLetters.map((l) =>
              l.id === id ? { ...l, status: "Approved" } : l,
            ),
          }));
        } catch (error: any) {
          set({ error: error.message || "Failed to approve letter" });
          throw error;
        }
      },

      rejectLetter: async (id: string, reason?: string) => {
        try {
          await letterService.rejectLetter(id, reason);
          set((state) => ({
            letters: state.letters.map((l) =>
              l.id === id ? { ...l, status: "Rejected" } : l,
            ),
            filteredLetters: state.filteredLetters.map((l) =>
              l.id === id ? { ...l, status: "Rejected" } : l,
            ),
          }));
        } catch (error: any) {
          set({ error: error.message || "Failed to reject letter" });
          throw error;
        }
      },

      refreshLetters: async () => {
        const { currentFilter, currentPage } = get();
        const statusFilter =
          currentFilter === "all" ? undefined : currentFilter;
        await get().fetchLetters(currentPage, currentFilter);
      },

      getStats: () => {
        const { letters } = get();
        return {
          total: letters.length,
          pending: letters.filter(
            (l) =>
              l.status === "Pending_Approval" ||
              l.status === "Registered" ||
              l.status === "Approved" ||
              l.status === "Assigned" ||
              l.status === "Allocated",
          ).length,
          inTransit: letters.filter(
            (l) => l.status === "InTransit" || l.status === "In_Transit",
          ).length,
          delivered: letters.filter((l) => l.status === "Delivered").length,
          undelivered: letters.filter(
            (l) => l.status === "Undelivered" || l.status === "Rejected",
          ).length,
        };
      },
    }),
    {
      name: "dlts-letter-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        letters: state.letters,
        filteredLetters: state.filteredLetters,
        currentFilter: state.currentFilter,
      }),
    },
  ),
);
