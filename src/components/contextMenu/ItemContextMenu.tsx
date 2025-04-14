import React from "react";
import {
  CloudDownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EnterOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import styles from "./index.module.css";
import useVisibleRowsPosStore from "../../store/useVisibleRowsPosStore";
import Item from "./Item";
import { useNavigate } from "react-router";
import useFetchUserFiles from "../../hooks/useFetchUserFiles";

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

  return (
    <>
      <Item
        icon={<EnterOutlined />}
        title={"进入文件夹"}
        onClick={onEnterFolder}
      />
      {/* <Item icon={<CloudDownloadOutlined />} title={"打包下载"} /> */}
      {/* <Item icon={<ZipIcon />} title={"压缩"} /> */}
      <Item
        icon={<ShareAltOutlined />}
        title={"创建分享链接"}
        onClick={onShare}
      />
      <Item icon={<InfoCircleOutlined />} title={"详细信息"} />
      <Item icon={<EditOutlined />} title={"重命名"} onClick={onRename} />
      <Item icon={<CopyOutlined />} title={"复制"} />
      <Item icon={<ExportOutlined />} title={"移动"} />
      <Item icon={<DeleteOutlined />} title={"删除"} onClick={onDelete} />
    </>
  );
};

const FileContextMenu = () => {
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

  const onDelete = () => {
    setEditModalType("deleteFile");
    setEditModalVisible(true);
    setItemCtxMenuVisible(false);
  };

  const dowloadFile = async () => {
    const url = `/api/${selectedRecord?.sourceName}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = selectedRecord?.name as string;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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

  return (
    <>
      <Item icon={<EnterOutlined />} title={"打开文件"} />
      <Item
        icon={<CloudDownloadOutlined />}
        title={"下载文件"}
        onClick={dowloadFile}
      />
      {/* <Item icon={<ZipIcon />} title={"压缩"} /> */}
      <Item
        icon={<ShareAltOutlined />}
        title={"创建分享链接"}
        onClick={onShare}
      />
      <Item icon={<InfoCircleOutlined />} title={"详细信息"} />
      <Item icon={<EditOutlined />} title={"重命名"} onClick={onRename} />
      <Item icon={<CopyOutlined />} title={"复制"} />
      <Item icon={<ExportOutlined />} title={"移动"} />
      <Item icon={<DeleteOutlined />} title={"删除"} onClick={onDelete} />
    </>
  );
};
export default ItemContextMenu;
