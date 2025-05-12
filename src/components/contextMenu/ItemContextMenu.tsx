import React from "react";
import {
  CloudDownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EnterOutlined,
  ExportOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import styles from "./index.module.css";
import useVisibleRowsPosStore from "../../store/useVisibleRowsPosStore";
import Item from "./Item";
import { useNavigate } from "react-router";
import useFetchUserFiles from "../../hooks/useFetchUserFiles";
import { fetchDownloadFile } from "../../services/userFileController";

const ItemContextMenu = React.forwardRef<
  HTMLDivElement,
  {
    style?: React.CSSProperties;
  }
>(({ style }, ref) => {
  const itemCtxMenuPosition = useVisibleRowsPosStore(
    (state) => state.itemCtxMenuPosition
  );
  const selectedRecord = useVisibleRowsPosStore(
    (state) => state.selectedRecord
  );
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: itemCtxMenuPosition.x,
        top: itemCtxMenuPosition.y,
        ...style,
      }}
    >
      <div className={styles.container}>
        {selectedRecord?.type === "folder" && <FolderContextMenu />}
        {selectedRecord?.type === "file" && <FileContextMenu />}
      </div>
    </div>
  );
});

const FolderContextMenu = () => {
  const { path } = useFetchUserFiles();
  const navigate = useNavigate();
  const selectedRecord = useVisibleRowsPosStore(
    (state) => state.selectedRecord
  );
  const setSelectedRows = useVisibleRowsPosStore(
    (state) => state.setSelectedRows
  );
  const setItemCtxMenuVisible = useVisibleRowsPosStore(
    (state) => state.setItemCtxMenuVisible
  );
  const setEditModalType = useVisibleRowsPosStore(
    (state) => state.setEditModalType
  );
  const setEditModalVisible = useVisibleRowsPosStore(
    (state) => state.setEditModalVisible
  );
  const setShareModalVisible = useVisibleRowsPosStore(
    (state) => state.setShareModalVisible
  );
  const setTreeModalVisible = useVisibleRowsPosStore(
    (state) => state.setTreeModalVisible
  );
  const setTreeModalType = useVisibleRowsPosStore(
    (state) => state.setTreeModalType
  );

  // 进入文件夹
  const onEnterFolder = () => {
    const newPath = encodeURIComponent(path + "/" + selectedRecord?.name);
    navigate(`/home?path=${newPath}`);
    setSelectedRows([]);
    setItemCtxMenuVisible(false);
  };

  // 重命名
  const onRename = () => {
    setItemCtxMenuVisible?.(false);
    setEditModalVisible?.(true);
    setEditModalType?.("renameFolder");
  };

  const onDelete = () => {
    setEditModalType("deleteFolder");
    setEditModalVisible(true);
    setItemCtxMenuVisible(false);
  };

  const onShare = () => {
    setItemCtxMenuVisible?.(false);
    setShareModalVisible(true);
  };

  const onCopy = () => {
    setItemCtxMenuVisible?.(false);
    setTreeModalVisible(true);
    setTreeModalType("copy");
  };

  const onMove = () => {
    setItemCtxMenuVisible?.(false);
    setTreeModalVisible(true);
    setTreeModalType("move");
  };

  return (
    <>
      <Item
        icon={<EnterOutlined />}
        title={"进入文件夹"}
        onClick={onEnterFolder}
      />
      <Item
        icon={<ShareAltOutlined />}
        title={"创建分享链接"}
        onClick={onShare}
      />
      <Item icon={<EditOutlined />} title={"重命名"} onClick={onRename} />
      <Item icon={<CopyOutlined />} title={"复制"} onClick={onCopy} />
      <Item icon={<ExportOutlined />} title={"移动"} onClick={onMove} />
      <Item icon={<DeleteOutlined />} title={"删除"} onClick={onDelete} />
    </>
  );
};

const FileContextMenu = () => {
  const navigate = useNavigate();
  const setItemCtxMenuVisible = useVisibleRowsPosStore(
    (state) => state.setItemCtxMenuVisible
  );
  const setEditModalType = useVisibleRowsPosStore(
    (state) => state.setEditModalType
  );
  const setEditModalVisible = useVisibleRowsPosStore(
    (state) => state.setEditModalVisible
  );
  const selectedRecord = useVisibleRowsPosStore(
    (state) => state.selectedRecord
  );
  const setSelectedRows = useVisibleRowsPosStore(
    (state) => state.setSelectedRows
  );
  const setShareModalVisible = useVisibleRowsPosStore(
    (state) => state.setShareModalVisible
  );
  const setTreeModalVisible = useVisibleRowsPosStore(
    (state) => state.setTreeModalVisible
  );
  const setTreeModalType = useVisibleRowsPosStore(
    (state) => state.setTreeModalType
  );

  const onDelete = () => {
    setEditModalType("delete");
    setEditModalVisible(true);
    setItemCtxMenuVisible(false);
  };

  const downloadFile = () => {
    fetchDownloadFile(selectedRecord?.sourceName as string);
    setSelectedRows([]);
    setItemCtxMenuVisible?.(false);
  };

  const onRename = () => {
    setItemCtxMenuVisible?.(false);
    setEditModalVisible?.(true);
    setEditModalType?.("renameFile");
  };

  const onShare = () => {
    setItemCtxMenuVisible?.(false);
    setShareModalVisible(true);
  };

  const onCopy = () => {
    setItemCtxMenuVisible?.(false);
    setTreeModalVisible(true);
    setTreeModalType("copy");
  };

  const onMove = () => {
    setItemCtxMenuVisible?.(false);
    setTreeModalVisible(true);
    setTreeModalType("move");
  };

  const onPreview = () => {
    navigate(
      `/preview?filename=${encodeURIComponent(selectedRecord?.name as string)}`,
      {
        state: {
          filePath: `${encodeURIComponent(
            selectedRecord?.sourceName as string
          )}`,
        },
      }
    );
  };

  return (
    <>
      <Item icon={<EnterOutlined />} title={"打开文件"} onClick={onPreview}/>
      <Item
        icon={<CloudDownloadOutlined />}
        title={"下载文件"}
        onClick={downloadFile}
      />
      <Item
        icon={<ShareAltOutlined />}
        title={"创建分享链接"}
        onClick={onShare}
      />
      <Item icon={<EditOutlined />} title={"重命名"} onClick={onRename} />
      <Item icon={<CopyOutlined />} title={"复制"} onClick={onCopy} />
      <Item icon={<ExportOutlined />} title={"移动"} onClick={onMove} />
      <Item icon={<DeleteOutlined />} title={"删除"} onClick={onDelete} />
    </>
  );
};
export default ItemContextMenu;
