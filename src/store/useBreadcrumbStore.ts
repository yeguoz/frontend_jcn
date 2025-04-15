import { create } from "zustand";

type BreadcrumbItems = { path: string, name: string };

interface BreadcrumbStore {
  items: BreadcrumbItems[];
  setNewItem: (items: BreadcrumbItems) => void;
  setItems: (newItems: BreadcrumbItems[]) => void;
}

function getInitialItems() {
  const searchParams = new URLSearchParams(window.location.search);
  let path = searchParams.get('path');
  if (path === null || path === "") {
    path = "/";
  }
  const breadcrumbItems = [{ path: "/", name: "/" }];
  path
    .split("/")
    .filter((item) => item !== "")
    .map((item) => {
      breadcrumbItems.push({ path: item, name: item });
    });
  return breadcrumbItems;
}

const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  items: getInitialItems(),
  setNewItem: (newItem) => set((state) => ({ items: [...state.items, newItem] })),
  setItems: (newItems) => set({ items: newItems })
}));

export default useBreadcrumbStore;