import { create } from 'zustand';
import * as Comlink from 'comlink';

interface HashWorkerAPI {
  calculateSha256(blob: Blob): Promise<string>;
  calculateMD5(blob: Blob): Promise<string>;
}

interface WorkerState {
  worker: Worker | null;
  workerAPI: Comlink.Remote<HashWorkerAPI> | null;
  initWorker: () => void;
  terminateWorker: () => void;
  getWorkerAPI: () => Promise<Comlink.Remote<HashWorkerAPI>>;
  getWorker: () => Promise<Worker>;
  abortController: AbortController | null;
  abortWorker: () => void;
}

export const useWorkerStore = create<WorkerState>((set, get) => ({
  worker: null,
  workerAPI: null,
  abortController: null,

  initWorker: () => {
    const { worker } = get();
    if (worker) return;

    const newWorker = new Worker(new URL('/src/workers/hashWorker.ts', import.meta.url), {
      type: 'module',
    });
    const newAPI = Comlink.wrap<HashWorkerAPI>(newWorker);
    const newAbortController = new AbortController();

    set({ worker: newWorker, workerAPI: newAPI, abortController: newAbortController });
  },

  terminateWorker: () => {
    const { worker } = get();
    if (worker) worker.terminate();
    set({ worker: null, workerAPI: null });
  },

  getWorkerAPI: async () => {
    const { workerAPI, initWorker } = get();
    if (!workerAPI) {
      initWorker();
      // 等待事件循环下一帧，确保 wrap 后的对象可用（可根据实际情况加延迟或等状态变化）
      await new Promise((r) => setTimeout(r, 0));
      return get().workerAPI!;
    }
    return workerAPI;
  },

  getWorker: async () => {
    const { worker, initWorker } = get();
    if (!worker) {
      initWorker();
      await new Promise((r) => setTimeout(r, 0));
      return get().worker!;
    }
    return worker;
  },

  abortWorker: () => {
    const { abortController } = get();
    abortController?.abort();
    set({ abortController: null });
  },

}));
