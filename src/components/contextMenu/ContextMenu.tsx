import React from "react";
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  FileAddOutlined,
  FolderAddOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import styles from "./index.module.css";
import useLoadingStore from "../../store/useLoadingStore";
import useVisibleRowsPosStore from "../../store/useVisibleRowsPosStore";
import Item from "./Item";
import useFetchUserFiles from "../../hooks/useFetchUserFiles";
import FolderUploadIcon from "../icon/FolderUploadIcon";

const ContextMenu = React.forwardRef<
  HTMLDivElement,
  {
    style?: React.CSSProperties;
    fileUploadInputRef: React.RefObject<HTMLInputElement>;
    dirUploadInputRef: React.RefObject<HTMLInputElement>;
  }
>(({ style, fileUploadInputRef,dirUploadInputRef }, ref) => {
  const setCtxMenuVisible = useVisibleRowsPosStore(
    (state) => state.setCtxMenuVisible
  );
  const setEditModalVisible = useVisibleRowsPosStore(
    (state) => state.setEditModalVisible
  );
  const setEditModalType = useVisibleRowsPosStore(
    (state) => state.setEditModalType
  );
  const setSelectedRows = useVisibleRowsPosStore(
    (state) => state.setSelectedRows
  );
  const ctxMenuPosition = useVisibleRowsPosStore(
    (state) => state.ctxMenuPosition
  );
  const setTableIsLoading = useLoadingStore((state) => state.setTableIsLoading);
  const { fetchUserFiles,pathRef } = useFetchUserFiles();

  const onReload = async () => {
    setTableIsLoading(true);
    try {
      fetchUserFiles(pathRef.current);
    } finally {
      setTableIsLoading(false);
      setCtxMenuVisible?.(false);
      setSelectedRows([]);
    }
  };

  const onCreateFolder = async () => {
    setCtxMenuVisible?.(false);
    setEditModalVisible?.(true);
    setEditModalType?.("folder");
  };

  const onCreateFile = async () => {
    setCtxMenuVisible?.(false);
    setEditModalVisible?.(true);
    setEditModalType?.("file");
  };
  
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: ctxMenuPosition.x,
        top: ctxMenuPosition.y,
        zIndex: 1000,
        ...style,
      }}
    >
      <div className={styles.container}>
        <Item icon={<ReloadOutlined />} title={"刷新"} onClick={onReload} />
        <Item
          icon={<CloudUploadOutlined />}
          title={"上传文件"}
          onClick={() => {
            fileUploadInputRef.current?.click();
          }}
        />
        <Item
          icon={<FolderUploadIcon />}
          title={"上传目录"}
          onClick={() => {
            dirUploadInputRef.current?.click();
          }}
        />
        <Item icon={<CloudDownloadOutlined />} title={"离线下载"} />
        <Item
          icon={<FolderAddOutlined />}
          title={"创建文件夹"}
          onClick={onCreateFolder}
        />
        <Item
          icon={<FileAddOutlined />}
          title={"创建文件"}
          onClick={onCreateFile}
        />
      </div>
    </div>
  );
});

export default ContextMenu;
