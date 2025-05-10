import { useEffect, useState } from "react";
import { notification, Space, Table } from "antd";
import type { TableProps } from "antd";
import dateFormatUtil from "../../../utils/dateFormatUtil";
import { deleteUser, fetchUsers } from "../../../services/adminController";
import { useNavigate } from "react-router";
import { formatBytesUtil } from "../../../utils/formatUtil";

interface DataType {
  id: number;
  name: string;
  email: string;
  groupName: string;
  status: number;
  usedStorage: number;
  createdAt: Date;
}

export const User = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "昵称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "用户组",
      dataIndex: "groupName",
      key: "groupName",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        return value === 0 ? "正常" : "未激活";
      },
    },
    {
      title: "已用空间",
      dataIndex: "usedStorage",
      key: "usedStorage",
      render: (value) => {
        return value && <span>{formatBytesUtil(value)}</span>;
      },
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
            onClick={() => {
              navigate(`edit`, { state: { ...record } });
            }}
          >
            编辑
          </a>
          <a
            onClick={async () => {
              const res = await deleteUser(record.id);
              if (res.code === 200) {
                api.success({ message: res.message });
                const resp = await fetchUsers();
                setData(resp.data);
              } else {
                api.warning({ message: res.message });
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
    const getUsers = async () => {
      const res = await fetchUsers();
      setData(res.data);
    };
    getUsers();
  }, []);

  return (
    <div
      style={{
        flex: 1,
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
