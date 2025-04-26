import axios from "../../config/axios";

export const fetchFiles = async () => {
  try {
    const response = await axios.get('/api/files/admin');
    return response.data;
  } catch (error) {
    console.error('获取所有文件错误:', error);
  }
}
