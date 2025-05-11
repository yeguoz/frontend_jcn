import axios from "../../config/axios";

export const createShortLink = async (
  { userId, sourceId, userFileId, passwordEnabled, password, isDir, remainingDownloads, previewEnabled, expireTimeEnabled, expireTime }: API.ShortLinkDTO) => {
  try {
    const response = await axios.post('/api/s', {
      userId, sourceId, userFileId, passwordEnabled, password, isDir, remainingDownloads, previewEnabled, expireTimeEnabled, expireTime
    });
    return response.data;
  } catch (error) {
    console.error('创建分享链接错误:', error);
  }
};

export const fetchSharedFileInfo = async (shortId: string) => {
  try {
    const response = await axios.get(`/api/s/info/${shortId}`);
    return response.data;
  } catch (error) {
    console.error('获取共享文件信息错误:', error);
  }
};

export const fetchSharedFile = async (shortId: string, password?: string, path?: string) => {
  try {
    const response = await axios.get(`/api/s/${shortId}`, {
      params: {
        password,
        path
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取共享文件错误:', error);
  }
};

export const fetchShareList = async () => {
  try {
    const response = await axios.get('/api/s/list');
    return response.data;
  } catch (error) {
    console.error('获取共享文件列表错误:', error);
  }
};

export const updatePwdEnabled = async (id: number, passwordEnabled: number, password: string) => {
  try {
    const response = await axios.put(`/api/s/public/${id}`, { passwordEnabled, password });
    return response.data;
  } catch (error) {
    console.error('更新共享文件错误:', error);
  }
};

export const updatePreEnabled = async (id: number, previewEnabled: number) => {
  try {
    const response = await axios.put(`/api/s/preview/${id}`, { previewEnabled });
    return response.data;
  } catch (error) {
    console.error('更新共享文件错误:', error);
  }
};

export const deleteShare = async (id: number) => {
  try {
    const response = await axios.delete(`/api/s/${id}`);
    return response.data;
  } catch (error) {
    console.error('删除共享文件错误:', error);
  }
};

export const fetchSharedDownloadFile = (filePath: string, shortId: string) => {
  const params = new URLSearchParams();
  params.append("filePath", filePath);
  params.append("shortId", shortId);

  const url = `/api/s/download?${params.toString()}`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};