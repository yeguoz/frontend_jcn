import { Divider, Flex, Menu } from "antd";
import { useNavigate } from "react-router";
import useNavStore from "../../store/useNavStore";
import { HddOutlined } from "@ant-design/icons";
import type { GetProp, MenuProps } from "antd";
import StorageProgress from "../StorageProgress";
type MenuItem = GetProp<MenuProps, "items">[number];

const Navbar = ({
  showStorage,
  menuItems,
  style
}: {
  showStorage?: boolean;
  menuItems?: MenuItem[];
  style?: React.CSSProperties;
}) => {
  const isOpen = useNavStore((state) => state.isOpen);
  const navigate = useNavigate();
  const childBlockDisplay = isOpen ? "block" : "none";

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "login" || e.key === "register") {
      navigate(e.key);
      return;
    }
  };

  return (
    <Flex 
      vertical={true} 
      justify="space-between" 
      style={{
        width: isOpen ? '14rem' : 0,
        backgroundColor: "#fff",
        userSelect: "none",
        borderRight: "1px solid rgb(235, 225, 225)",
        transition: "width 0.2s ease-in-out",
        overflowX: "hidden",
        overflowY: "auto",
        ...style,  
      }}
    >
    <div style={{ display: childBlockDisplay }}>
        <Menu
          mode="inline"
          selectable={false}
          style={{
            borderRight: "none",
          }}
          items={menuItems}
          defaultOpenKeys={["home"]}
          onClick={onClick}
        />
      </div>

      {showStorage && isOpen && (
        <>
          <div
            style={{
              paddingLeft: 28,
              paddingRight: 22,
              paddingBottom: 24,
              fontSize: 16,
              height: 125,
            }}
          >
            <Divider style={{ borderColor: "#E0E0E0" }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: 200,
                overflow: "hidden",
              }}
            >
              <span style={{ marginRight: 15 }}>
                <HddOutlined style={{ fontSize: 16 }} />
              </span>
              <span>存储空间</span>
            </div>
            <StorageProgress
              usedStorage={782600000}
              totalStorage={1073741824}
            />
          </div>
        </>
      )}
    </Flex>
  );
};
export default Navbar;
