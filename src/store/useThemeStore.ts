import { create } from "zustand";

interface ThemeStore {
  isDark: boolean,
  setIsDark: (b: boolean) => void;
}
const getInitialTheme = () => {
  const storedTheme = localStorage.getItem('isDark');
  return storedTheme ? JSON.parse(storedTheme) : false;
};

const useThemeStore = create<ThemeStore>((set) => ({
  isDark: getInitialTheme(),
  setIsDark: (isDark) => set({ isDark }),
}));

export default useThemeStore;