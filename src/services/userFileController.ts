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
      },
      paramsSerializer: (params) => {
        return new URLSearchParams(params).toString();
      }
    });
    return response.data;
  } catch (error) {
    console.error('用户文件创建错误:', error);
  }
}

export const fetchDownloadFile = (filePath: string) => {
  const params = new URLSearchParams();
  params.append("filePath", filePath);

  const url = `/api/userfile/download?${params.toString()}`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



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
        },
        paramsSerializer: (params) => {
          return new URLSearchParams(params).toString();
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
      },
      paramsSerializer: (params) => {
        return new URLSearchParams(params).toString();
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
      paramsSerializer: (params) => {
        return new URLSearchParams(params).toString();
      }
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
  const encodedFilename = encodeURIComponent(filename);

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
    const response = await axios.post(`/api/userfile/upload/chunk/${uploadId}/${encodedFilename}/${chunkIndex}`, formData, {
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
      },
      paramsSerializer: (params) => {
        return new URLSearchParams(params).toString();
      }
    });
    return response.data;
  } catch (error) {
    console.error(`合并分片错误:`, error);
  }
}

export const moveUserFile = async (userFileId: number, targetFolderId: number) => {
  try {
    const response = await axios.put('/api/userfile/move', null, {
      params: {
        userFileId,
        targetFolderId
      },
      paramsSerializer: (params) => {
        return new URLSearchParams(params).toString();
      }
    });
    return response.data;
  } catch (error) {
    console.error('移动用户文件错误:', error);
  }
};

export const copyUserFile = async (fileSize: number, userFileId: number, targetFolderId: number, uploadIds: string[]) => {
  try {
    const response = await axios.post('/api/userfile/copy',
      {
        uploadIds
      },
      {
        params: {
          fileSize,
          userFileId,
          targetFolderId
        },
        paramsSerializer: (params) => {
          return new URLSearchParams(params).toString();
        }
      });
    return response.data;
  } catch (error) {
    console.error('复制用户文件错误:', error);
  }
};

export const deleteUserFile = async (userFileId: number, fileId: number, fileSize: number) => {
  try {
    const response = await axios.delete('/api/userfile', {
      params: { userFileId, fileId, fileSize },
      paramsSerializer: (params) => {
        return new URLSearchParams(params).toString();
      }
    });
    return response.data;
  } catch (error) {
    console.error('删除用户文件错误:', error);
  }
}

export const searchUserFile = async (keyword: string) => {
  try {
    const response = await axios.get(`/api/userfile/search`, {
      params: { keyword },
      paramsSerializer: (params) => {
        return new URLSearchParams(params).toString();
      }
    });
    return response.data;
  } catch (error) {
    console.error('搜索用户文件错误:', error);
  }
}

export const searchUserFileByType = async (type: string) => {
  try {
    const response = await axios.get(`/api/userfile/search/type`, {
      params: { type },
      paramsSerializer: (params) => {
        return new URLSearchParams(params).toString();
      }
    });
    return response.data;
  } catch (error) {
    console.error('搜索用户文件错误:', error);
  }
}
