import React from "react";
import { Progress, theme } from "antd";
import formatBytesUtil from "../../utils/formatBytesUtil";

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
        width: 180,
      }}
    >
      <Progress
        percent={percent}
        status={percent >= 80 ? "exception" : "normal"}
        showInfo={false}
        strokeColor={strokeColor}
        size={"small"}
      />
      <div style={{ marginTop: 8, fontSize: 12 }}>
        {formatBytesUtil(usedStorage)} / {formatBytesUtil(totalStorage)}
      </div>
    </div>
  );
};

export default StorageProgress;
