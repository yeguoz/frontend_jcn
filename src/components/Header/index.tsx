import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Input,
  Menu,
  MenuProps,
  theme,
} from "antd";
import {
  GithubOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import useAuthStore from "../../store/useAuthStore";
import useNavStore from "../../store/useNavStore";
import DataTransferIcon from "../icon/DataTransferIcon";
import { logout } from "../../services/userController";
import { useEffect, useRef, useState } from "react";
import {
  ADMIN,
  adminItems,
  authItems,
  userItems,
} from "../../constants/common";
import { useWorkerStore } from "../../store/useWorkerStore";
import UploadQueue from "./components/UploadQueue";
import useUploadStore from "../../store/useUploadStore";
import useBreadcrumbStore from "../../store/useBreadcrumbStore";
import { debounce, throttle } from "lodash";
import { searchUserFile } from "../../services/userFileController";
import useDataStore from "../../store/useDataStore";

const { useToken } = theme;
const Header = () => {
  const { token } = useToken();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { isOpen, setIsOpen, collapsed, setCollapsed } = useNavStore(
    (state) => state
  );
  const isAuth = useAuthStore((state) => state.isAuth);
  const setItems = useBreadcrumbStore((state) => state.setItems);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const setIsAuth = useAuthStore((state) => state.setIsAuth);
  const setData = useDataStore((state) => state.setData);
  const [keyword, setKeyword] = useState("");
  const url = import.meta.env.PROD
    ? `${import.meta.env.BASE_URL}/api/users/avatar?filePath=${user?.avatar}`
    : `/api/users/avatar?filePath=${user?.avatar}`;

  const completedCount = useUploadStore((state) =>
    Object.values(state.tasks).reduce(
      (count, task) => (task.completed ? count + 1 : count),
      0
    )
  );
  const tasksCount = useUploadStore((state) => Object.keys(state.tasks).length);
  const uncompletedCount = tasksCount - completedCount;

  const toPage: MenuProps["onClick"] = ({ key }) => {
    if (key === "login") {
      navigate("/login");
    }
    if (key === "register") {
      navigate("/register");
    }
  };

  const handleUserClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "logout") {
      const terminateWorker = await useWorkerStore.getState().terminateWorker;
      terminateWorker();
      const data = await logout();
      if (data.code === 200) {
        setUser(null);
        setIsAuth(false);
        setIsOpen(false);
      }
    } else if (key === "person") {
      navigate("/person");
    } else if (key === "admin") {
      navigate("/admin/setting/site");
    }
  };

  const showNav = () => {
    setIsOpen(!isOpen);
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    if (tasksCount > 0) {
      setOpen(true);
    }
  }, [tasksCount]);

  const searchRef = useRef(
    debounce(
      throttle(async (keyword: string) => {
        const res = await searchUserFile(keyword);
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

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyword = event.currentTarget.value;
    searchRef.current(keyword);
    setKeyword("");
    navigate(`/home`);
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        backgroundColor: token.colorPrimary,
        padding: "0 30px",
        minHeight: 60,
        color: "#fff",
        fontSize: 20,
        userSelect: "none",
      }}
    >
      {/* 左侧 */}
      <Flex gap={20} align="center">
        <div className="icon">
          {isOpen ? (
            <MenuFoldOutlined className="outlinedIcon" onClick={showNav} />
          ) : (
            <MenuUnfoldOutlined className="outlinedIcon" onClick={showNav} />
          )}
        </div>
        <Link
          to="/"
          style={{
            cursor: "pointer",
            color: "#fff",
            textDecoration: "none",
            marginRight: 45,
          }}
          onClick={() => {
            if (isAuth) {
              setItems([{ path: "/", name: "/", search: false }]);
            }
          }}
        >
          CloudNest
        </Link>
        <Input
          placeholder="搜索..."
          prefix={<SearchOutlined />}
          size="large"
          variant="filled"
          onPressEnter={handleSearch}
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
        />
      </Flex>
      {/* 右侧 */}
      <Flex gap={10} align="center">
        <div className="icon">
          <GithubOutlined
            className="outlinedIcon"
            onClick={() => {
              window.open("https://github.com/yeguoz/JCloudNest");
            }}
          />
        </div>
        {isAuth && (
          <div className="icon">
            <Dropdown
              trigger={["click"]}
              arrow
              open={open}
              onOpenChange={setOpen}
              dropdownRender={() => <UploadQueue />}
            >
              <Badge count={uncompletedCount} offset={[-5, 8]} size="small">
                <DataTransferIcon className="outlinedIcon" />
              </Badge>
            </Dropdown>
          </div>
        )}
        {isAuth && (
          <div className="icon">
            <SettingOutlined
              className="outlinedIcon"
              onClick={() => {
                navigate("/setting");
              }}
            />
          </div>
        )}
        <div className="icon">
          {isAuth ? (
            <Dropdown
              trigger={["click"]}
              dropdownRender={() => {
                return (
                  <div
                    style={{
                      boxShadow:
                        "0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
                      borderRadius: "6px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Flex
                      align="center"
                      style={{ paddingLeft: 12, height: 100 }}
                      gap={20}
                    >
                      <Avatar
                        size="large"
                        src={url}
                        icon={<UserOutlined />}
                        shape="square"
                      />
                      <Flex vertical={true}>
                        <span>{user?.name}</span>
                        <span style={{ color: "#858585" }}>{user?.email}</span>
                        <span style={{ color: token.colorPrimary }}>
                          {user?.group.name}
                        </span>
                      </Flex>
                    </Flex>
                    <Menu
                      items={
                        user?.group.name === ADMIN ? adminItems : userItems
                      }
                      onClick={handleUserClick}
                    ></Menu>
                  </div>
                );
              }}
            >
              {user?.avatar ? (
                <Avatar size="large" src={url} />
              ) : (
                <UserOutlined className="outlinedIcon" />
              )}
            </Dropdown>
          ) : (
            <Dropdown
              menu={{ items: authItems, onClick: toPage }}
              trigger={["click"]}
              arrow
            >
              <UserOutlined className="outlinedIcon" />
            </Dropdown>
          )}
        </div>
      </Flex>
    </Flex>
  );
};

export default Header;
