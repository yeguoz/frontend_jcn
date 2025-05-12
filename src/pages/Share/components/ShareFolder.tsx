import { Flex, Spin, Table } from "antd";
import BreadcrumbToolkit from "./BreadcrumbToolkit";
import useShareStore from "../../../store/useShareStore";
import useFetchSharedUserFiles from "../../../hooks/useFetchSharedUserFiles";
import { useNavigate } from "react-router";
import useLoadingStore from "../../../store/useLoadingStore";
import { NotificationInstance } from "antd/es/notification/interface";
import { filesColumns } from "../../../constants/common";

const ShareFolder = ({ api }: { api: NotificationInstance }) => {
  const data = useShareStore((state) => state.data);
  const infoData = useShareStore((state) => state.infoData);
  const selectedRows = useShareStore((state) => state.selectedRows);
  const setItemCtxMenuVisible = useShareStore(
    (state) => state.setItemCtxMenuVisible
  );
  const setMultipleMenuVisible = useShareStore(
    (state) => state.setMultipleMenuVisible
  );
  const setMultipleMenuPosition = useShareStore(
    (state) => state.setMultipleMenuPosition
  );
  const setItemCtxMenuPosition = useShareStore(
    (state) => state.setItemCtxMenuPosition
  );
  const setSelectedRows = useShareStore((state) => state.setSelectedRows);
  const setSelectedRecord = useShareStore((state) => state.setSelectedRecord);

  const sharedTableIsLoading = useLoadingStore(
    (state) => state.sharedTableIsLoading
  );
  const { pwd, path, fetchSharedUserFiles } = useFetchSharedUserFiles();
  const shortId = useShareStore((state) => state.shortId);
  const navigate = useNavigate();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const handleItemCtxMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    record: API.FileDTO
  ) => {
    event.preventDefault();
    // 阻止冒泡
    event.stopPropagation();
    let left = event.clientX;
    let top = event.clientY;
    if (event.clientX + 170 > windowWidth) {
      left = event.clientX - 170;
    }
    if (event.clientY + 416 > windowHeight) {
      top = event.clientY - (event.clientY + 416 - windowHeight);
    }

    if (selectedRows.includes(record) && selectedRows.length > 1) {
      // 当前是选择rows中一行
      setItemCtxMenuVisible(false);
      setMultipleMenuVisible(true);
      setMultipleMenuPosition({ x: left, y: top });
    } else {
      // 单选
      setMultipleMenuVisible(false);
      setItemCtxMenuVisible(true);
      setItemCtxMenuPosition({ x: left, y: top });
      // 设置选中记录更新keys
      setSelectedRows([record]);
      // 记录当前row信息
      setSelectedRecord(record);
    }
  };

  return (
    <Flex vertical={true} flex={1} style={{ width: "50%" }}>
      <BreadcrumbToolkit />
      {sharedTableIsLoading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Spin style={{ marginTop: 100 }} />
        </div>
      ) : (
        <Table<API.FileDTO>
          scroll={{ y: "calc(100vh - 148px)" }}
          size="small"
          rowKey={(record) => record.id}
          columns={filesColumns}
          dataSource={data?.list}
          pagination={false}
          rowSelection={{
            type: "checkbox",
            columnWidth: 40,
            selectedRowKeys: selectedRows.map((item) => item.id),
            onSelectMultiple: (_, selectedRows) => {
              console.log("onSelectMultiple", selectedRows);
            },
            onChange: (_, selectedRows) => {
              setItemCtxMenuVisible(false);
              setMultipleMenuVisible(false);
              setSelectedRows(selectedRows);
              if (
                selectedRows.length <= 1 &&
                selectedRows[0]?.type === "folder"
              ) {
                setSelectedRecord(selectedRows[0]);
              }
              if (
                selectedRows.length <= 1 &&
                selectedRows[0]?.type === "file"
              ) {
                setSelectedRecord(selectedRows[0]);
              }
            },
          }}
          onRow={(record) => {
            return {
              onClick: () => {}, // 点击行
              onDoubleClick: () => {
                if (record.type === "folder") {
                  // 进入文件夹，请求文件列表
                  const pwdPlaceholder = infoData?.passwordEnabled
                    ? `pwd=${pwd}`
                    : "";
                  fetchSharedUserFiles();
                  navigate(
                    `?${pwdPlaceholder}&path=${encodeURIComponent(
                      path + "/" + record.name
                    )}`
                  );
                }
                if (record.type === "file") {
                  if (!data?.previewEnabled) {
                    api.warning({ message: "预览禁用" });
                    return;
                  }

                  // 处理预览逻辑
                  navigate(
                    `/preview?filename=${encodeURIComponent(
                      record.name
                    )}&filePath=${encodeURIComponent(record.sourceName)}`,
                    {
                      state: {
                        shortId: shortId,
                        isShare: true,
                      },
                    }
                  );
                }
              },
              onContextMenu: (event) => {
                handleItemCtxMenu(event, record);
              },
            };
          }}
        />
      )}
    </Flex>
  );
};
export default ShareFolder;
