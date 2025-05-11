import useUploadStore from "../../../store/useUploadStore";
import { Avatar, List, Progress, theme } from "antd";
import { getFileType } from "../../../constants/common";
import { formatBytesUtil } from "../../../utils/formatUtil";

const { useToken } = theme;
const UploadTaskItem = ({ uploadId }: { uploadId: string }) => {
  const task = useUploadStore((state) => state.tasks[uploadId]);
  const getUploadedBytes = useUploadStore((state) => state.getUploadedBytes);

  const { token } = useToken();
  let msgColor = "#000";
  if (task.status === "success") {
    msgColor = token.colorSuccess;
  }
  if (task.status === "error") {
    msgColor = token.colorError;
  }
  if (task.status === "handle") {
    msgColor = token.colorPrimary;
  }
  const extension = task?.filename.split(".").pop() || "";
  const fileType = getFileType(extension);

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={`/src/assets/images/${fileType}.svg`} />}
        title={task?.filename}
        description={
          <>
            <Progress
              percent={task.progress}
              strokeColor={token.colorPrimary}
              format={() => ""}
              size="small"
              style={{ width: 480 }}
            />
            <span style={{ fontSize: 12 }}>
              {`${formatBytesUtil(getUploadedBytes(task.uploadId)) || 0} / ${
                formatBytesUtil(task?.filesize) || 0
              }`}
            </span>
            <div style={{ display: "flex", gap: 50 }}>
              {task.status === "uploading" && (
                <span>
                  {task.speed ? formatBytesUtil(task.speed) + "/s" : ""}
                </span>
              )}
              <span style={{ color: msgColor }}>
                {task.message ? task.message : ""}
              </span>
            </div>
          </>
        }
      />
    </List.Item>
  );
};

export default UploadTaskItem;
