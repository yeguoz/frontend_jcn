import { create } from "zustand";

interface NavStore {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
}

const useNavStore = create<NavStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export default useNavStore;