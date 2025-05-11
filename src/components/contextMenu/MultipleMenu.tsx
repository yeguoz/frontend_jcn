import React from "react";
import { DeleteOutlined, ExportOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import useVisibleRowsPosStore from "../../store/useVisibleRowsPosStore";
import Item from "./Item";

const MultipleMenu = React.forwardRef<
  HTMLDivElement,
  {
    style?: React.CSSProperties;
  }
>(({ style }, ref) => {
  const multipleMenuPosition = useVisibleRowsPosStore(
    (state) => state.multipleMenuPosition
  );
  const setMultipleMenuVisible = useVisibleRowsPosStore(
    (state) => state.setMultipleMenuVisible
  );
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

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const onMove = () => {
    setMultipleMenuVisible?.(false);
    setTreeModalVisible(true);
    setTreeModalType("move");
  };

  const onCopy = () => {
    setMultipleMenuVisible?.(false);
    setTreeModalVisible(true);
    setTreeModalType("copy");
  };

  const onDelete = () => {
    setMultipleMenuVisible?.(false);
    setEditModalVisible(true);
    setEditModalType("delete");
  };

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: multipleMenuPosition.x,
        top: multipleMenuPosition.y,
        zIndex: 1000,
        ...style,
      }}
      onMouseMove={handleMouseMove}
    >
      <div className={styles.container}>
        <Item icon={<ExportOutlined />} title={"移动"} onClick={onMove} />
        <Item icon={<ExportOutlined />} title={"复制"} onClick={onCopy} />
        <Item icon={<DeleteOutlined />} title={"删除"} onClick={onDelete} />
      </div>
    </div>
  );
});

export default MultipleMenu;
