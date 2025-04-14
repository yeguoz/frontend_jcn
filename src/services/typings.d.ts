declare namespace API {
  type Response = {
    int: number;
    data: T;
    message: string;
  }

  type Policy = {
    id: number;
    name: string;
    type: string;
    publicDirNameRule: string;
    publicFileNameRule: string;
    privateDirNameRule: string;
    privateFileNameRule: string;
    chunkFileNameRule: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };

  type Group = {
    id: number;
    name: string;
    policyId: number;
    maxStorage: number;
    shareEnabled: number;
    webDevEnabled: number;
    speedLimit: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };

  type UserVO = {
    id: number;
    groupId: number;
    name: string;
    email: string;
    status: number;
    avatar: string;
    usedStorage: number;
    createdAt: string;
    updatedAt: string;
    group: Group;
    policy: Policy;
  }

  type FileDTO = {
    id: string;
    userId: number;
    name: string;
    parentId: number;
    size: number;
    fileHash: string;
    sourceName: string;
    folderId: number;
    fileId: number;
    userFileId: number;
    type: string;
    updatedAt: Date;
  }

  type ChunkVO = {
    uploadId: number;
    fileName: string;
    chunkIndex: number;
    chunkSize: number;
    totalChunks: number;
    uploadedChunks: number;
    complete: boolean;
  }

  type FileVO = {
    list: FileDTO[];
  }

  type ShortLinkDTO = {
    userId: number;
    sourceId: number;
    userFileId: number;
    passwordEnabled: boolean;
    password: string|null;
    isDir: number;
    downloadCount: number;
    previewEnabled: boolean;
    expireTimeEnabled: boolean;
    expireTime: Date|null;
  }

  type ShareVO = {
    userVO: UserVO;
    sourceId: number;
    sourceName: string;
    size: number;
    filename: string;
    isDir: boolean;
    previewEnabled: boolean;
    visitCount: number;
    downloadCount: number;
    list: FileDTO[];
    createdAt: Date;
  }

  type ShareInfoVO = {
    userVO: UserVO;
    passwordEnabled: boolean;
    isDir: boolean ;
    sourceName: string;
    createdAt: Date;
  }
}