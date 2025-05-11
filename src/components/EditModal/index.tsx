import { Modal, Form, Input, notification } from "antd";
import { useEffect, useState } from "react";
import {
  createFolder,
  deleteFolder,
  renameFolder,
} from "../../services/folderController";
import {
  createUserFiles,
  deleteUserFile,
  getUserFiles,
  renameFile,
} from "../../services/userFileController";
import useDataStore from "../../store/useDataStore";
import useVisibleRowsPosStore from "../../store/useVisibleRowsPosStore";
import useFetchUserFiles from "../../hooks/useFetchUserFiles";
import useFetchUser from "../../hooks/useFetchUser";

const EditModal = () => {
  const editModalVisible = useVisibleRowsPosStore(
    (state) => state.editModalVisible
  );
  const setEditModalVisible = useVisibleRowsPosStore(
    (state) => state.setEditModalVisible
  );
  const setCtxMenuVisible = useVisibleRowsPosStore(
    (state) => state.setCtxMenuVisible
  );
  const selectedRecord = useVisibleRowsPosStore(
    (state) => state.selectedRecord
  );
  const setSelectedRows = useVisibleRowsPosStore(
    (state) => state.setSelectedRows
  );
  const selectedRows = useVisibleRowsPosStore((state) => state.selectedRows);
  const editModalType = useVisibleRowsPosStore((state) => state.editModalType);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const setData = useDataStore((state) => state.setData);
  const { pathRef, fetchUserFiles } = useFetchUserFiles();
  const [folderInputValue, setFolderInputValue] = useState(
    selectedRecord?.name
  );
  const [fileInputValue, setFileInputValue] = useState(selectedRecord?.name);
  const { debouncedFetchCurrentUser } = useFetchUser();

  useEffect(() => {
    if (editModalVisible && selectedRecord) {
      if (editModalType === "renameFolder") {
        setFolderInputValue(selectedRecord.name || "");
      } else if (editModalType === "renameFile") {
        setFileInputValue(selectedRecord.name || "");
      }
    }
  }, [editModalType, editModalVisible, selectedRecord]);

  let title = "";
  if (editModalType === "folder") {
    title = "创建文件夹";
  } else if (editModalType === "file") {
    title = "创建文件";
  } else if (editModalType === "delete") {
    title = "删除文件或文件夹";
  } else if (editModalType === "renameFolder") {
    title = "重命名文件夹";
  } else if (editModalType === "renameFile") {
    title = "重命名文件";
  }

  const handleOk = async () => {
    const filelds = form.getFieldsValue(true);
    const { folderName, fileName } = filelds || {};

    if (editModalType === "folder" && folderName) {
      // 创建文件夹
      setIsLoading(true);
      try {
        const response = await createFolder(pathRef.current, folderName);
        if (response.code === 200 && response.data > 0) {
          // 刷新数据
          const filesResp = await getUserFiles(pathRef.current);
          if (filesResp.data && filesResp.data.list) {
            setData(filesResp.data.list);
            setSelectedRows([]);
          }
        } else if (response.code >= 400) {
          api.warning({
            message: response.message,
          });
        } else if (response.code >= 500) {
          api.error({
            message: response.message,
          });
        }
      } finally {
        setIsLoading(false);
        setEditModalVisible(false);
        form.resetFields();
      }
    } else if (editModalType === "folder" && !folderName) {
      api.warning({
        message: "请输入文件夹名称!",
      });
    }

    if (editModalType === "file" && fileName) {
      // 创建文件
      setIsLoading(true);
      try {
        const response = await createUserFiles(pathRef.current, fileName);
        if (response.code === 200 && response.data > 0) {
          // 刷新数据
          fetchUserFiles(pathRef.current);
          setSelectedRows([]);
        } else if (response.code >= 400) {
          api.warning({
            message: response.message,
          });
        } else if (response.code >= 500) {
          api.error({
            message: response.message,
          });
        }
      } finally {
        setIsLoading(false);
        setEditModalVisible(false);
        form.resetFields();
      }
    } else if (editModalType === "file" && !fileName) {
      api.warning({
        message: "请输入文件名称!",
      });
    }

    if (editModalType === "delete") {
      for (const row of selectedRows) {
        if (row.type === "file") {
          try {
            setIsLoading(true);
            const resp = await deleteUserFile(row.userFileId, row.fileId, row.size);
            if (resp.code === 200) {
              fetchUserFiles(pathRef.current);
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
            setEditModalVisible(false);
            setSelectedRows([]);
          }
        } else if (row.type === "folder") {
          try {
            setIsLoading(true);
            const resp = await deleteFolder(row.folderId);
            if (resp.code === 200) {
              fetchUserFiles(pathRef.current);
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
            setEditModalVisible(false);
            setSelectedRows([]);
          }
        }
      }
    }

    if (editModalType === "renameFolder" && folderInputValue) {
      console.log("重命名文件夹", selectedRecord);
      setIsLoading(true);
      try {
        const response = await renameFolder(
          selectedRecord?.folderId as API.FileDTO["folderId"],
          folderInputValue
        );
        if (response.code === 200 && response.data > 0) {
          fetchUserFiles(pathRef.current);
        } else if (response.code >= 400) {
          api.warning({
            message: response.message,
          });
        } else if (response.code >= 500) {
          api.error({
            message: response.message,
          });
        }
      } finally {
        setIsLoading(false);
        setEditModalVisible(false);
        setSelectedRows([]);
        form.resetFields();
      }
    } else if (editModalType === "renameFolder" && !folderInputValue) {
      api.warning({
        message: "请输入重命名文件夹名称!",
      });
    }

    if (editModalType === "renameFile" && fileInputValue) {
      setIsLoading(true);
      try {
        const response = await renameFile(
          selectedRecord?.userFileId as API.FileDTO["userFileId"],
          fileInputValue
        );
        if (response.code === 200 && response.data > 0) {
          fetchUserFiles(pathRef.current);
        } else if (response.code >= 400) {
          api.warning({
            message: response.message,
          });
        } else if (response.code >= 500) {
          api.error({
            message: response.message,
          });
        }
      } finally {
        setIsLoading(false);
        setEditModalVisible(false);
        setSelectedRows([]);
        form.resetFields();
      }
    } else if (editModalType === "renameFile" && fileInputValue === "") {
      api.warning({
        message: "请输入重命名文件名称!",
      });
    }
  };

  const handleCancel = () => {
    setCtxMenuVisible(false);
    setEditModalVisible(false);
    form.resetFields();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={title}
        cancelText="取消"
        okText="确定"
        centered
        loading={isLoading}
        open={editModalVisible}
        onCancel={() => handleCancel()}
        width="400px"
        onOk={() => handleOk()}
      >
        <Form layout="vertical" name="editForm" form={form}>
          {editModalType === "folder" && (
            <Form.Item
              name="folderName"
              label="文件夹名称"
              rules={[{ required: true, message: "请输入文件夹名称!" }]}
            >
              <Input style={{ height: "30px" }} />
            </Form.Item>
          )}
          {editModalType === "file" && (
            <Form.Item
              name="fileName"
              label="文件名称"
              rules={[{ required: true, message: "请输入文件名称!" }]}
            >
              <Input style={{ height: "30px" }} />
            </Form.Item>
          )}
        </Form>
        {editModalType === "renameFolder" && (
          <Input
            style={{ height: "30px" }}
            value={folderInputValue}
            onChange={(e) => setFolderInputValue(e.target.value)}
          />
        )}
        {editModalType === "renameFile" && (
          <Input
            style={{ height: "30px" }}
            value={fileInputValue}
            onChange={(e) => setFileInputValue(e.target.value)}
          />
        )}
        {editModalType === "delete" && <p>确认删除吗？</p>}
      </Modal>
    </>
  );
};

export default EditModal;
