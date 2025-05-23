import { Breadcrumb, Flex } from "antd";
import { Link } from "react-router";
import useBreadcrumbStore from "../../store/useBreadcrumbStore";
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { useEffect } from "react";
import useVisibleAndRowsStore from "../../store/useVisibleRowsPosStore";
import useFetchUserFiles from "../../hooks/useFetchUserFiles";

const BreadcrumbToolkit = () => {
  const setItems = useBreadcrumbStore((state) => state.setItems);
  const items = useBreadcrumbStore((state) => state.items);
  const setSelectedRows = useVisibleAndRowsStore(
    (state) => state.setSelectedRows
  );
  const { path, fetchUserFiles, pathRef } = useFetchUserFiles();
  // 通过items渲染面包屑
  function itemRender(
    currentRoute: Partial<
      BreadcrumbItemType & BreadcrumbSeparatorType & { search: boolean }
    >,
    _: object,
    routes: Partial<
      BreadcrumbItemType & BreadcrumbSeparatorType & { search?: boolean }
    >[],
    paths: string[]
  ) {
    const onClick = async () => {
      const currentPath =
        paths[paths.length - 1] === "" ? "/" : paths[paths.length - 1];
      const previousPath =
        paths[paths.length - 2] === "" ? "/" : paths[paths.length - 2];
      const isSearch = routes[routes.length - 1].search;

      if (currentPath === currentRoute.path) {
        fetchUserFiles(pathRef.current);
      } else if (previousPath === currentRoute.path && isSearch) {
        // 搜索回到根目录
        fetchUserFiles(pathRef.current);
        setItems([{ path: "/", name: "/", search: false }]);
      }
      setSelectedRows([]);
    };

    if (currentRoute.search) {
      return (
        <Link
          to={`/home?path=${encodeURIComponent(pathRef.current)}`}
          style={{
            padding: "0 16px",
            height: "40px",
            lineHeight: "40px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          {currentRoute.path}
        </Link>
      );
    }

    return (
      <Link
        to={`/home?path=${encodeURIComponent(paths.join("/"))}`}
        onClick={onClick}
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
    const breadcrumbItems = [{ path: "/", name: "/", search: false }];
    path
      .split("/")
      .filter((item) => item !== "")
      .map((item) => {
        breadcrumbItems.push({ path: item, name: item, search: false });
      });
    setItems(breadcrumbItems);
    fetchUserFiles(pathRef.current);
  }, [pathRef.current]);

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
