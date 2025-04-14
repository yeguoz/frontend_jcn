import { create } from "zustand";

interface ShareStore {
  infoData: API.ShareInfoVO | null;
  setInfoData: (infoData: API.ShareInfoVO | null) => void;
  shortId: string | null,
  setShortId: (shortId: string) => void;
  pwdVisible: boolean,
  setPwdVisible: (pwdVisible: boolean) => void;
  fileVisible: boolean,
  setFileVisible: (fileVisible: boolean) => void;
  folderVisible: boolean,
  setFolderVisible: (folderVisible: boolean) => void;
  data: API.ShareVO | null;
  setData: (data: API.ShareVO | null) => void;
  breadrumbitems: { path: string, name: string }[];
  addBreadrumbItem: (item: { path: string, name: string }) => void;
  setBreadrumbitems: (items: { path: string, name: string }[]) => void;
  selectedRows: API.FileDTO[];
  setSelectedRows: (rows: API.FileDTO[]) => void;
  selectedRecord: API.FileDTO | null;
  setSelectedRecord: (record: API.FileDTO | null) => void;
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
  itemCtxMenuVisible: boolean;
  setItemCtxMenuVisible: (b: boolean) => void;
  multipleMenuVisible: boolean;
  setMultipleMenuVisible: (b: boolean) => void;
}

const useShareStore = create<ShareStore>((set) => ({
  infoData: null,
  setInfoData: (infoData) => set({ infoData }),
  shortId: null,
  setShortId: (shortId) => set({ shortId }),
  pwdVisible: false,
  setPwdVisible: (pwdVisible) => set({ pwdVisible }),
  fileVisible: false,
  setFileVisible: (fileVisible) => set({ fileVisible }),
  folderVisible: false,
  setFolderVisible: (folderVisible) => set({ folderVisible }),
  data: null,
  setData: (data) => set({ data }),
  breadrumbitems: [],
  addBreadrumbItem: (item) => set((state) => ({ breadrumbitems: [...state.breadrumbitems, item] })),
  setBreadrumbitems: (items) => set({ breadrumbitems: items }),
  selectedRows: [],
  setSelectedRows: (rows) => set({ selectedRows: rows }),
  selectedRecord: null,
  setSelectedRecord: (record) => set({ selectedRecord: record }),
  itemCtxMenuPosition: {
    x: 0,
    y: 0,
  },
  setItemCtxMenuPosition: (pos) => set({ itemCtxMenuPosition: pos }),
  multipleMenuPosition: {
    x: 0,
    y: 0,
  },
  setMultipleMenuPosition: (pos) => set({
    multipleMenuPosition: pos
  }),
  itemCtxMenuVisible: false,
  setItemCtxMenuVisible: (b) => set({ itemCtxMenuVisible: b }),
  multipleMenuVisible: false,
  setMultipleMenuVisible: (b) => set({ multipleMenuVisible: b })
}));

export default useShareStore;