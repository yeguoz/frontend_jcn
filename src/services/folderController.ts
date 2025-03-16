import axios from "../../config/axios";

export const createFolder = async (path: string, name: string) => {
  try {
    const response = await axios.post('/api/folder', null, {
      params: {
        path,
        name
      }
    });
    return response.data;
  } catch (error) {
    console.error('创建文件夹错误:', error);
  }
};
