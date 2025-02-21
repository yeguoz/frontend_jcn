import { Navigate, useLocation, useSearchParams } from "react-router";
import useAuthStore from "../store/useAuthStore";

const useAuthGuard = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const authPaths = ["/login", "/register", "/forget"];
  const authRequiredPaths = ["/home", "/admin"];

  const redirect = searchParams.get("redirect");

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
