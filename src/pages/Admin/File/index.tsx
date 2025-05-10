import { Table, TableProps } from "antd";
import dateFormatUtil from "../../../utils/dateFormatUtil";
import { useEffect, useState } from "react";
import { fetchFiles } from "../../../services/adminController";
import { formatBytesUtil } from "../../../utils/formatUtil";

interface DataType {
  id: number;
  size: number;
  fileHash: string;
  headerHash: string;
  sourceName: string;
  referenceCount: number;
  createdAt: Date;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "文件大小",
    dataIndex: "size",
    key: "size",
    render: (value) => {
      return value && <span>{formatBytesUtil(value)}</span>;
    },
  },
  {
    title: "文件哈希",
    dataIndex: "fileHash",
    key: "fileHash",
    ellipsis: true,
  },
  {
    title: "头部哈希",
    dataIndex: "headerHash",
    key: "headerHash",
    ellipsis: true,
  },
  {
    title: "源文件名",
    dataIndex: "sourceName",
    key: "sourceName",
    ellipsis: true,
  },
  {
    title: "引用计数",
    dataIndex: "referenceCount",
    key: "referenceCount",
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
];
export const File = () => {
  const [data, setData] = useState<DataType[]>([]);
  useEffect(() => {
    const getFiles = async () => {
      const res = await fetchFiles();
      setData(res.data);
    };
    getFiles();
  }, []);

  return (
    <div
      style={{
        flex: 1,
        overflowX: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
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
