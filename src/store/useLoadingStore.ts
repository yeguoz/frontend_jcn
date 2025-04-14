import { create } from "zustand";

interface LoadingStore {
  tableIsLoading: boolean;
  setTableIsLoading: (b: boolean) => void;
  sharedTableIsLoading: boolean;
  setSharedTableIsLoading: (b: boolean) => void;
}

const useLoadingStore = create<LoadingStore>((set) => ({
  tableIsLoading: false,
  setTableIsLoading: (b) => {
    return set({ tableIsLoading: b });
  },
  sharedTableIsLoading: false,
  setSharedTableIsLoading: (b) => {
    return set({ sharedTableIsLoading: b });
  }
})
);

export default useLoadingStore;