import {
  Checkbox,
  Flex,
  Input,
  InputNumber,
  Modal,
  notification,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import useVisibleRowsPosStore from "../../store/useVisibleRowsPosStore";
import {
  BulbOutlined,
  EyeOutlined,
  FieldTimeOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { createShortLink } from "../../services/shareController";

export const ShareModal = () => {
  const [api, contextHolder] = notification.useNotification();
  const shareModalVisible = useVisibleRowsPosStore(
    (state) => state.shareModalVisible
  );
  const setShareModalVisible = useVisibleRowsPosStore(
    (state) => state.setShareModalVisible
  );
  const setItemCtxMenuVisible = useVisibleRowsPosStore(
    (state) => state.setItemCtxMenuVisible
  );
  const selectedRecord = useVisibleRowsPosStore(
    (state) => state.selectedRecord
  );
  const [isLoading, setIsLoading] = useState(false);
  const [pwdInputVisible, setPwdInputVisible] = useState(false);
  const [expireVisible, setExpireVisible] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);

  const [pwdValue, setPwdValue] = useState("");
  const [downloadValue, setDownloadValue] = useState(1);
  const [timeValue, setTimeValue] = useState(60);

  const [pwdEnabled, setPwdEnabled] = useState(false);
  const [expireTimeEnabled, setExpireTimeEnabled] = useState(false);
  const [previewEnabled, setPreviewEnabled] = useState(false);
  const [resultValue, setResultValue] = useState("");

  const handlePwdChange = () => {
    console.log("onChange");
    setPwdInputVisible(!pwdInputVisible);
    setPwdEnabled(!pwdEnabled);
  };
  const handleExpireChange = () => {
    setExpireVisible(!expireVisible);
    setExpireTimeEnabled(!expireTimeEnabled);
  };
  const handlePreviewChange = () => {
    setPreviewEnabled(!previewEnabled);
  };
  const generatePwd = () => {
    const randomPwd = Math.random().toString(36).slice(-6);
    setPwdValue(randomPwd);
  };

  const handleCancel = () => {
    setItemCtxMenuVisible(false);
    setShareModalVisible(false);
  };

  const handleOk = async () => {
    console.log("密码启用：", pwdEnabled);
    console.log("密码：", pwdValue);
    console.log("过期启用：", expireTimeEnabled);
    console.log("过期下载：", downloadValue);
    console.log("过期时间：", timeValue);
    console.log("预览启用：", previewEnabled);
    console.log("selectedRecord:", selectedRecord);
    const userId = selectedRecord?.userId as number;
    const sourceId = selectedRecord?.fileId
      ? selectedRecord?.fileId
      : (selectedRecord?.folderId as number);
    const isDir = selectedRecord?.type === "folder" ? 1 : 0;

    const expireTime = expireTimeEnabled
      ? new Date(new Date().getTime() + timeValue * 1000)
      : null;
    const password = pwdEnabled ? pwdValue : null;

    if (pwdEnabled && pwdValue === "") {
      api.warning({
        message: "密码不能为空！",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await createShortLink({
        userId,
        sourceId,
        userFileId: selectedRecord?.userFileId as number,
        passwordEnabled:pwdEnabled,
        password,
        isDir,
        downloadCount: downloadValue,
        previewEnabled,
        expireTimeEnabled,
        expireTime,
      });
      console.log("response:", response);
      if (response.code == 200 && response.data) {
        setResultValue(response.data);
        setResultVisible(true);
      } else if (response.code >= 400 && !response.data) {
        api.warning({
          message: response.message,
        });
      } else if (response.code >= 500 && !response.data) {
        api.error({
          message: response.message,
        });
      }
    } finally {
      setIsLoading(false);
      setShareModalVisible(false);

      setPwdValue("");
      setPwdEnabled(false);
      setPwdInputVisible(false);

      setDownloadValue(1);
      setTimeValue(60);
      setExpireTimeEnabled(false);
      setExpireVisible(false);

      setPreviewEnabled(false);
    }
  };
  return (
    <>
      {contextHolder}
      <Modal
        title={"创建分享链接"}
        cancelText="取消"
        okText="确定"
        centered
        loading={isLoading}
        open={shareModalVisible}
        onCancel={() => handleCancel()}
        width="350px"
        onOk={() => handleOk()}
      >
        <Flex vertical={true} style={{ margin: "20px 0 20px" }} gap={20}>
          <Flex vertical={true}>
            <Checkbox onChange={handlePwdChange} style={{ fontSize: 16 }}>
              <LockOutlined style={{ marginLeft: 10 }} />
              <span style={{ marginLeft: 10 }}>使用密码</span>
            </Checkbox>
            <Input
              size="large"
              value={pwdValue}
              style={{ display: pwdInputVisible ? "" : "none" }}
              placeholder="请输入密码"
              variant="underlined"
              suffix={
                <Tooltip title={"随机密码"}>
                  <BulbOutlined
                    style={{ cursor: "pointer" }}
                    onClick={generatePwd}
                  />
                </Tooltip>
              }
              onChange={(e) => setPwdValue(e.target.value)}
            />
          </Flex>
          <Flex vertical={true}>
            <Checkbox onChange={handleExpireChange} style={{ fontSize: 16 }}>
              <FieldTimeOutlined style={{ marginLeft: 10 }} />
              <span style={{ marginLeft: 10 }}>自动过期</span>
            </Checkbox>
            <Flex
              style={{
                display: expireVisible ? "" : "none",
                height: 35,
                width: "100%",
              }}
            >
              <InputNumber
                min={1}
                defaultValue={1}
                addonAfter={<>次下载</>}
                onChange={(value) => setDownloadValue(value as number)}
                size="large"
                variant="underlined"
                changeOnWheel
              />
              <Flex align="center">或</Flex>
              <InputNumber
                min={1}
                defaultValue={60}
                addonAfter={<>秒</>}
                onChange={(value) => setTimeValue(value as number)}
                size="large"
                variant="underlined"
                changeOnWheel
              />
              <Flex align="center">后</Flex>
            </Flex>
          </Flex>
          <Flex vertical={true}>
            <Checkbox onChange={handlePreviewChange} style={{ fontSize: 16 }}>
              <EyeOutlined style={{ marginLeft: 10 }} />
              <span style={{ marginLeft: 10 }}>允许预览</span>
            </Checkbox>
          </Flex>
        </Flex>
      </Modal>
      <Result
        value={resultValue}
        setValue={setResultValue}
        resultVisible={resultVisible}
        setResultVisible={setResultVisible}
      />
    </>
  );
};

const Result = ({
  value,
  setValue,
  resultVisible,
  setResultVisible,
}: {
  value: string;
  setValue: (value: string) => void;
  resultVisible: boolean;
  setResultVisible: (value: boolean) => void;
}) => {
  const [link, setLink] = useState("");
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const port = window.location.port;
    setLink(`${protocol}//${host}:${port}/s/${value}`);
  }, [value]);

  const handleCancel = () => {
    setResultVisible(false);
    setValue("");
  };
  const handleOk = async () => {
    try {
      (async () => await navigator.clipboard.writeText(link))(); // 将 value 复制到剪切板
      api.success({
        message: "复制成功",
      });
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={"创建分享链接"}
        cancelText="取消"
        okText="复制链接"
        centered
        open={resultVisible}
        onCancel={handleCancel}
        width="350px"
        onOk={handleOk}
      >
        <Flex vertical={true} style={{ margin: "10px 0 20px" }}>
          <div style={{ fontSize: 16 }}>分享链接：</div>
          <Input size="large" value={link} />
        </Flex>
      </Modal>
    </>
  );
};
