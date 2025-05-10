import { Button, Flex, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import useVisibleRowsPosStore from "../../store/useVisibleRowsPosStore";
import {
  copyFolder,
  fetchSubFolders,
  moveFolder,
} from "../../services/folderController";
import styles from "./index.module.css";
import { FolderOutlined, RightOutlined } from "@ant-design/icons";
import { copyUserFile, moveUserFile } from "../../services/userFileController";
import useFetchUserFiles from "../../hooks/useFetchUserFiles";
import useUploadStore from "../../store/useUploadStore";
import useFetchUser from "../../hooks/useFetchUser";

const TreeModal = () => {
  const setItemCtxMenuVisible = useVisibleRowsPosStore(
    (state) => state.setItemCtxMenuVisible
  );
  const setTreeModalVisible = useVisibleRowsPosStore(
    (state) => state.setTreeModalVisible
  );
  const treeModalVisible = useVisibleRowsPosStore(
    (state) => state.treeModalVisible
  );
  const setSelectedRows = useVisibleRowsPosStore(
    (state) => state.setSelectedRows
  );
  const selectedRows = useVisibleRowsPosStore((state) => state.selectedRows);

  const treeModalType = useVisibleRowsPosStore((state) => state.treeModalType);
  const tasks = useUploadStore((state) => state.tasks);

  const { pathRef, fetchUserFiles } = useFetchUserFiles();
  const [data, setData] = useState<API.SubFolderVO>();
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const { debouncedFetchCurrentUser } = useFetchUser();

  const handleCancel = () => {
    setItemCtxMenuVisible(false);
    setTreeModalVisible(false);
    setActiveItemId(null);
  };

  const handleItemClick = (id: number) => {
    setActiveItemId(id);
  };

  const getSubFolders = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();
    setActiveItemId(null);
    const resp = await fetchSubFolders(null, id);
    if (resp.code === 200) {
      setData(resp.data);
    }
  };

  const handleOk = async () => {
    if (!activeItemId) {
      api.warning({
        message: "请选择一个目录",
      });
      return;
    }

    if (treeModalType === "copy") {
      for (const row of selectedRows) {
        const uploadIds: string[] = [];
        for (const key in tasks) {
          const task = tasks[key];
          if (task?.status !== "error" && task?.status !== "success") {
            uploadIds.push(task.uploadId);
          }
        }
        if (row.type === "folder") {
          try {
            setIsLoading(true);
            const resp = await copyFolder(
              row.folderId,
              activeItemId,
              row.name,
              uploadIds
            );
            if (resp.code === 200) {
              setTreeModalVisible(false);
              setSelectedRows([]);
              debouncedFetchCurrentUser();
              api.success({
                message: resp.message,
              });
            } else {
              api.warning({
                message: resp.message,
              });
            }
          } finally {
            setIsLoading(false);
          }
        } else if (row.type === "file") {
          try {
            setIsLoading(true);
            const resp = await copyUserFile(
              row?.size as number,
              row?.userFileId as number,
              activeItemId as number,
              uploadIds
            );
            if (resp.code === 200) {
              setTreeModalVisible(false);
              setSelectedRows([]);
              debouncedFetchCurrentUser();
              api.success({
                message: resp.message,
              });
            } else {
              api.warning({
                message: resp.message,
              });
            }
          } finally {
            setIsLoading(false);
          }
        }
      }
    }

    if (treeModalType === "move") {
      for (const row of selectedRows) {
        if (row.type === "folder") {
          try {
            setIsLoading(true);
            const resp = await moveFolder(
              row?.folderId as number,
              activeItemId as number
            );
            if (resp.code === 200) {
              await fetchUserFiles(pathRef.current);
              setTreeModalVisible(false);
              setSelectedRows([]);
              api.success({
                message: resp.message,
              });
            } else {
              api.warning({
                message: resp.message,
              });
            }
          } finally {
            setIsLoading(false);
          }
        } else if (row.type === "file") {
          try {
            setIsLoading(true);
            const resp = await moveUserFile(
              row?.userFileId as number,
              activeItemId as number
            );
            if (resp.code === 200) {
              await fetchUserFiles(pathRef.current);
              setTreeModalVisible(false);
              setSelectedRows([]);
              api.success({
                message: resp.message,
              });
            } else {
              api.warning({
                message: resp.message,
              });
            }
          } finally {
            setIsLoading(false);
          }
        }
      }
    }
    setActiveItemId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetchSubFolders(pathRef.current, null);
      if (resp.code === 200) {
        setData(resp.data);
      }
    };
    if (treeModalVisible) {
      fetchData();
    }
  }, [treeModalVisible]);

  return (
    <>
      {contextHolder}
      <Modal
        title={treeModalType === "copy" ? "复制到" : "移动到"}
        cancelText="取消"
        okText="确定"
        centered
        loading={isLoading}
        open={treeModalVisible}
        onCancel={handleCancel}
        width="400px"
        onOk={handleOk}
      >
        {data?.parentId != null && (
          <Flex
            justify="space-between"
            align="center"
            key={`parent-${data.parentId}`}
            className={`${styles.item} ${
              activeItemId === data.parentId ? styles.active : ""
            }`}
            onClick={async () => {
              handleItemClick(data.parentId);
            }}
          >
            <Flex gap={10}>
              <FolderOutlined />
              <span>父目录</span>
            </Flex>
            <Button
              type="text"
              size="small"
              shape="circle"
              icon={<RightOutlined />}
              onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                getSubFolders(e, data.parentId);
              }}
            />
          </Flex>
        )}
        <Flex
          align="center"
          gap={10}
          key={data?.currentId}
          className={`${styles.item} ${
            activeItemId === data?.currentId ? styles.active : ""
          }`}
          onClick={() => {
            handleItemClick(data?.currentId || 0);
          }}
        >
          <FolderOutlined />
          {data?.parentId != null ? <span>当前目录</span> : <span>根目录</span>}
        </Flex>
        {data &&
          data.list.map((item) => {
            if (
              selectedRows.some(
                (row) => row.type === "folder" && row.folderId === item.id
              )
            ) {
              return null;
            }

            return (
              <Flex
                justify="space-between"
                align="center"
                key={item.id}
                className={`${styles.item} ${
                  activeItemId === item.id ? styles.active : ""
                }`}
                onClick={() => {
                  handleItemClick(item.id);
                }}
              >
                <Flex gap={10}>
                  <FolderOutlined />
                  <span>{item.name}</span>
                </Flex>
                <Button
                  type="text"
                  size="small"
                  shape="circle"
                  icon={<RightOutlined />}
                  onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                    getSubFolders(e, item.id);
                  }}
                />
              </Flex>
            );
          })}
      </Modal>
    </>
  );
};

export default TreeModal;
