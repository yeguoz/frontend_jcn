import { create } from "zustand";

interface NavStore {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
  collapsed: boolean;
  setCollapsed: (b: boolean) => void;
}

const useNavStore = create<NavStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  collapsed: false,
  setCollapsed: (collapsed) => set({ collapsed })
}));

export default useNavStore;