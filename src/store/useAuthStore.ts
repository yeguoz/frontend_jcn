import { create } from "zustand";

type AuthSetting = {
  login_captcha: string;
  register_captcha: string;
  register_enabled: string;
  register_group: string;
}

interface SettingStore {
  settings: AuthSetting | null;
  setSettings: (settings: AuthSetting) => void;
}

export const useAuthStore = create<SettingStore>((set) => ({
  settings: null,
  setSettings: (settings) => set({ settings }),
}));