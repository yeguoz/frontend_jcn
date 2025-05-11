import { create } from "zustand";

interface SettingStore {
  authSettings: Map<string, string> | null;
  setAuthSettings: (settings: Map<string, string>) => void;
}

const useSettingStore = create<SettingStore>((set) => ({
  authSettings: null,
  setAuthSettings: (settings) => set({ authSettings: settings }),
}));

export default useSettingStore;