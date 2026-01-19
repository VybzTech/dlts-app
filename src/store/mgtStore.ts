import { create } from "zustand";
import type { Delivery } from "@/src/types";

interface MgtState {
  submittedLetters: Delivery[];
  draftLetters: Delivery[];
  
  setSubmittedLetters: (letters: Delivery[]) => void;
  setDraftLetters: (letters: Delivery[]) => void;
  addDraftLetter: (letter: Delivery) => void;
  removeDraftLetter: (id: string) => void;
  submitLetter: (letter: Delivery) => void;
  getStats: () => { submitted: number; pending: number; completed: number };
}

export const useMgtStore = create<MgtState>((set, get) => ({
  submittedLetters: [],
  draftLetters: [],

  setSubmittedLetters: (letters) => set({ submittedLetters: letters }),
  setDraftLetters: (letters) => set({ draftLetters: letters }),

  addDraftLetter: (letter) =>
    set((state) => ({
      draftLetters: [...state.draftLetters, letter],
    })),

  removeDraftLetter: (id) =>
    set((state) => ({
      draftLetters: state.draftLetters.filter((l) => l.id !== id),
    })),

  submitLetter: (letter) =>
    set((state) => ({
      draftLetters: state.draftLetters.filter((l) => l.id !== letter.id),
      submittedLetters: [...state.submittedLetters, letter],
    })),

  getStats: () => {
    const { submittedLetters } = get();
    return {
      submitted: submittedLetters.length,
      pending: submittedLetters.filter((l) =>
        ["assigned", "picked_up", "en_route", "arrived"].includes(l.status)
      ).length,
      completed: submittedLetters.filter((l) =>
        ["delivered", "returned"].includes(l.status)
      ).length,
    };
  },
}));