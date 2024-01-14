import { create } from "zustand";

type LoadingModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useLoadingModal = create<LoadingModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
