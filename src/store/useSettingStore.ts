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

const useSettingStore = create<SettingStore>((set) => ({
  settings: null,
  setSettings: (settings) => set({ settings }),
}));

export default useSettingStore;