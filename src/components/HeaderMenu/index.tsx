import { Flex, Tooltip } from "antd";
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  EnterOutlined,
  ExportOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import useVisibleRowsPosStore from "../../store/useVisibleRowsPosStore";
import useFetchUserFiles from "../../hooks/useFetchUserFiles";
import { useNavigate } from "react-router";
import formatBytesUtil from "../../utils/formatBytesUtil";

const HeaderMenu = () => {
  const selectedRows = useVisibleRowsPosStore((state) => state.selectedRows);
  const { name, size, type } = selectedRows?.[0] || {};
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        height: "65px",
        padding: "0 40px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontSize: "1.4rem",
      }}
    >
      <div>
        {selectedRows.length > 1 ? (
          <span>{selectedRows.length}个对象</span>
        ) : (
          <span>{name}</span>
        )}
        {selectedRows.length === 1 && type === "file" && (
          <span>&nbsp;&nbsp;({formatBytesUtil(size)})</span>
        )}
      </div>
      <Flex gap={15}>
        {/* 多选 */}
        {selectedRows.length > 1 && <Multiple />}
        {/* 文件夹 */}
        {selectedRows.length === 1 && type === "folder" && <Folder />}
        {/* 文件 */}
        {selectedRows.length === 1 && type === "file" && <File />}
      </Flex>
    </div>
  );
};
const Folder = () => {
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
  const setEditModalVisible = useVisibleRowsPosStore(
    (state) => state.setEditModalVisible
  );
  const setEditModalType = useVisibleRowsPosStore(
    (state) => state.setEditModalType
  );
  const setShareModalVisible = useVisibleRowsPosStore(
    (state) => state.setShareModalVisible
  );

  const onEnterFolder = () => {
    const newPath = encodeURIComponent(path + selectedRecord?.name);
    navigate(`/home?path=${newPath}`);
    setSelectedRows([]);
  };

  const onRename = () => {
    setItemCtxMenuVisible?.(false);
    setEditModalVisible?.(true);
    setEditModalType?.("renameFolder");
  };

  const onShare = () => {
    setItemCtxMenuVisible?.(false);
    setShareModalVisible(true);
  };

  return (
    <>
      <div className="icon">
        <Tooltip title="进入文件夹" arrow={false} color={"#757575"}>
          <EnterOutlined className="outlinedIcon" onClick={onEnterFolder} />
        </Tooltip>
      </div>
      <div className="icon">
        <Tooltip title="分享" arrow={false} color={"#757575"}>
          <ShareAltOutlined className="outlinedIcon" onClick={onShare} />
        </Tooltip>
      </div>
      <div className="icon">
        <Tooltip title="重命名" arrow={false} color={"#757575"}>
          <EditOutlined className="outlinedIcon" onClick={onRename} />
        </Tooltip>
      </div>
      {/* <div className="icon">
        <Tooltip title="打包下载" arrow={false} color={"#757575"}>
          <CloudDownloadOutlined className="outlinedIcon" />
        </Tooltip>
      </div> */}
      <div className="icon">
        <Tooltip title="移动" arrow={false} color={"#757575"}>
          <ExportOutlined className="outlinedIcon" />
        </Tooltip>
      </div>
      <div className="icon">
        <Tooltip title="删除" arrow={false} color={"#757575"}>
          <DeleteOutlined className="outlinedIcon" />
        </Tooltip>
      </div>
    </>
  );
};

const File = () => {
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
  const setEditModalVisible = useVisibleRowsPosStore(
    (state) => state.setEditModalVisible
  );
  const setEditModalType = useVisibleRowsPosStore(
    (state) => state.setEditModalType
  );
  const setShareModalVisible = useVisibleRowsPosStore(
    (state) => state.setShareModalVisible
  );

  const downloadFile = async () => {
    const url = `/api/${selectedRecord?.sourceName}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = selectedRecord?.name as string;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSelectedRows([]);
  };

  const onRename = () => {
    setItemCtxMenuVisible?.(false);
    setEditModalVisible?.(true);
    setEditModalType?.("renameFile");
  };

  const onPreview = () => {
    const sourceName = selectedRecord?.sourceName as string;
    const name = selectedRecord?.name as string;
    navigate(
      `/preview?filePath=${encodeURIComponent(
        sourceName
      )}&filename=${encodeURIComponent(name)}`
    );
    setSelectedRows([]);
  };

  const onShare = () => {
    setItemCtxMenuVisible?.(false);
    setShareModalVisible(true);
  };
  return (
    <>
      <div className="icon">
        <Tooltip title="打开" arrow={false} color={"#757575"}>
          <EnterOutlined className="outlinedIcon" onClick={onPreview} />
        </Tooltip>
      </div>
      <div className="icon">
        <Tooltip title="分享" arrow={false} color={"#757575"}>
          <ShareAltOutlined className="outlinedIcon" onClick={onShare} />
        </Tooltip>
      </div>
      <div className="icon">
        <Tooltip title="重命名" arrow={false} color={"#757575"}>
          <EditOutlined className="outlinedIcon" onClick={onRename} />
        </Tooltip>
      </div>
      <div className="icon">
        <Tooltip title="下载" arrow={false} color={"#757575"}>
          <CloudDownloadOutlined
            className="outlinedIcon"
            onClick={downloadFile}
          />
        </Tooltip>
      </div>
      <div className="icon">
        <Tooltip title="移动" arrow={false} color={"#757575"}>
          <ExportOutlined className="outlinedIcon" />
        </Tooltip>
      </div>
      <div className="icon">
        <Tooltip title="删除" arrow={false} color={"#757575"}>
          <DeleteOutlined className="outlinedIcon" />
        </Tooltip>
      </div>
    </>
  );
};

const Multiple = () => {
  return (
    <>
      <div className="icon">
        <Tooltip title="打包下载" arrow={false} color={"#757575"}>
          <CloudDownloadOutlined className="outlinedIcon" />
        </Tooltip>
      </div>
      <div className="icon">
        <Tooltip title="移动" arrow={false} color={"#757575"}>
          <ExportOutlined className="outlinedIcon" />
        </Tooltip>
      </div>
      <div className="icon">
        <Tooltip title="删除" arrow={false} color={"#757575"}>
          <DeleteOutlined className="outlinedIcon" />
        </Tooltip>
      </div>
    </>
  );
};

export default HeaderMenu;
