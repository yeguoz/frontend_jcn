import Navbar from "../../components/Navbar";
import { getFileType, homeItems } from "../../constants/common";
import { Flex, List, Typography } from "antd";
import { useEffect, useState } from "react";
import { fetchShareList } from "../../services/shareController";
import ShareItemCard from "./components/ShareItemCard";

export const MyShare = () => {
  const [shareList, setShareList] = useState<API.MyShareVO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchShareList();
      setShareList(res.data);
    };
    fetchData();
  }, []);

  return (
    <Flex style={{ flex: 1, overflow: "hidden" }}>
      <Navbar showStorage menuItems={homeItems} optionOpen />
      <div style={{ flex: 1, padding: 20 }}>
        <Typography.Title level={3}>我的分享</Typography.Title>
        <List
          pagination={{ position: "bottom", align: "center", pageSize: 12 }}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={shareList}
          renderItem={(item: API.MyShareVO) => {
            const isDir = item.isDir === 1;
            let fileType;
            if (!isDir) {
              const extension = item.sourceName.split(".").pop() || "";
              fileType = getFileType(extension);
            }
            const src = isDir
              ? "/public/assets/images/folder.svg"
              : `/public/assets/images/${fileType}.svg`;
            return (
              <List.Item>
                <ShareItemCard key={item.id} data={item} src={src} />
              </List.Item>
            );
          }}
        />
      </div>
    </Flex>
  );
};
