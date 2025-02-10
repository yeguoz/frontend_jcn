import { create } from "zustand";

interface AuthStore {
  user: API.User | null;
  isAuth: boolean,
  setUser: (user: API.User | null) => void;
  setIsAuth: (b: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuth: false,
  setUser: (user) => set({ user }),
  setIsAuth: (isAuth) => set({ isAuth }),
}));

export default useAuthStore;