import { Outlet } from "react-router";
import styles from "./index.module.css";
const Auth = () => {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
};

export default Auth;