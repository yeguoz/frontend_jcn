import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import NotFound from "./pages/404";
import Forget from "./pages/Auth/ForgetPwd";
import { useEffect, useState } from "react";
import { getAuthSetting } from "./services/settingController";
import useSettingStore from "./store/useSettingStore";
import { Register } from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Header from "./components/Header";
import Auth from "./pages/Auth";
import AuthGuard from "./components/AuthGuard";
import { Home } from "./pages/Home";
import { getCurrentUser } from "./services/userController";
import useAuthStore from "./store/useAuthStore";
import { ConfigProvider, Flex, Skeleton, ThemeConfig } from "antd";
import { lightTheme } from "../config/themeConfig";
import { Admin } from "./pages/Admin";
import useNavStore from "./store/useNavStore";
import { Share } from "./pages/Share";
import { Setting } from "./pages/Setting";
import { Preview } from "./pages/Preview";
import { useWorkerStore } from "./store/useWorkerStore";
import { UserGroup } from "./pages/Admin/UserGroup";
import { User } from "./pages/Admin/User";
import { File } from "./pages/Admin/File";
import { UserFile } from "./pages/Admin/UserFile";
import { FileShare } from "./pages/Admin/FileShare";
import { EditUser } from "./pages/Admin/User/EditUser";
import { EditUserGroup } from "./pages/Admin/UserGroup/EiditUserGroup";
import { AddUserGroup } from "./pages/Admin/UserGroup/AddUserGroup";
import { Verify } from "./pages/Auth/Verify";
import ResetPwd from "./pages/Auth/ResetPwd";
import { Mail } from "./pages/Admin/Setting/Mail";
import { Site } from "./pages/Admin/Setting/Site";
import { AuthManager } from "./pages/Admin/Setting/AuthManager";
import { MyShare } from "./pages/MyShare";
const App = () => {
  const setAuthSettings = useSettingStore((state) => state.setAuthSettings);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuth = useAuthStore((state) => state.setIsAuth);
  const setIsOpen = useNavStore((state) => state.setIsOpen);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme] = useState<ThemeConfig>(lightTheme);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authResult = await getAuthSetting();
        const map = new Map();
        authResult.data.forEach((item: API.SettingVO) => {
          map.set(item.name, item.value);
        });
        setAuthSettings(map);

        const userResult: API.Response = await getCurrentUser();
        setUser(userResult.data);
        if (userResult.data) {
          setIsAuth(true);
          setIsOpen(true);
        } else {
          const terminateWorker = await useWorkerStore.getState()
            .terminateWorker;
          terminateWorker();
        }
      } catch (error) {
        console.error("App.tsx:Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setIsAuth, setAuthSettings, setUser, setIsOpen]);

  if (isLoading) {
    return <Skeleton active />;
  }

  return (
    <>
      <div
        style={{
          height: "100vh",
          backgroundColor: lightTheme.token.colorBgBase,
        }}
      >
        <Flex vertical={true}>
          <ConfigProvider theme={currentTheme}>
            {/* Header 部分 */}
            <Header />
            <Flex style={{ height: "calc(100vh - 60px)" }}>
              {/* 主体部分 */}
              <Routes>
                <Route
                  element={
                    <AuthGuard>
                      <Auth />
                    </AuthGuard>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forget" element={<Forget />} />
                  <Route path="/reset" element={<ResetPwd />} />
                  <Route path="/verify/:type" element={<Verify />} />
                </Route>
                <Route
                  path="/home"
                  element={
                    <AuthGuard>
                      <Home />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/setting"
                  element={
                    <AuthGuard>
                      <Setting />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/my/share"
                  element={
                    <AuthGuard>
                      <MyShare />
                    </AuthGuard>
                  }
                />
                <Route
                  element={
                    <AuthGuard>
                      <Admin />
                    </AuthGuard>
                  }
                >
                  <Route path="/admin/setting/site" element={<Site />} index />
                  <Route path="/admin/setting/auth" element={<AuthManager />} />
                  <Route path="/admin/setting/mail" element={<Mail />} />
                  <Route path="/admin/user/group" element={<UserGroup />} />
                  <Route
                    path="/admin/user/group/add"
                    element={<AddUserGroup />}
                  />
                  <Route
                    path="/admin/user/group/edit"
                    element={<EditUserGroup />}
                  />
                  <Route path="/admin/user" element={<User />} />
                  <Route path="/admin/user/edit" element={<EditUser />} />
                  <Route path="/admin/file" element={<File />} />
                  <Route path="/admin/user/file" element={<UserFile />} />
                  <Route path="/admin/share" element={<FileShare />} />
                </Route>
                <Route path="/preview" element={<Preview />} />
                <Route path="/s/:shortId" element={<Share />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Flex>
          </ConfigProvider>
        </Flex>
      </div>
    </>
  );
};

export default App;
