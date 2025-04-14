import Navbar from "../../components/Navbar";
import { homeItems } from "../../constants/common";
import {
  Avatar,
  Button,
  Flex,
  Form,
  Input,
  message,
  Modal,
  notification,
  Upload,
} from "antd";
import {
  EditOutlined,
  LockOutlined,
  MailOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import IdIcon from "../../components/icon/IdIcon";
import NicknameIcon from "../../components/icon/NicknameIcon";
import UserGroupIcon from "../../components/icon/UserGroupIcon";
import RegisterTimeIcon from "../../components/icon/RegisterTimeIcon";
import useAuthStore from "../../store/useAuthStore";
import { useState } from "react";
import { updatePersonInfo, uploadAvatar } from "../../services/userController";

export const Setting = () => {
  const user = useAuthStore((state) => state.user);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editModalType, setEditModalType] = useState("");

  const onEditNickname = () => {
    setEditModalVisible(true);
    setEditModalType("nickname");
  };

  const onEditPassword = () => {
    setEditModalVisible(true);
    setEditModalType("password");
  };

  const onUploadAvatar = () => {
    setEditModalVisible(true);
    setEditModalType("avatar");
  };

  return (
    <Flex style={{ flex: 1, overflow: "hidden" }}>
      <Navbar menuItems={homeItems} showStorage />
      <Flex vertical={true} align="center" flex={1}>
        <div style={{ width: "70%", borderRadius: "6px" }}>
          {/* 个人资料 */}
          <h5>个人资料</h5>
          <Flex
            vertical={true}
            gap={15}
            style={{
              backgroundColor: "#fff",
              padding: "10px 20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Flex
              justify="space-between"
              align="center"
              style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 10 }}
            >
              <Flex gap={20} align="center">
                <Avatar
                  size={"large"}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "orange", verticalAlign: "middle" }}
                  src={`/api/${user?.avatar}`}
                />
                <div>头像</div>
              </Flex>
              <Flex>
                <div className="icon">
                  <EditOutlined
                    className="outlinedIcon"
                    onClick={onUploadAvatar}
                  />
                </div>
              </Flex>
            </Flex>
            <Flex
              justify="space-between"
              align="center"
              style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 10 }}
            >
              <Flex gap={20} align="center">
                <Avatar
                  size={"large"}
                  icon={<IdIcon />}
                  style={{ backgroundColor: "orange", verticalAlign: "middle" }}
                />
                <div>UID</div>
              </Flex>
              <Flex gap={10}>
                <div>{user?.id}</div>
              </Flex>
            </Flex>
            <Flex
              justify="space-between"
              align="center"
              style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 10 }}
            >
              <Flex gap={20} align="center">
                <Avatar
                  size={"large"}
                  icon={<NicknameIcon />}
                  style={{ backgroundColor: "orange", verticalAlign: "middle" }}
                />
                <div>昵称</div>
              </Flex>
              <Flex gap={10} align="center">
                <div>{user?.name}</div>
                <div className="icon" onClick={onEditNickname}>
                  <EditOutlined className="outlinedIcon" />
                </div>
              </Flex>
            </Flex>
            <Flex
              justify="space-between"
              align="center"
              style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 10 }}
            >
              <Flex gap={20} align="center">
                <Avatar
                  size={"large"}
                  icon={<MailOutlined />}
                  style={{ backgroundColor: "orange", verticalAlign: "middle" }}
                />
                <div>电子邮箱</div>
              </Flex>
              <Flex>
                <div>{user?.email}</div>
              </Flex>
            </Flex>
            <Flex
              justify="space-between"
              align="center"
              style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 10 }}
            >
              <Flex gap={20} align="center">
                <Avatar
                  size={"large"}
                  icon={<UserGroupIcon />}
                  style={{ backgroundColor: "orange", verticalAlign: "middle" }}
                />
                <div>用户组</div>
              </Flex>
              <Flex>
                <div>{user?.group.name}</div>
              </Flex>
            </Flex>
            <Flex justify="space-between" align="center">
              <Flex gap={20} align="center">
                <Avatar
                  size={"large"}
                  icon={<RegisterTimeIcon />}
                  style={{ backgroundColor: "orange", verticalAlign: "middle" }}
                />
                <div>注册时间</div>
              </Flex>
              <Flex>
                <div>{user?.createdAt}</div>
              </Flex>
            </Flex>
          </Flex>
          {/* 安全隐私 */}
          <h5>安全隐私</h5>
          <Flex
            vertical={true}
            gap={15}
            style={{
              backgroundColor: "#fff",
              padding: "10px 20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Flex justify="space-between" align="center">
              <Flex gap={20} align="center">
                <Avatar
                  size={"large"}
                  icon={<LockOutlined />}
                  style={{ backgroundColor: "orange", verticalAlign: "middle" }}
                />
                <div>登录密码</div>
              </Flex>
              <Flex>
                <div className="icon" onClick={onEditPassword}>
                  <EditOutlined className="outlinedIcon" />
                </div>
              </Flex>
            </Flex>
          </Flex>
        </div>
      </Flex>
      <SettingModal
        editModalVisible={editModalVisible}
        editModalType={editModalType}
        setEditModalVisible={setEditModalVisible}
      />
    </Flex>
  );
};

