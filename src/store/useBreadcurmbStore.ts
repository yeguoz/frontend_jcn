import { create } from "zustand";

type BreadcurmItems = { path: string, name: string };

interface BreadcurmStore {
  items: BreadcurmItems[];
  setNewItem: (items: BreadcurmItems) => void;
  setItems: (newItems: BreadcurmItems[]) => void;
}

function getInitialItems() {
  const searchParams = new URLSearchParams(window.location.search);
  let path = searchParams.get('path');
  if (path === null || path === "") {
    path = "/";
  }
  const breadrumbitems = [{ path: "/", name: "/" }];
  path
    .split("/")
    .filter((item) => item !== "")
    .map((item) => {
      breadrumbitems.push({ path: item, name: item });
    });
  return breadrumbitems;
}

const useBreadcurmbStore = create<BreadcurmStore>((set) => ({
  items: getInitialItems(),
  setNewItem: (newItem) => set((state) => ({ items: [...state.items, newItem] })),
  setItems: (newItems) => set({ items: newItems })
}));

export default useBreadcurmbStore;