import { Navigate, useLocation, useSearchParams } from "react-router";
import useAuthStore from "../store/useAuthStore";
import { message } from "antd";
import { ADMIN } from "../constants/common";

const useAuthGuard = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const user = useAuthStore((state) => state.user);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const authPaths = ["/login", "/register", "/forget"];
  const authRequiredPaths = ["/home", "/admin", "/setting"];
  const redirect = searchParams.get("redirect");

  if (isAuth && location.pathname.startsWith('/admin') && user?.group.name !== ADMIN) {
    message.error("您没有权限访问该页面");
    return <Navigate to="/home" replace />;
  }

  if (isAuth && authPaths.some((path) => location.pathname.startsWith(path))) {
    return redirect ? (
      <Navigate to={redirect} replace />
    ) : (
      <Navigate to="/home" replace />
    );
  }

  if (
    !isAuth &&
    authRequiredPaths.some((path) => location.pathname.startsWith(path))
  ) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return null;
};

export default useAuthGuard;
