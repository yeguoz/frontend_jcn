import { create } from "zustand";

interface DataStore {
  data: API.FileDTO[] | undefined,
  setData: (data: API.FileDTO[]) => void
}

const useDataStore = create<DataStore>((set) => ({
  data: undefined,
  setData: (data) => set({ data }),
}));

export default useDataStore;