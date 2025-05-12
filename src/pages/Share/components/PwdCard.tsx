import { Avatar, Button, Card, Flex, Input } from "antd";
import { fetchSharedFile } from "../../../services/shareController";
import { useNavigate } from "react-router";
import { useState } from "react";
import { NotificationInstance } from "antd/es/notification/interface";
import dateFormatUtil from "../../../utils/dateFormatUtil";
import { UserOutlined } from "@ant-design/icons";
import useShareStore from "../../../store/useShareStore";
import useFetchSharedUserFiles from "../../../hooks/useFetchSharedUserFiles";

const PwdCard = ({ api }: { api: NotificationInstance }) => {
  const navigate = useNavigate();
  const { path } = useFetchSharedUserFiles();
  const [password, setPassword] = useState("");
  const shortId = useShareStore((state) => state.shortId);
  const setData = useShareStore((state) => state.setData);
  const setPwdVisible = useShareStore((state) => state.setPwdVisible);
  const setFolderVisible = useShareStore((state) => state.setFolderVisible);
  const setFileVisible = useShareStore((state) => state.setFileVisible);
  const infoData = useShareStore((state) => state.infoData);
  const url = `/api/users/avatar?filePath=${infoData?.userVO?.avatar}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleOk = async () => {
    if (password === "") {
      api.warning({ message: "请输入密码!" });
      return;
    }

    // 请求接口
    const response = await fetchSharedFile(shortId || "", password, path);
    const data: API.ShareVO = response.data;
    if (data) {
      setData(data);
      setPwdVisible(false);

      if (data.isDir) {
        setFolderVisible(true);
      } else {
        setFileVisible(true);
      }
    } else if (response.code >= 400) {
      api.warning({ message: response.message });
      return;
    } else if (response.code >= 500) {
      api.error({ message: response.message });
      return;
    }

    if (infoData?.isDir) {
      navigate(`/s/${shortId}?pwd=${password}&path=${infoData.sourceName}`, {
        replace: true,
      });
    } else {
      navigate(`/s/${shortId}?pwd=${password}`, { replace: true });
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{ margin: "100px auto 0", height: "250px" }}
    >
      <Card
        title={
          <Flex gap={10} align="center">
            <Avatar size={"default"} icon={<UserOutlined />} src={url} />
            <Flex vertical={true}>
              <span>{infoData?.userVO.name} 的加密分享</span>
              <span style={{ fontSize: 12, color: "#757575" }}>
                {dateFormatUtil(infoData?.createdAt || "")}
              </span>
            </Flex>
          </Flex>
        }
        variant="borderless"
        style={{
          width: 400,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 添加阴影效果
        }}
      >
        <Input.Password
          placeholder="输入分享密码"
          size="large"
          variant="underlined"
          style={{ margin: "20px 0 20px" }}
          onChange={handleInputChange}
        />
        <Button type="primary" onClick={handleOk}>
          确认
        </Button>
      </Card>
    </Flex>
  );
};
export default PwdCard;
