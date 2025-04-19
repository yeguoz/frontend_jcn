import axios from "../../config/axios";
import { UploadTask } from "../store/useUploadStore";

export const getUserFiles = async (path: string) => {
  try {
    const response = await axios.get('/api/userfile', {
      params: {
        path
      }
    });
    return response.data;
  } catch (error) {
    console.error('用户文件请求错误:', error);
  }
}

export const createUserFiles = async (path: string, filename: string) => {
  try {
    const response = await axios.post('/api/userfile', null, {
      params: {
        path,
        filename
      }
    });
    return response.data;
  } catch (error) {
    console.error('用户文件创建错误:', error);
  }
}

export const deleteUserFile = async (body: API.FileDTO | null) => {
  try {
    const response = await axios.delete('/api/userfile', {
      data: body
    });
    return response.data;
  } catch (error) {
    console.error('用户文件删除错误:', error);
  }
}


export const fetchDownloadFile = async (filePath: string, shortId?: string) => {
  try {
    const response = await axios.get('/api/userfile/download/file', {
      params: {
        filePath,
        shortId
      },
      responseType: 'stream',
    });
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const disposition = response.headers['content-disposition'];
    let fileName = 'downloaded_file';
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        fileName = matches[1].replace(/['"]/g, '');
      }
    }
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return;
  } catch (error) {
    console.error('下载请求错误:', error);
  }
}


export const renameFile = async (id: number, name: string) => {
  try {
    const response = await axios.post('/api/userfile/rename', null, {
      params: {
        id,
        name
      }
    });
    return response.data;
  } catch (error) {
    console.error('重命名文件错误:', error);
  }
};

export const previewFile = async (filePath: string) => {
  try {
    const response = await axios.get(`/api/userfile/preview/${filePath}`, {
      params: { filePath },
    });
    return response.data;
  } catch (error) {
    console.error('预览请求错误:', error);
  }
}

export const fetchUploadSession = async (fingerprint: string, totalChunks: number, filename: string, fileSize: number,
  uploadIds: string[]) => {
  try {
    const response = await axios.post('/api/userfile/upload/session',
      {
        uploadIds
      },
      {
        params: {
          fingerprint,
          totalChunks,
          filename,
          fileSize,
        }
      });
    return response.data;
  } catch (error) {
    console.error('获取上传会话错误:', error);
  }
};

export const fetchUploadedChunks = async (fingerprint: string) => {
  try {
    const response = await axios.get('/api/userfile/uploaded/chunks', {
      params: {
        fingerprint
      }
    });
    return response.data;
  } catch (error) {
    console.error('请求已上传分片错误:', error);
  }
}

export const fetchChunksStatus = async (fingerprint: string) => {
  try {
    const response = await axios.get(`/api/userfile/uploaded/chunks/status`, {
      params: { fingerprint },
    });
    return response.data;
  } catch (error) {
    console.error('请求分片状态错误:', error);
  }
}

export const uploadChunk = async (
  uploadId: string,
  fingerprint: string,
  md5: string,
  chunk: Blob,
  filename: string,
  chunkIndex: number,
  totalChunks: number,
  uploadIds: string[],
  fileSize: number,
  updateTask: (uploadId: string, updater: (task: UploadTask) => void) => void,
) => {
  let lastTime = Date.now();
  let lastUploadedBytes = 0;
  const speedHistory: Record<string, number[]> = {};
  if (!speedHistory[uploadId]) speedHistory[uploadId] = [];

  const formData = new FormData();
  formData.append("fingerprint", fingerprint);
  formData.append("md5", md5);
  formData.append("chunk", chunk);
  formData.append("totalChunks", totalChunks.toString());
  formData.append("uploadRequest", JSON.stringify({ uploadIds: uploadIds }));
  formData.append("fileSize", fileSize.toString());

  try {
    const response = await axios.post(`/api/userfile/upload/chunk/${uploadId}/${filename}/${chunkIndex}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },

      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const currentTime = Date.now();
          const timeDiff = (currentTime - lastTime) / 1000;
          const byteDiff = progressEvent.loaded - lastUploadedBytes;
          const loaded = progressEvent.loaded;
          lastTime = currentTime;
          lastUploadedBytes = loaded;

          updateTask(uploadId, (task) => {
            // 分片字节记录
            task.bytes[chunkIndex] = loaded;

            // 总进度更新
            const sumBytes = Object.values(task.bytes || {}).reduce((a, b) => a + b, 0);
            task.progress = task.filesize ? (sumBytes / task.filesize) * 100 : 0;

            // 上传速度计算
            if (timeDiff > 0) {
              const speed = byteDiff / timeDiff;
              speedHistory[uploadId].push(speed);
              if (speedHistory[uploadId].length > 5) {
                speedHistory[uploadId].shift();
              }
              const avgSpeed = speedHistory[uploadId].reduce((sum, s) => sum + s, 0) / speedHistory[uploadId].length;
              task.speed = avgSpeed;
            }
          });
        }
      }
    });
    return response.data;
  } catch (error) {
    console.error("上传错误分片[${chunkIndex + 1}]:", error);
  }
}

export const mergeChunks = async (
  path: string,
  uploadId: string,
  fingerprint: string,
  size: number,
  filename: string,
  totalChunks: number,
  webkitRelativePath: string) => {
  try {
    const response = await axios.post("/api/userfile/upload/merge", null, {
      params: {
        path,
        uploadId,
        fingerprint,
        size,
        filename,
        totalChunks,
        webkitRelativePath
      }
    });
    return response.data;
  } catch (error) {
    console.error(`合并分片错误:`, error);
  }
}