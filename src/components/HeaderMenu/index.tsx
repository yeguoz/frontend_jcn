import { Flex } from "antd";
import useVisibleRowsPosStore from "../../store/useVisibleRowsPosStore";
import Folder from "./components/Folder";
import Multiple from "./components/Multiple";
import File from "./components/File";
import { formatBytesUtil } from "../../utils/formatUtil";

const HeaderMenu = () => {
  const selectedRows = useVisibleRowsPosStore((state) => state.selectedRows);
  const { name, size, type } = selectedRows?.[0] || {};
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        height: "65px",
        padding: "0 40px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontSize: "1.4rem",
      }}
    >
      <div>
        {selectedRows.length > 1 ? (
          <span>{selectedRows.length}个对象</span>
        ) : (
          <span>{name}</span>
        )}
        {selectedRows.length === 1 && type === "file" && (
          <span>&nbsp;&nbsp;({formatBytesUtil(size)})</span>
        )}
      </div>
      <Flex gap={15}>
        {/* 多选 */}
        {selectedRows.length > 1 && <Multiple />}
        {/* 文件夹 */}
        {selectedRows.length === 1 && type === "folder" && <Folder />}
        {/* 文件 */}
        {selectedRows.length === 1 && type === "file" && <File />}
      </Flex>
    </div>
  );
};

export default HeaderMenu;
