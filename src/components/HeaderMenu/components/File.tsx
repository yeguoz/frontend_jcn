import { Tooltip } from "antd";
import useVisibleRowsPosStore from "../../../store/useVisibleRowsPosStore";
import { useNavigate } from "react-router";
import { EnterOutlined, ShareAltOutlined, EditOutlined, ExportOutlined, DeleteOutlined, CloudDownloadOutlined } from "@ant-design/icons";

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
  const setTreeModalVisible = useVisibleRowsPosStore(
    (state) => state.setTreeModalVisible
  );
  const setTreeModalType = useVisibleRowsPosStore(
    (state) => state.setTreeModalType
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

  const onMove = () => {
    setItemCtxMenuVisible?.(false);
    setTreeModalVisible?.(true);
    setTreeModalType?.("move");
  };

  const onDelete = () => {
    setItemCtxMenuVisible?.(false);
    setEditModalVisible?.(true);
    setEditModalType?.("delete");
  }
  
  
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
          <ExportOutlined className="outlinedIcon" onClick={onMove} />
        </Tooltip>
      </div>
      <div className="icon">
        <Tooltip title="删除" arrow={false} color={"#757575"}>
          <DeleteOutlined className="outlinedIcon" onClick={onDelete} />
        </Tooltip>
      </div>
    </>
  );
};

export default File;
