import React from "react";
import { CloudDownloadOutlined, EnterOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import useShareStore from "../../../store/useShareStore";
import useFetchSharedUserFiles from "../../../hooks/useFetchSharedUserFiles";
import { useNavigate } from "react-router";
import Item from "../../../components/contextMenu/Item";
import { fetchSharedDownloadFile } from "../../../services/shareController";

const ItemContextMenu = React.forwardRef<
  HTMLDivElement,
  {
    style?: React.CSSProperties;
  }
>(({ style }, ref) => {
  const itemCtxMenuPosition = useShareStore(
    (state) => state.itemCtxMenuPosition
  );
  const selectedRecord = useShareStore((state) => state.selectedRecord);

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
  const { path, pwd } = useFetchSharedUserFiles();
  const navigate = useNavigate();
  const selectedRecord = useShareStore((state) => state.selectedRecord);
  const setSelectedRows = useShareStore((state) => state.setSelectedRows);
  const setItemCtxMenuVisible = useShareStore(
    (state) => state.setItemCtxMenuVisible
  );

  // 进入文件夹
  const onEnterFolder = () => {
    const newPath = encodeURIComponent(path + "/" + selectedRecord?.name);
    navigate(`?pwd=${pwd}&path=${newPath}`);
    setSelectedRows([]);
    setItemCtxMenuVisible(false);
  };

  return (
    <>
      <Item
        icon={<EnterOutlined />}
        title={"进入文件夹"}
        onClick={onEnterFolder}
      />
    </>
  );
};

const FileContextMenu = () => {
  const navigate = useNavigate();
  const selectedRecord = useShareStore((state) => state.selectedRecord);
  const setSelectedRows = useShareStore((state) => state.setSelectedRows);
  const shortId = useShareStore((state) => state.shortId);
  const setItemCtxMenuVisible = useShareStore(
    (state) => state.setItemCtxMenuVisible
  );

  const downloadFile = () => {
    fetchSharedDownloadFile(
      selectedRecord?.sourceName as API.FileDTO["sourceName"],
      shortId as string
    );
    setSelectedRows([]);
  };

  const handlePreview = () => {
    navigate(
      `/preview?filePath=${encodeURIComponent(
        selectedRecord?.sourceName as string
      )}&filename=${encodeURIComponent(
        selectedRecord?.name as string
      )}&shortId=${shortId}&isShare=true`
    );
    setItemCtxMenuVisible(false);
    setSelectedRows([]);
  };

  return (
    <>
      <Item icon={<EnterOutlined />} title={"预览"} onClick={handlePreview} />
      <Item
        icon={<CloudDownloadOutlined />}
        title={"下载文件"}
        onClick={downloadFile}
      />
    </>
  );
};
export default ItemContextMenu;
