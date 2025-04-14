import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { useEffect } from "react";
import { Link } from "react-router";
import { Flex, Breadcrumb } from "antd";
import useShareStore from "../../../store/useShareStore";
import useFetchSharedUserFiles from "../../../hooks/useFetchSharedUserFiles";
type items = { path: string; name: string }[];
const BreadcrumbToolkit = () => {
  const breadrumbitems = useShareStore((state) => state.breadrumbitems);
  const infoData = useShareStore((state) => state.infoData);
  const setBreadrumbitems = useShareStore((state) => state.setBreadrumbitems);
  const { pwd, path, fetchSharedUserFiles } = useFetchSharedUserFiles();
  // 通过items渲染面包屑
  function itemRender(
    currentRoute: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>,
    _0: object,
    _1: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[],
    paths: string[]
  ) {
    const onCilck = async () => {
      const currentPath =
        paths[paths.length - 1] === "" ? "/" : paths[paths.length - 1];
      if (currentPath === currentRoute.path) {
        fetchSharedUserFiles();
        return;
      }
    };
    
    const pwdPlaceholder =infoData?.passwordEnabled
    ? `pwd=${pwd}`
    : "";

    return (
      <Link
        to={`?${pwdPlaceholder}&path=${encodeURIComponent(
          paths.join("/")
        )}`}
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
    // 路径变化时更新面包屑
    const items: items = [];
    path
      ?.split("/")
      .filter((item) => item !== "")
      .map((item) => {
        items.push({ path: item, name: item });
      });

    setBreadrumbitems(items);
    fetchSharedUserFiles();
  }, [path]);

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
        items={breadrumbitems}
      />
    </Flex>
  );
};
export default BreadcrumbToolkit;
