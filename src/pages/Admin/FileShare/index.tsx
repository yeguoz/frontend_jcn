import { notification, Space, Table, TableProps } from "antd";
import dateFormatUtil from "../../../utils/dateFormatUtil";
import { useEffect, useState } from "react";
import {
  deleteSharedFile,
  fetchSharedFiles,
} from "../../../services/adminController";

interface DataType {
  id: number;
  userId: number;
  username: string;
  fileId: number;
  fileName: string;
  createdAt: Date;
}

export const FileShare = () => {
  const [api, contextHolder] = notification.useNotification();
  const [data, setData] = useState<DataType[]>([]);
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "分享者ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "分享者",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "源ID",
      dataIndex: "sourceId",
      key: "sourceId",
    },
    {
      title: "用户文件ID",
      dataIndex: "userFileId",
      key: "userFileId",
    },
    {
      title: "短链",
      dataIndex: "shortId",
      key: "shortId",
    },
    {
      title: "密码启用",
      dataIndex: "passwordEnabled",
      key: "passwordEnabled",
      render: (value) => {
        if (value === null || value === undefined || value === 0) return "否";
        return "是";
      },
    },
    {
      title: "密码",
      dataIndex: "password",
      key: "password",
      render: (value) => {
        if (value === null || value === undefined) return "无";
        return value;
      },
    },
    {
      title: "类型",
      dataIndex: "isDir",
      key: "isDir",
      render: (value) => {
        const type = value === 1 ? "文件夹" : "文件";
        return type;
      },
    },
    {
      title: "浏览数",
      dataIndex: "visitCount",
      key: "visitCount",
      render: (value) => {
        if (value === null || value === undefined) return 0;
        return value;
      },
    },
    {
      title: "剩余下载数",
      dataIndex: "remainingDownloads",
      key: "remainingDownloads",
    },
    {
      title: "预览启用",
      dataIndex: "previewEnabled",
      key: "previewEnabled",
      render: (value) => {
        if (value === null || value === undefined || value === 0) return "否";
        return "是";
      },
    },
    {
      title: "过期启用",
      dataIndex: "expireTimeEnabled",
      key: "expireTimeEnabled",
      render: (value) => {
        if (value === null || value === undefined || value === 0) return "否";
        return "是";
      },
    },
    {
      title: "过期时间",
      dataIndex: "expireTime",
      key: "expireTime",
      render: (value) => {
        if (value === null || value === undefined) return "无";
        return <span>{dateFormatUtil(value)}</span>;
      },
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
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <a
            onClick={async () => {
              const res = await deleteSharedFile(record.id);
              if (res.code === 200) {
                const resp = await fetchSharedFiles();
                setData(resp.data);
                api.success({
                  message: res.message,
                });
              } else {
                api.error({
                  message: res.message,
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
    const getSharedFiles = async () => {
      const res = await fetchSharedFiles();
      setData(res.data);
    };
    getSharedFiles();
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
