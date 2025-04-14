import { Flex, Tooltip } from "antd";
import {
  CloudDownloadOutlined,
  EnterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import formatFileSizeUtil from "../../../utils/formatFileSizeUtil";
import useShareStore from "../../../store/useShareStore";
import useFetchSharedUserFiles from "../../../hooks/useFetchSharedUserFiles";
import { fetchDownloadFile } from "../../../services/userFileController";

const HeaderMenu = () => {
  const selectedRows = useShareStore((state) => state.selectedRows);

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
          <span>&nbsp;&nbsp;({formatFileSizeUtil(size)})</span>
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
const Folder = () => {
  const { path,pwd } = useFetchSharedUserFiles();
  const navigate = useNavigate();
  const selectedRecord = useShareStore(
    (state) => state.selectedRecord
  );
  const setSelectedRows = useShareStore(
    (state) => state.setSelectedRows
  );

  const onEnterFolder = () => {
    const newPath = encodeURIComponent(path + "/" + selectedRecord?.name);
    navigate(`?pwd=${pwd}&path=${newPath}`);
    setSelectedRows([]);
  };

  return (
    <>
      <div className="icon">
        <Tooltip title="进入文件夹" arrow={false} color={"#757575"}>
          <EnterOutlined className="outlinedIcon" onClick={onEnterFolder} />
        </Tooltip>
      </div>

      <div className="icon">
        <Tooltip title="打包下载" arrow={false} color={"#757575"}>
          <CloudDownloadOutlined className="outlinedIcon" />
        </Tooltip>
      </div>
    </>
  );
};

const File = () => {
  const navigate = useNavigate();
  const selectedRecord = useShareStore(
    (state) => state.selectedRecord
  );
  const data = useShareStore(
    (state) => state.data
  );
  const shortId = useShareStore(
    (state) => state.shortId
  ); 
  const setSelectedRows = useShareStore(
    (state) => state.setSelectedRows
  );

  const handleDownload = async () => {
    await fetchDownloadFile(
      data?.sourceName ? data?.sourceName : "",
      shortId as string
    );
  };

  const handlePreview = () => {
    navigate(
      `/preview?filePath=${encodeURIComponent(
        selectedRecord?.sourceName as string
      )}&filename=${encodeURIComponent(selectedRecord?.name as string)}`
    );
    setSelectedRows([]);
  }

  return (
    <>
      <div className="icon">
        <Tooltip title="预览" arrow={false} color={"#757575"}>
          <EnterOutlined className="outlinedIcon" onClick={handlePreview}/>
        </Tooltip>
      </div>
      <div className="icon">
        <Tooltip title="下载" arrow={false} color={"#757575"}>
          <CloudDownloadOutlined
            className="outlinedIcon"
            onClick={handleDownload}
          />
        </Tooltip>
      </div>
    </>
  );
};

const Multiple = () => {
  return (
    <>
      <div className="icon">
        <Tooltip title="打包下载" arrow={false} color={"#757575"}>
          <CloudDownloadOutlined className="outlinedIcon" />
        </Tooltip>
      </div>
    </>
  );
};

export default HeaderMenu;
