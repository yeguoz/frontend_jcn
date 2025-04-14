import React from "react";
import {
  CloudDownloadOutlined,
} from "@ant-design/icons";
import styles from "./index.module.css";
import useShareStore from "../../../store/useShareStore";
import Item from "../../../components/contextMenu/Item";

const MultipleMenu = React.forwardRef<
  HTMLDivElement,
  {
    style?: React.CSSProperties;
  }
>(({ style}, ref) => {
  const multipleMenuPosition = useShareStore(
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
      </div>
    </div>
  );
});

export default MultipleMenu;
