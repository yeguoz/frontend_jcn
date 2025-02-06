import axios from "../../config/axios";

export const getAuthSetting = async () => {
  try {
    const response = await axios.get('/api/setting/auth');
    return response.data;
  } catch (error) {
    console.error('请求错误:', error);
  }
};

export const getSettingByType = async (type:string) => {
  try {
    const response = await axios.get('/api/setting/type',{
      params: {
        type
      }
    });
    return response.data;
  } catch (error) {
    console.error('请求错误:', error);
  }
};