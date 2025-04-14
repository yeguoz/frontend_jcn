import { create } from 'zustand';
import { produce } from 'immer';

type UploadStatus = 'pending' | 'uploading' | 'handle' | 'success' | 'error';

export interface UploadTask {
  uploadId: number;
  filename: string;
  filesize: number;
  fingerprint: string;
  progress: number;
  status: UploadStatus;
  speed?: number;
  message?: string;
  completed?: boolean;
  bytes: Record<number, number>; // 分片索引 -> 上传字节数
}

type UploadStore = {
  tasks: Record<number, UploadTask>; // uploadId -> task
  addTask: (task: UploadTask) => void;
  removeTask: (uploadId: number) => void;
  updateTask: (uploadId: number, updater: (task: UploadTask) => void) => void;
  getUploadedBytes: (uploadId: number) => number;
  removeTasksByStatus: (status: UploadStatus) => void;
  getCompletedCount: () => number;
};

const useUploadStore = create<UploadStore>((set, get) => ({
  tasks: {},

  addTask: (task) =>
    set(
      produce((state: UploadStore) => {
        state.tasks[task.uploadId] = task;
      })
    ),

  removeTask: (uploadId) =>
    set(
      produce((state: UploadStore) => {
        delete state.tasks[uploadId];
      })
    ),

  updateTask: (uploadId, updater) =>
    set(
      produce((state: UploadStore) => {
        const task = state.tasks[uploadId];
        if (task) updater(task);
      })
    ),

  getUploadedBytes: (uploadId) => {
    const task = get().tasks[uploadId];
    if (!task) return 0;
    return Object.values(task.bytes).reduce((sum, b) => sum + b, 0);
  },

  removeTasksByStatus: (status: UploadTask['status']) =>
    set(
      produce((state) => {
        for (const key in state.tasks) {
          if (state.tasks[key].status === status) {
            delete state.tasks[key];
          }
        }
      })
    ),

    getCompletedCount: () => {
      const tasks = get().tasks;
      let count = 0;
      Object.keys(tasks).forEach((key) => {
        if (tasks[Number(key)].completed) count++;
      });
      return count;
    },
}));

export default useUploadStore;
