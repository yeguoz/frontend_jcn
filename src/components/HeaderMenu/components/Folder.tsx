import { Tooltip } from "antd";
import useFetchUserFiles from "../../../hooks/useFetchUserFiles";
import { useNavigate } from "react-router";
import useVisibleRowsPosStore from "../../../store/useVisibleRowsPosStore";
import {
  EnterOutlined,
  ShareAltOutlined,
  EditOutlined,
  ExportOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

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
  const setTreeModalVisible = useVisibleRowsPosStore(
    (state) => state.setTreeModalVisible
  );
  const setTreeModalType = useVisibleRowsPosStore(
    (state) => state.setTreeModalType
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

  const onMove = () => {
    setItemCtxMenuVisible?.(false);
    setTreeModalVisible?.(true);
    setTreeModalType?.("move");
  };

  const onDelete = () => {
    setItemCtxMenuVisible?.(false);
    setEditModalVisible?.(true);
    setEditModalType?.("delete");
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

export default Folder;
