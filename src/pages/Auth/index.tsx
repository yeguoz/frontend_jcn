import { Outlet } from "react-router";
import styles from "./index.module.css";
import Navbar from "../../components/Navbar";
import { Flex } from "antd";
import { authItems } from "../../constants/common";

const Auth = () => {
  return (
    <Flex
      style={{
        flex: 1,
        overflow: "hidden",
      }}
    >
      <Navbar menuItems={authItems} />
      <div className={styles.container}>
        <Outlet />
      </div>
    </Flex>
  );
};

export default Auth;
