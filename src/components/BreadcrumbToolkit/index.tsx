import { Breadcrumb, Flex } from "antd";
import { Link } from "react-router";
import useBreadcurmbStore from "../../store/useBreadcurmbStore";
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { useEffect } from "react";
import useVisibleAndRowsStore from "../../store/useVisibleRowsPosStore";
import useFetchUserFiles from "../../hooks/useFetchUserFiles";

const BreadcrumbToolkit = () => {
  const setItems = useBreadcurmbStore((state) => state.setItems);
  const items = useBreadcurmbStore((state) => state.items);
  const setSelectedRows = useVisibleAndRowsStore(
    (state) => state.setSelectedRows
  );
  const { path, fetchUserFiles,pathRef } = useFetchUserFiles();

  // 通过items渲染面包屑
  function itemRender(
    currentRoute: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>,
    _0: object,
    _1: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[],
    paths: string[]
  ) {
    const onCilck = async () => {
      const currentPath = paths[paths.length - 1] ===''?'/':paths[paths.length - 1];
      if (currentPath === currentRoute.path ) {
        fetchUserFiles(pathRef.current);
      }
      setSelectedRows([]);
    };

    return (
      <Link
        to={`/home?path=${encodeURIComponent(paths.join("/"))}`}
        onClick={onCilck}
        style={{
          padding: "0 16px",
          height: "40px",
          lineHeight: "40px",
          borderRadius: "10px",
        }}
      >
        {currentRoute.path}
      </Link>
    );
  }

  useEffect(() => {
    // 路径变化时更新面包屑 并获取文件列表
    const breadrumbitems = [{ path: "/", name: "/" }];
    path
      .split("/")
      .filter((item) => item !== "")
      .map((item) => {
        breadrumbitems.push({ path: item, name: item });
      });
    setItems(breadrumbitems);
    fetchUserFiles(pathRef.current);
  }, [path, setItems, fetchUserFiles,pathRef]);

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{
        minHeight: 45,
        backgroundColor: "#fff",
        padding: "0 16px",
        userSelect: "none",
        borderBottom: "1px solid #e8e8e8",
      }}
    >
      <Breadcrumb
        separator={
          <div
            style={{
              height: "40px",
              lineHeight: "40px",
            }}
          >
            &gt;
          </div>
        }
        style={{
          fontSize: 16,
        }}
        itemRender={itemRender}
        items={items}
      />
    </Flex>
  );
};

export default BreadcrumbToolkit;
