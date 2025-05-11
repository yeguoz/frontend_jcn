import { Outlet } from "react-router";
import { AdminNavbar } from "./components/AdminNavbar";
import { Flex } from "antd";

export const Admin = () => {
  return (
    <Flex style={{width: "100%"}}>
      <AdminNavbar />
      <Outlet />
    </Flex>
  );
};
