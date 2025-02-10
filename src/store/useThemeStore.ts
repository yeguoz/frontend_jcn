import { create } from "zustand";

interface ThemeStore {
  isDark: boolean,
  setIsDark: (b: boolean) => void;
}

const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false,
  setIsDark: (isDark) => set({ isDark }),
}));

export default useThemeStore;