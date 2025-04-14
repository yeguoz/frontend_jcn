import { GetProp, Menu, MenuProps } from "antd";
import useNavStore from "../../../store/useNavStore";
import {
  AppstoreOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";

type MenuItem = GetProp<MenuProps, "items">[number];

const items: MenuItem[] = [
  { key: "1", icon: <HomeOutlined />, label: "首页" },
  {
    key: "sub1",
    label: "Navigation One",
    icon: <SettingOutlined />,
    children: [
      { key: "5", label: "Option 5" },
      { key: "6", label: "Option 6" },
      { key: "7", label: "Option 7" },
      { key: "8", label: "Option 8" },
    ],
  },
  {
    key: "sub2",
    label: "Navigation Two",
    icon: <AppstoreOutlined />,
    children: [
      { key: "9", label: "Option 9" },
      { key: "10", label: "Option 10" },
      {
        key: "sub3",
        label: "Submenu",
        children: [
          { key: "11", label: "Option 11" },
          { key: "12", label: "Option 12" },
        ],
      },
    ],
  },
];

export const AdminNavbar = () => {
  const collapsed = useNavStore((state) => state.collapsed);

  return (
    <Menu
      style={{ width: collapsed ? "4rem" : "14rem", height: "100%" }}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      inlineCollapsed={collapsed}
      items={items}
    />
  );
};
