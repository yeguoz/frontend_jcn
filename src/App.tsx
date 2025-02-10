import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import { NotFound } from "./pages/404";
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
import { ConfigProvider, Spin } from "antd";
import themeConfig from "../config/themeConfig";
import useThemeStore from "./store/useThemeStore";

const App = () => {
  const setSettings = useSettingStore((state) => state.setSettings);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuth = useAuthStore((state) => state.setIsAuth);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(themeConfig);
  const isDark = useThemeStore((state) => state.isDark);

  const changeTheme = (isDark: boolean) => {
    const newTheme = {
      ...currentTheme,
      token: {
        ...currentTheme.token,
        colorPrimary: isDark ? "#212121" : themeConfig.token.colorPrimary,
        colorLink: isDark ? "#212121" : themeConfig.token.colorPrimary,
        colorBgBase: isDark ? "#424242" : "#fafafa",
      },
    };
    setCurrentTheme(newTheme);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authResult = await getAuthSetting();
        setSettings(authResult);

        const userResult: API.Response = await getCurrentUser();
        setUser(userResult.data);
        if (userResult.data) {
          setIsAuth(true);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    changeTheme(isDark);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: isDark ? "#303030" : "#fafafa",
      }}
    >
      <ConfigProvider theme={currentTheme}>
        <Header changeTheme={changeTheme} />
        <Routes>
          <Route element={<Auth />}>
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
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ConfigProvider>
    </div>
  );
};

export default App;
