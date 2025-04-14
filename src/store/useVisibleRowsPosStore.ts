import { create } from "zustand";

interface VisibleRowsPosStore {
  selectedRows: API.FileDTO[];
  setSelectedRows: (rows: API.FileDTO[]) => void;
  itemCtxMenuVisible: boolean;
  setItemCtxMenuVisible: (b: boolean) => void;
  multipleMenuVisible: boolean;
  setMultipleMenuVisible: (b: boolean) => void;
  editModalVisible: boolean;
  setEditModalVisible: (b: boolean) => void;
  shareModalVisible: boolean;
  setShareModalVisible: (b: boolean) => void;
  ctxMenuVisible: boolean;
  setCtxMenuVisible: (b: boolean) => void;
  editModalType: string;
  setEditModalType: (type: string) => void;
  ctxMenuPosition: {
    x: number;
    y: number;
  };
  setCtxMenuPosition: (pos: { x: number; y: number }) => void;
  itemCtxMenuPosition: {
    x: number;
    y: number;
  };
  setItemCtxMenuPosition: (pos: { x: number; y: number }) => void;
  multipleMenuPosition: {
    x: number;
    y: number;
  };
  setMultipleMenuPosition: (pos: { x: number; y: number }) => void;
  selectedRecord: API.FileDTO | null;
  setSelectedRecord: (record: API.FileDTO | null) => void;
}

const useVisibleRowsPosStore = create<VisibleRowsPosStore>((set) => ({
  selectedRows: [],
  setSelectedRows: (rows) => set({ selectedRows: rows }),
  itemCtxMenuVisible: false,
  setItemCtxMenuVisible: (b) => set({ itemCtxMenuVisible: b }),
  multipleMenuVisible: false,
  setMultipleMenuVisible: (b) => set({ multipleMenuVisible: b }),
  editModalVisible: false,
  setEditModalVisible: (b) => set({ editModalVisible: b }),
  shareModalVisible: false,
  setShareModalVisible: (b) => set({ shareModalVisible: b }),
  ctxMenuVisible: false,
  setCtxMenuVisible: (b) => set({ ctxMenuVisible: b }),
  editModalType: "",
  setEditModalType: (type) => set({ editModalType: type }),
  ctxMenuPosition: {
    x: 0,
    y: 0,
  },
  setCtxMenuPosition: (pos) => set({ ctxMenuPosition: pos }),
  itemCtxMenuPosition: {
    x: 0,
    y: 0,
  },
  setItemCtxMenuPosition: (pos) => set({ itemCtxMenuPosition: pos }),
  multipleMenuPosition: {
    x: 0,
    y: 0,
  },
  setMultipleMenuPosition: (pos) => set({ multipleMenuPosition: pos }),
  selectedRecord: null,
  setSelectedRecord: (record) => set({ selectedRecord: record })
}));

export default useVisibleRowsPosStore;