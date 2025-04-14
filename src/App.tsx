import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import NotFound from "./pages/404";
import Forget from "./pages/Auth/Forget";
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
import { AdminHome } from "./pages/Admin/AdminHome";
import { Setting } from "./pages/Setting";
import { Preview } from "./pages/Preview";
import { Basic } from "./pages/Admin/Basic";
import { useWorkerStore } from "./store/useWorkerStore";

const App = () => {
  const setSettings = useSettingStore((state) => state.setSettings);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuth = useAuthStore((state) => state.setIsAuth);
  const setIsOpen = useNavStore((state) => state.setIsOpen);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme] = useState<ThemeConfig>(lightTheme);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authResult = await getAuthSetting();
        setSettings(authResult);
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
  }, [setIsAuth, setSettings, setUser, setIsOpen]);

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
                  element={
                    <AuthGuard>
                      <Admin />
                    </AuthGuard>
                  }
                >
                  <Route path="/admin" element={<AdminHome />} />
                  <Route path="/admin/home" element={<AdminHome />} />
                  <Route path="/admin/basic" element={<Basic />} />
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