const SettingModal = ({
  editModalVisible,
  editModalType,
  setEditModalVisible,
}: {
  editModalVisible: boolean;
  editModalType: string;
  setEditModalVisible: (visible: boolean) => void;
}) => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const [file, setFile] = useState<File | null>(null);

  let title = "";
  if (editModalType === "nickname") {
    title = "修改昵称";
  } else if (editModalType === "password") {
    title = "修改密码";
  } else if (editModalType === "avatar") {
    title = "上传头像";
  }

  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    setEditModalVisible(false);
    form.resetFields();
  };

  const handleOk = async () => {
    const filelds = form.getFieldsValue(true);
    const { nickname, password } = filelds || {};
    if (editModalType === "nickname" && nickname) {
      try {
        setIsLoading(true);
        const response = await updatePersonInfo({ nickname });
        if (response.code === 200 && response.data) {
          // 刷新数据
          api.success({
            message: "昵称修改成功!",
          });
          setUser(response.data);
        } else if (response.code >= 400) {
          api.warning({
            message: response.message,
          });
        } else if (response.code >= 500) {
          api.error({
            message: response.message,
          });
        }
      } finally {
        setIsLoading(false);
        setEditModalVisible(false);
        form.resetFields();
      }
    } else if (editModalType === "nickname" && !nickname) {
      api.warning({
        message: "请输入昵称!",
      });
    }

    if (editModalType === "password" && password) {
      try {
        setIsLoading(true);
        const response = await updatePersonInfo({ password });
        if (response.code === 200 && response.data) {
          // 刷新数据
          api.success({
            message: "密码修改成功!",
          });
          setUser(response.data);
        } else if (response.code >= 400) {
          api.warning({
            message: response.message,
          });
        } else if (response.code >= 500) {
          api.error({
            message: response.message,
          });
        }
      } finally {
        setIsLoading(false);
        setEditModalVisible(false);
        form.resetFields();
      }
    } else if (editModalType === "password" && !password) {
      api.warning({
        message: "请输入新密码!",
      });
    }

    if (editModalType === "avatar" && file) {
      try {
        setIsLoading(true);
        const response = await uploadAvatar(file);
        if (response.code === 200 && response.data) {
          // 刷新数据
          api.success({
            message: "头像上传成功!",
          });
          setUser(response.data);
          console.log(user);
        } else if (response.code >= 400) {
          api.warning({
            message: response.message,
          });
        } else if (response.code >= 500) {
          api.error({
            message: response.message,
          });
        }
      } finally {
        setIsLoading(false);
        setEditModalVisible(false);
      }
    } else if (editModalType === "avatar" && !file) {
      api.warning({
        message: "请选择文件!",
      });
    }
  };

  const beforeUpload = async (file: File) => {
    const isPNG = file.type === "image/png" || file.type === "image/jpeg";
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      api.warning({
        message: `图片不能超过 5MB!`,
      });
      return;
    }
    if (!isPNG) {
      message.error(`文件不是 PNG 或 JPEG 格式!`);
      return;
    }
    setFile(file);
    return false;
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={title}
        cancelText="取消"
        okText="确定"
        centered
        loading={isLoading}
        open={editModalVisible}
        onCancel={() => handleCancel()}
        width="400px"
        onOk={() => handleOk()}
      >
        <Form layout="vertical" name="editForm" form={form}>
          {editModalType === "nickname" && (
            <Form.Item
              name="nickname"
              label="昵称"
              rules={[{ required: true, message: "请输入昵称!" }]}
            >
              <Input style={{ height: "30px" }} />
            </Form.Item>
          )}
          {editModalType === "password" && (
            <Form.Item
              name="password"
              label="新密码"
              rules={[
                { required: true, message: "请输入密码!" },
                { min: 8, message: "密码长度至少为8位!" },
              ]}
            >
              <Input.Password style={{ height: "30px" }} />
            </Form.Item>
          )}
        </Form>
        {editModalType === "avatar" && (
          <Upload beforeUpload={beforeUpload} maxCount={1}>
            <Button type="primary" icon={<UploadOutlined />}>
              选择文件
            </Button>
          </Upload>
        )}
      </Modal>
    </>
  );
};
