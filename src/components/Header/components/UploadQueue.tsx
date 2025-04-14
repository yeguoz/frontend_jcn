import { Button, Flex, List } from "antd";
import UploadTaskItem from "./UploadTaskItem";
import useUploadStore from "../../../store/useUploadStore";
import { useMemo } from "react";
const UploadQueue = () => {
  const tasks = useUploadStore((state) => state.tasks);
  const tasksArray = useMemo(() => Object.values(tasks), [tasks]);
  const getCompletedCount = useUploadStore((state) => state.getCompletedCount);
  const completedCount = getCompletedCount();

  const removeTasksByStatus = useUploadStore(
    (state) => state.removeTasksByStatus
  );

  return (
    <div
      style={{
        width: 700,
        maxHeight: 400,
        padding: "16px 20px 16px",
        backgroundColor: "#fff",
        boxShadow:
          "0 -3px 6px -4px rgba(0, 0, 0, 0.12), 0 -6px 16px 0 rgba(0, 0, 0, 0.08), 0 -9px 28px 8px rgba(0, 0, 0, 0.05), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
        borderRadius: "6px 6px 6px 6px",
        overflow: "auto",
      }}
    >
      <div>
        <Flex justify="space-between">
          <span>
            上传队列 {completedCount}/{tasksArray.length}
          </span>
          <Flex gap={10}>
            <Button type="link" onClick={() => removeTasksByStatus("success")}>
              清空已完成
            </Button>
            <Button type="link" onClick={() => removeTasksByStatus("error")}>
              清空失败
            </Button>
          </Flex>
        </Flex>
      </div>
      <List
        dataSource={tasksArray}
        renderItem={(item) => <UploadTaskItem uploadId={item.uploadId} />}
      />
    </div>
  );
};
export default UploadQueue;
