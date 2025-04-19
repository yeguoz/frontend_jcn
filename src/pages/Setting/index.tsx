import Navbar from "../../components/Navbar";
import { homeItems } from "../../constants/common";
import { Avatar, Flex } from "antd";
import {
  EditOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import IdIcon from "../../components/icon/IdIcon";
import NicknameIcon from "../../components/icon/NicknameIcon";
import UserGroupIcon from "../../components/icon/UserGroupIcon";
import RegisterTimeIcon from "../../components/icon/RegisterTimeIcon";
import useAuthStore from "../../store/useAuthStore";
import { useState } from "react";
import SettingModal from "./component/SettingModal";

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
