import { useNavigate } from "react-router";
import { Avatar, Button, Card, Divider, Flex, notification } from "antd";
import dateFormatUtil from "../../../utils/dateFormatUtil";
import { UserOutlined } from "@ant-design/icons";
import useShareStore from "../../../store/useShareStore";
import { formatBytesUtil } from "../../../utils/formatUtil";
import { useEffect, useState } from "react";
import { getFileType } from "../../../constants/common";
import { fetchSharedDownloadFile } from "../../../services/shareController";

const ShareFile = () => {
  const navigate = useNavigate();
  const data = useShareStore((state) => state.data);
  const shortId = useShareStore((state) => state.shortId);
  const [fileType, setFileType] = useState<string | undefined>(undefined);
  const [api, contextHolder] = notification.useNotification();
  const url = `/api/users/avatar?filePath=${data?.userVO?.avatar}`;

  const handlePreview = () => {
    if (!data?.previewEnabled) {
      api.warning({ message: "预览禁用" });
      return;
    }
    // 处理预览逻辑
    navigate(
      `/preview?filename=${encodeURIComponent(
        data?.filename ? data?.filename : ""
      )}`,
      {
        state: {
          filePath: `${encodeURIComponent(
            data?.sourceName ? data?.sourceName : ""
          )}`,
          shortId: shortId,
          isShare: true,
        },
      }
    );
  };

  const handleDownload = () => {
    fetchSharedDownloadFile(
      data?.sourceName ? data?.sourceName : "",
      shortId as string
    );
  };

  useEffect(() => {
    const extension = data?.filename.split(".").pop() || "";
    const fileType = getFileType(extension);
    console.log("fileType", fileType);
    setFileType(fileType);
  }, [data?.filename]);

  return (
    <Flex justify="center" style={{ margin: "100px auto 0", height: "250px" }}>
      {contextHolder}
      <Card
        title={
          <Flex vertical={true} gap={10} align="center">
            <Avatar size={"default"} icon={<UserOutlined />} src={url} />
            <div>
              <span>
                {data?.userVO?.name ? data.userVO.name : "匿名"} 的分享
              </span>
            </div>
            <Flex gap={10} style={{ fontSize: 12, color: "#757575" }}>
              <span>{data?.visitCount ? data.visitCount : 0} 次浏览</span>
              <span>可下载 {data?.remainingDownloads} 次</span>
              <span>{dateFormatUtil(data?.createdAt as Date)} </span>
            </Flex>
          </Flex>
        }
        variant="borderless"
        style={{
          width: 400,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Flex gap={10} align="center">
          {fileType ? (
            <img
              src={`/assets/images/${fileType}.svg`}
              alt=""
              width={40}
            />
          ) : (
            <img src={`/assets/images/file.svg`} alt="" width={40} />
          )}
          <Flex vertical={true}>
            <div>
              <span>{data?.filename}</span>
            </div>
            <div>
              <span>{data?.size ? formatBytesUtil(data.size) : 0}</span>
            </div>
          </Flex>
        </Flex>
        <Divider />
        <Flex justify="space-between">
          <Button type="primary" onClick={handlePreview}>
            预览
          </Button>
          <Button type="primary" onClick={handleDownload}>
            下载
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};
export default ShareFile;
