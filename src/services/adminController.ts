import axios from "../../config/axios";

export const fetchFiles = async () => {
  try {
    const response = await axios.get('/api/admin/files');
    return response.data;
  } catch (error) {
    console.error('获取所有文件错误:', error);
  }
}

export const fetchSharedFiles = async () => {
  try {
    const response = await axios.get('/api/admin/share');
    return response.data;
  } catch (error) {
    console.error('获取共享文件错误:', error);
  }
}

export const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/admin/users');
    return response.data;
  } catch (error) {
    console.error('获取用户错误:', error);
  }
}

export const fetchPolicies = async () => {
  try {
    const response = await axios.get('/api/admin/policies');
    return response.data;
  } catch (error) {
    console.error('获取策略错误:', error);
  }
}

export const fetchUserFiles = async () => {
  try {
    const response = await axios.get('/api/admin/userfiles');
    return response.data;
  } catch (error) {
    console.error('获取用户文件错误:', error);
  }
}

export const deleteSharedFile = async (id: number) => {
  try {
    const response = await axios.delete('/api/admin/share', {
      params: {
        id
      }
    });
    return response.data;
  } catch (error) {
    console.error('删除共享文件错误:', error);
  }
}

export const deleteUserFile = async (id: number) => {
  try {
    const response = await axios.delete('/api/admin/userfile', {
      params: {
        id
      }
    });
    return response.data;
  } catch (error) {
    console.error('删除用户文件错误:', error);
  }
}

export const fetchGroups = async () => {
  try {
    const response = await axios.get('/api/admin/groups');
    return response.data;
  } catch (error) {
    console.error('获取用户组错误:', error);
  }
}

export const deleteUser = async (id: number) => {
  try {
    const response = await axios.delete('/api/admin/user', {
      params: {
        id
      }
    });
    return response.data;
  } catch (error) {
    console.error('删除用户错误:', error);
  }
}

export const deleteGroup = async (id: number) => {
  try {
    const response = await axios.delete('/api/admin/group', {
      params: {
        id
      }
    });
    return response.data;
  } catch (error) {
    console.error('删除用户组错误:', error);
  }
}

export const createGroup = async (groupName: string, policyId: number, maxStorage: number, shareEnabled: boolean) => {
  try {
    const response = await axios.post('/api/admin/group', null, {
      params: {
        groupName,
        policyId,
        maxStorage,
        shareEnabled
      }
    });
    return response.data;
  } catch (error) {
    console.error('创建用户组错误:', error);
  }
}

export const editGroup = async (id: number, policyId: number, maxStorage: number, shareEnabled: boolean) => {
  try {
    const response = await axios.put('/api/admin/group', null, {
      params: {
        id,
        policyId,
        maxStorage,
        shareEnabled
      }
    });
    return response.data;
  } catch (error) {
    console.error('编辑用户组错误:', error);
  }
}

export const editUser = async (id: number, groupId: number, policyId: number, status: number) => {
  try {
    const response = await axios.put('/api/admin/user', null, {
      params: {
        id,
        groupId,
        policyId,
        status
      }
    });
    return response.data;
  } catch (error) {
    console.error('编辑用户错误:', error);
  }
}

export const editSiteInfo = async (values: Record<string, { id: number, value: string }>) => {
  try {
    const response = await axios.put('/api/admin/site', values);
    return response.data;
  } catch (error) {
    console.error('编辑站点信息错误:', error);
  }
}

export const editAuthInfo = async (values: Record<string, { id: number, value: string }>) => {
  try {
    const response = await axios.put('/api/admin/auth', values);
    return response.data;
  } catch (error) {
    console.error('编辑站点信息错误:', error);
  }
}

export const editMailInfo = async (values: Record<string, { id: number, value: string }>) => {
  try {
    const response = await axios.put('/api/admin/mail', values);
    return response.data;
  } catch (error) {
    console.error('编辑邮件信息错误:', error);
  }
}