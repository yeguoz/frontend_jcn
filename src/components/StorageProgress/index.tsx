import React from "react";
import { Progress, theme } from "antd";
import formatStorageUtil from "../../utils/formatStorageUtil";

interface StorageProgressProps {
  usedStorage: number; // 已使用的存储量
  totalStorage: number; // 总存储量
}

const { useToken } = theme;
const StorageProgress: React.FC<StorageProgressProps> = ({
  usedStorage,
  totalStorage,
}) => {
  const { token } = useToken();
  const percent = (usedStorage / totalStorage) * 100;
  const strokeColor = percent >= 80 ? token.colorError : token.colorPrimary;

  return (
    <div
      style={{
        width: "12.5rem",
      }}
    >
      <Progress
        percent={percent}
        status={percent >= 80 ? "exception" : "normal"}
        showInfo={false}
        strokeColor={strokeColor}
      />
      <div style={{ marginTop: "0.5rem", fontSize: "0.75rem" }}>
        {formatStorageUtil(usedStorage)} / {formatStorageUtil(totalStorage)}
      </div>
    </div>
  );
};

export default StorageProgress;
