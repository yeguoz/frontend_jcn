class ConcurrentUploader {
  concurrentLimit: number;                  // 最大并发数
  uploadQueue: Array<() => Promise<void>>;  // 分片上传任务队列
  activeUploads: number;                    // 当前进行中的上传任务数

  constructor(concurrentLimit: number) {
    this.concurrentLimit = concurrentLimit;
    this.uploadQueue = [];
    this.activeUploads = 0;
  }

  // 添加上传任务到队列
  addUploadTask(uploadTask: () => Promise<void>) {
    this.uploadQueue.push(uploadTask);
    this.processQueue();                      // 尝试处理队列中的任务
  }

  // 处理上传任务队列
  processQueue() {
    // 如果当前进行中的上传任务数小于最大并发数，且队列中有待处理的任务
    while (this.activeUploads < this.concurrentLimit && this.uploadQueue.length > 0) {
      const uploadTask = this.uploadQueue.shift()!; // 取出队列中的第一个任务
      this.activeUploads++;                         // 增加进行中的上传任务数
      uploadTask().finally(() => {
        this.activeUploads--;                       // 上传任务完成后，减少进行中的上传任务数
        this.processQueue();                        // 递归调用，处理下一个任务
      });
    }
  }
}

export default ConcurrentUploader;