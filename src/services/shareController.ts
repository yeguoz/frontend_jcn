import axios from "../../config/axios";

export const createShortLink = async (
  { userId, sourceId, userFileId, passwordEnabled, password, isDir, downloadCount, previewEnabled, expireTimeEnabled, expireTime }: API.ShortLinkDTO) => {
  try {
    const response = await axios.post('/api/s', {
      userId, sourceId, userFileId, passwordEnabled, password, isDir, downloadCount, previewEnabled, expireTimeEnabled, expireTime
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