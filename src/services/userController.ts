import axios from "../../config/axios";

// 注册
export const register = async (email: string, password: string, checkPassword: string, captcha?: string) => {
  try {
    const response = await axios.post('/api/users', {
      email,
      password,
      checkPassword
    }, {
      params: {
        captcha
      }
    });
    return response.data;
  } catch (error) {
    console.error('请求错误:', error);
  }
};
// 登录
export const login = async (email: string, password: string, captcha?: string) => {
  try {
    const response = await axios.post('/api/users/auth/login', {
      email,
      password
    }, {
      params: {
        captcha
      }
    });
    return response.data;
  } catch (error) {
    console.error('请求错误:', error);
  }
};

// 获取登录用户信息
export const getCurrentUser = async () => {
  try {
    const response = await axios.get('/api/users/current');
    return response.data;
  } catch (error) {
    console.error('请求错误:', error);
  }
};

// 注销
export const logout = async () => {
  try {
    const response = await axios.post('/api/users/logout');
    return response.status;
  } catch (error) {
    console.error('请求错误:', error);
  }
}

// 获取验证码
export const getCaptcha = async (captchaType: string) => {
  try {
    const response = await axios.get('/api/users/captcha', {
      params: {
        captchaType
      }
    });
    return response.data;
  } catch (error) {
    console.error('请求错误:', error);
  }
}