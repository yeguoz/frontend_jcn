import { create } from "zustand";

interface AuthStore {
  user: API.UserVO | null;
  isAuth: boolean,
  setUser: (user: API.UserVO | null) => void;
  setIsAuth: (b: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuth: false,
  setUser: (user) => set({ user }),
  setIsAuth: (isAuth) => set({ isAuth }),
}));

export default useAuthStore;