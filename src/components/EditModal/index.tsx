import { Modal, Form, Input, notification } from "antd";
import { useEffect, useState } from "react";
import { createFolder, renameFolder } from "../../services/folderController";
import {
  createUserFiles,
  deleteUserFile,
  getUserFiles,
  renameFile,
} from "../../services/userFileController";
import useDataStore from "../../store/useDataStore";
import useVisibleRowsPosStore from "../../store/useVisibleRowsPosStore";
import useFetchUserFiles from "../../hooks/useFetchUserFiles";

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
  const editModalType = useVisibleRowsPosStore((state) => state.editModalType);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const setData = useDataStore((state) => state.setData);
  const { path, fetchUserFiles } = useFetchUserFiles();
  const [folderInputValue, setFolderInputValue] = useState(
    selectedRecord?.name
  );
  const [fileInputValue, setFileInputValue] = useState(selectedRecord?.name);

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
  } else if (editModalType === "deleteFile") {
    title = "删除文件";
  } else if (editModalType === "deleteFolder") {
    title = "删除文件夹";
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
        const response = await createFolder(path, folderName);
        if (response.code === 200 && response.data > 0) {
          // 刷新数据
          const filesResp = await getUserFiles(path);
          if (filesResp.data && filesResp.data.list) {
            setData(filesResp.data.list);
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
        const response = await createUserFiles(path, fileName);
        if (response.code === 200 && response.data > 0) {
          // 刷新数据
          fetchUserFiles();
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

    if (editModalType === "deleteFile") {
      console.log("删除文件", selectedRecord);
      setIsLoading(true);
      try {
        const response = await deleteUserFile(selectedRecord);
        if (response.code === 200 && response.data >= 0) {
          // 刷新数据
          fetchUserFiles();
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
      }
    }

    if (editModalType === "deleteFolder") {
      console.log("删除文件夹", selectedRecord);
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
          fetchUserFiles();
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
          fetchUserFiles();
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
        {editModalType === "deleteFile" && <p>确认删除文件吗？</p>}
        {editModalType === "deleteFolder" && (
          <p>确认删除文件夹吗？该操作会删除该文件夹下所有文件和子文件夹！</p>
        )}
      </Modal>
    </>
  );
};

export default EditModal;
