import axios from "../../config/axios";

export const getUserFiles = async (path: string) => {
  try {
    const response = await axios.get('/api/userfile', {
      params: {
        path
      }
    });
    return response.data;
  } catch (error) {
    console.error('请求错误:', error);
  }
}