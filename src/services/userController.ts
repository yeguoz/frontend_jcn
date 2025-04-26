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
    console.error('注册错误:', error);
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
    console.error('登录错误:', error);
  }
};

// 获取登录用户信息
export const getCurrentUser = async () => {
  try {
    const response = await axios.get('/api/users/current');
    return response.data;
  } catch (error) {
    console.error('获取登录用户错误:', error);
  }
};

// 注销
export const logout = async () => {
  try {
    const response = await axios.post('/api/users/logout');
    return response.data;
  } catch (error) {
    console.error('注销错误:', error);
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
    console.error('获取验证码错误:', error);
  }
}

// 获取session id
export const getSessionId = async () => {
  try {
    const response = await axios.get('/api/users/session');
    return response.data;
  } catch (error) {
    console.error('获取session id错误:', error);
  }
}

export const updatePersonInfo = async ({ nickname, password }: { nickname?: string, password?: string }) => {
  try {
    const response = await axios.put('/api/users', null, {
      params: {
        nickname,
        password
      }
    });
    return response.data;
  } catch (error) {
    console.error('更新个人资料错误:', error);
  }
}

export const uploadAvatar = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/users/upload/avatar', formData, { headers: { "Content-Type": "multipart/form-data" } });
    return response.data;
  } catch (error) {
    console.error('上传头像失败:', error);
  }
}

export const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/users/admin');
    return response.data;
  } catch (error) {
    console.error('获取所有用户错误:', error);
  }
}
