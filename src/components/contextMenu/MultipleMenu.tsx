import React from "react";
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import styles from "./index.module.css";
import useVisibleRowsPosStore from "../../store/useVisibleRowsPosStore";
import Item from "./Item";
import ZipIcon from "../icon/ZipIcon";

const MultipleMenu = React.forwardRef<
  HTMLDivElement,
  {
    style?: React.CSSProperties;
  }
>(({ style}, ref) => {
  const multipleMenuPosition = useVisibleRowsPosStore(
    (state) => state.multipleMenuPosition
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
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
        <Item icon={<CloudDownloadOutlined />} title={"打包下载"} />
        <Item icon={<ZipIcon />} title={"压缩"} />
        <Item icon={<ExportOutlined />} title={"移动"} />
        <Item icon={<DeleteOutlined />} title={"删除"} />
      </div>
    </div>
  );
});

export default MultipleMenu;
