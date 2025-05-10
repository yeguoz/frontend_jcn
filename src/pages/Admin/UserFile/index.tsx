import { notification, Space, Table, TableProps } from "antd";
import dateFormatUtil from "../../../utils/dateFormatUtil";
import { useEffect, useState } from "react";
import {
  deleteUserFile,
  fetchUserFiles,
} from "../../../services/adminController";

interface DataType {
  id: number;
  userId: number;
  username: string;
  fileId: number;
  fileName: string;
  createdAt: Date;
}

export const UserFile = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [api, contextHolder] = notification.useNotification();
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "用户ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "文件ID",
      dataIndex: "fileId",
      key: "fileId",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      ellipsis: true,
    },
    {
      title: "文件名",
      dataIndex: "filename",
      key: "filename",
      ellipsis: true,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => {
        if (!value) return null;
        return <span>{dateFormatUtil(value)}</span>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <a
            onClick={async () => {
              const resp = await deleteUserFile(record.id);
              if (resp.code === 200) {
                const res = await fetchUserFiles();
                setData(res.data);
                api.success({
                  message: resp.message,
                });
              } else {
                api.warning({
                  message: resp.message,
                });
              }
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    const getUserFiles = async () => {
      const res = await fetchUserFiles();
      setData(res.data);
    };
    getUserFiles();
  }, []);

  return (
    <div
      style={{
        flex: 1,
        overflowX: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {contextHolder}
      <Table<DataType>
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={{
          position: ["bottomCenter"],
        }}
      />
    </div>
  );
};
