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

export const renameFolder = async (id: number, name: string) => {
  try {
    const response = await axios.post('/api/folder/rename', null, {
      params: {
        id,
        name
      }
    });
    return response.data;
  } catch (error) {
    console.error('重命名文件夹错误:', error);
  }
};

export const fetchSubFolders = async (path: string | null, id: number | null) => {
  try {
    const response = await axios.get('/api/folder/sub', {
      params: {
        path,
        id
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取子目录错误:', error);
  }
}

export const moveFolder = async (originFolderId: number, targetFolderId: number) => {
  try {
    const response = await axios.put('/api/folder/move', null, {
      params: {
        originFolderId,
        targetFolderId
      }
    });
    return response.data;
  } catch (error) {
    console.error('移动文件夹错误:', error);
  }
};

export const copyFolder = async (originFolderId: number, targetFolderId: number, folderName: string, uploadIds: string[]) => {
  try {
    const response = await axios.post('/api/folder/copy',
      {
        uploadIds
      },
      {
        params: {
          originFolderId,
          targetFolderId,
          folderName
        }
      });
    return response.data;
  } catch (error) {
    console.error('复制文件夹错误:', error);
  }
};

export const deleteFolder = async (originFolderId: number) => {
  try {
    const response = await axios.delete('/api/folder',
      {
        params: {
          originFolderId
        }
      });
    return response.data;
  } catch (error) {
    console.error('删除文件夹错误:', error);
  }
};

