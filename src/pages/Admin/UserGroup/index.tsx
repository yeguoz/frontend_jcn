import { useEffect, useState } from "react";
import { Button, notification, Space, Table } from "antd";
import type { TableProps } from "antd";
import dateFormatUtil from "../../../utils/dateFormatUtil";
import { deleteGroup, fetchGroups } from "../../../services/adminController";
import { useNavigate } from "react-router";
import { formatBytesUtil } from "../../../utils/formatUtil";

interface DataType {
  id: number;
  name: string;
  policyId: number;
  maxStorage: number;
  shareEnabled: number;
  createdAt: Date;
}

export const UserGroup = () => {
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
      title: "组名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "策略ID",
      dataIndex: "policyId",
      key: "policyId",
    },
    {
      title: "最大存储",
      dataIndex: "maxStorage",
      key: "maxStorage",
      render: (value) => {
        return formatBytesUtil(value);
      },
    },
    {
      title: "分享启用",
      dataIndex: "shareEnabled",
      key: "shareEnabled",
      render: (value) => {
        if (value === null || value === undefined) return "否";
        return value === 1 ? "是" : "否";
      },
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => {
        if (value === null || value === undefined) return "无";
        return <span>{dateFormatUtil(value)}</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              navigate(`edit`, { state: { ...record } });
            }}
          >
            编辑
          </a>
          <a
            onClick={async () => {
              const res = await deleteGroup(record.id);
              if (res.code === 200) {
                api.success({ message: res.message });
                const resp = await fetchGroups();
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
    const getUserFiles = async () => {
      const res = await fetchGroups();
      setData(res.data);
    };
    getUserFiles();
  }, []);

  return (
    <div
      style={{
        flex: 1,
        marginTop: 20,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {contextHolder}
      <Button
        type="primary"
        onClick={() => {
          navigate(`add`);
        }}
      >
        新建用户组
      </Button>
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
