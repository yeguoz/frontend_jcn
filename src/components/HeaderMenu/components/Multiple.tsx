import { Tooltip } from "antd";
import { ExportOutlined, DeleteOutlined } from "@ant-design/icons";
import useVisibleRowsPosStore from "../../../store/useVisibleRowsPosStore";

const Multiple = () => {
  const setTreeModalVisible = useVisibleRowsPosStore(
    (state) => state.setTreeModalVisible
  );
  const setTreeModalType = useVisibleRowsPosStore(
    (state) => state.setTreeModalType
  );
  const setEditModalVisible = useVisibleRowsPosStore(
    (state) => state.setEditModalVisible
  );
  const setEditModalType = useVisibleRowsPosStore(
    (state) => state.setEditModalType
  );
  const setMultipleMenuVisible = useVisibleRowsPosStore(
    (state) => state.setMultipleMenuVisible
  );

  const onMove = () => {
    setMultipleMenuVisible(false);
    setTreeModalVisible(true);
    setTreeModalType("move");
  };

  const onDelete = () => {
    setMultipleMenuVisible(false);
    setEditModalVisible(true);
    setEditModalType("delete");
  };
  
  return (
    <>
      <div className="icon">
        <Tooltip title="移动" arrow={false} color={"#757575"}>
          <ExportOutlined className="outlinedIcon" onClick={onMove}/>
        </Tooltip>
      </div>
      <div className="icon">
        <Tooltip title="删除" arrow={false} color={"#757575"}>
          <DeleteOutlined className="outlinedIcon" onClick={onDelete}/>
        </Tooltip>
      </div>
    </>
  );
};

export default Multiple;
