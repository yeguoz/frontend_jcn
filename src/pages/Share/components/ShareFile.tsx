import { useNavigate } from "react-router";
import { fetchDownloadFile } from "../../../services/userFileController";
import { Avatar, Button, Card, Divider, Flex } from "antd";
import dateFormatUtil from "../../../utils/dateFormatUtil";
import formatBytesUtil from "../../../utils/formatBytesUtil";
import { FileOutlined, UserOutlined } from "@ant-design/icons";
import useShareStore from "../../../store/useShareStore";

const ShareFile = () => {
  const navigate = useNavigate();
  const data = useShareStore((state) => state.data);
  const shortId = useShareStore((state) => state.shortId);

  const handlePreview = () => {
    // 处理预览逻辑
    navigate(
      `/preview?filePath=${encodeURIComponent(
        data?.sourceName ? data?.sourceName : ""
      )}&filename=${encodeURIComponent(
        data?.filename ? data?.filename : ""
      )}&shortId=${shortId}`
    );
  };

  const handleDownload = async () => {
    await fetchDownloadFile(
      data?.sourceName ? data?.sourceName : "",
      shortId as string
    );
  };

  return (
    <Flex justify="center" style={{ margin: "100px auto 0", height: "250px" }}>
      <Card
        title={
          <Flex vertical={true} gap={10} align="center">
            <Avatar size={"default"} icon={<UserOutlined />} />
            <div>
              <span>
                {data?.userVO?.name ? data.userVO.name : "匿名"} 的分享
              </span>
            </div>
            <Flex gap={10} style={{ fontSize: 12, color: "#757575" }}>
              <span>{data?.visitCount ? data.visitCount : 0} 次浏览</span>
              <span>可下载 {data?.downloadCount} 次</span>
              <span>{dateFormatUtil(data?.createdAt as Date)} </span>
            </Flex>
          </Flex>
        }
        variant="borderless"
        style={{
          width: 400,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 添加阴影效果
        }}
      >
        <Flex gap={30} align="center">
          <Avatar size={"large"} icon={<FileOutlined />} shape="square" />
          <Flex vertical={true}>
            <div>
              <span>{data?.filename}aa</span>
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
