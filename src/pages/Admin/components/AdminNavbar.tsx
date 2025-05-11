import { GetProp, Menu, MenuProps } from "antd";
import useNavStore from "../../../store/useNavStore";
import {
  FileOutlined,
  MailOutlined,
  SettingOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import GroupIcon from "../../../components/icon/GroupIcon";
import UserFileIcon from "../../../components/icon/UserFIleIcon";
import { useNavigate } from "react-router";
import WebsiteIcon from "../../../components/icon/WebsiteIcon";
import AuthIcon from "../../../components/icon/AuthIcon";

type MenuItem = GetProp<MenuProps, "items">[number];

const items: MenuItem[] = [
  {
    key: "setting",
    label: "参数设置",
    icon: <SettingOutlined />,
    children: [
      { key: "site", label: "站点信息", icon: <WebsiteIcon /> },
      { key: "authManager", label: "注册与登录", icon: <AuthIcon /> },
      { key: "mail", label: "邮件", icon: <MailOutlined /> },
    ],
  },
  {
    key: "group",
    label: "用户组",
    icon: <GroupIcon />,
  },
  {
    key: "user",
    label: "用户",
    icon: <UserOutlined />,
  },
  {
    key: "file",
    label: "文件",
    icon: <FileOutlined />,
  },
  {
    key: "userFile",
    label: "用户文件",
    icon: <UserFileIcon />,
  },
  {
    key: "share",
    label: "分享",
    icon: <ShareAltOutlined />,
  },
];

export const AdminNavbar = () => {
  const collapsed = useNavStore((state) => state.collapsed);
  const navigate = useNavigate();
  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "home") {
      navigate("/admin/home");
    }
    if (e.key === "site") {
      navigate("/admin/setting/site");
    }
    if (e.key === "authManager") {
      navigate("/admin/setting/auth");
    }
    if (e.key === "mail") {
      navigate("/admin/setting/mail");
    }
    if (e.key === "group") {
      navigate("/admin/user/group");
    }
    if (e.key === "user") {
      navigate("/admin/user");
    }
    if (e.key === "file") {
      navigate("/admin/file");
    }
    if (e.key === "userFile") {
      navigate("/admin/user/file");
    }
    if (e.key === "share") {
      navigate("/admin/share");
    }
  };

  return (
    <Menu
      style={{ width: collapsed ? "4rem" : "14rem", height: "100%" }}
      defaultOpenKeys={["setting"]}
      mode="inline"
      inlineCollapsed={collapsed}
      items={items}
      onClick={onClick}
    />
  );
};
