import { Divider, Flex, Menu } from "antd";
import { useNavigate } from "react-router";
import useNavStore from "../../store/useNavStore";
import { HddOutlined, ShareAltOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import StorageProgress from "../StorageProgress";
import useAuthStore from "../../store/useAuthStore";
import { debounce, throttle } from "lodash";
import useBreadcrumbStore from "../../store/useBreadcrumbStore";
import useDataStore from "../../store/useDataStore";
import { useRef } from "react";
import { searchUserFileByType } from "../../services/userFileController";

type MenuItem = Required<MenuProps>["items"][number];

const Navbar = ({
  showStorage,
  style,
  menuItems,
  optionOpen,
}: {
  showStorage?: boolean;
  style?: React.CSSProperties;
  menuItems?: MenuItem[];
  optionOpen?: boolean;
}) => {
  const setItems = useBreadcrumbStore((state) => state.setItems);
  const setData = useDataStore((state) => state.setData);
  const isOpen = useNavStore((state) => state.isOpen);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const childBlockDisplay = isOpen ? "block" : "none";

  const searchRef = useRef(
    debounce(
      throttle(async (type: string) => {
        const res = await searchUserFileByType(type);
        setData(res.data.list);
        setItems([
          { path: "/", name: "/", search: false },
          {
            path: `搜索结果`,
            name: `搜索结果`,
            search: true,
          },
        ]);
      }, 1000),
      500
    )
  );
  const onClick: MenuProps["onClick"] = async (e) => {
    if (e.key === "login" || e.key === "register") {
      navigate(e.key);
      return;
    }
    if (e.key === "video") {
      navigate(`/home`);
      searchRef.current("video");
      return;
    }
    if (e.key === "image") {
      navigate(`/home`);
      searchRef.current("image");
      return;
    }
    if (e.key === "audio") {
      navigate(`/home`);
      searchRef.current("audio");
      return;
    }
    if (e.key === "document") {
      navigate(`/home`);
      searchRef.current("document");
      return;
    }
    if (e.key === "archive") {
      navigate(`/home`);
      searchRef.current("archive");
      return;
    }
    if (e.key === "executable") {
      navigate(`/home`);
      searchRef.current("executable");
      return;
    }
    if (e.key === "other") {
      navigate(`/home`);
      searchRef.current("other");
      return;
    }
  };

  return (
    <Flex
      vertical={true}
      justify="space-between"
      style={{
        width: isOpen ? "14rem" : 0,
        backgroundColor: "#fff",
        userSelect: "none",
        borderRight: "1px solid rgb(235, 225, 225)",
        transition: "width 0.2s ease-in-out",
        overflowX: "hidden",
        overflowY: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          display: childBlockDisplay,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
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
        {optionOpen && isOpen && (
          <>
            <Divider style={{ borderColor: "#E0E0E0" }} />
            <div
              style={{
                paddingLeft: 28,
                paddingRight: 22,
                paddingBottom: 24,
                fontSize: 16,
                height: 45,
                margin: "0 4px",
                borderRadius: "8px",
                overflow: "hidden",
                lineHeight: "45px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F0F0F0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              onClick={() => {
                navigate("/my/share");
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: 200,
                  overflow: "hidden",
                }}
              >
                <span style={{ marginRight: 15 }}>
                  <ShareAltOutlined style={{ fontSize: 16 }} />
                </span>
                <span>我的分享</span>
              </div>
            </div>
          </>
        )}
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
              usedStorage={user?.usedStorage || 0}
              totalStorage={user?.group.maxStorage || 0}
            />
          </div>
        </>
      )}
    </Flex>
  );
};
export default Navbar;
