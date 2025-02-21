import { Breadcrumb } from "antd";
import { Link } from "react-router";
import deepEqualUtil from "../../utils/deepEqualUtil";
import { getUserFiles } from "../../services/userFileController";
import useDataStore from "../../store/useDataStore";
import useBreadcurmbStore from "../../store/useBreadcurmbStore";
import { BreadcrumbItemType, BreadcrumbSeparatorType } from "antd/es/breadcrumb/Breadcrumb";
import { Dispatch, SetStateAction } from "react";

const BreadcrumbToolkit = ({setSelectedRows}:{setSelectedRows:Dispatch<SetStateAction<API.FileDTO[]>>}) => {
  const setData = useDataStore((state) => state.setData);
  const setItems = useBreadcurmbStore((state) => state.setItems);
  const items = useBreadcurmbStore((state) => state.items);

  // 通过items渲染面包屑
  function itemRender(
    currentRoute: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>,
    params: object,
    items: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[],
    paths: string[]
  ) {
    const onCilck = async () => {
      console.log("params:", params);
      let newUrl = "";
      for (const variable of items) {
        // 处理家目录以外路径
        if (variable.path !== "/") {
          newUrl = `${newUrl}/${variable.path}`;
        }
        console.log("newUrl", newUrl);
        if (deepEqualUtil(variable, currentRoute)) {
          break;
        }
      }
      // 处理家目录路径
      if (newUrl === "") {
        newUrl = "/";
      }
      // 发送请求
      const response = await getUserFiles(newUrl);
      setData(response.data.list);
      // 更新面包屑
      const breadrumbitems = [{ path: "/", name: "/" }];
      newUrl
        .split("/")
        .filter((item) => item !== "")
        .map((item) => {
          breadrumbitems.push({ path: item, name: item });
        });
      setItems(breadrumbitems);
      // 清空选中行
      setSelectedRows([]);
    };

    return (
      <Link to={`/home?path=${paths.join("/")}`} onClick={onCilck}>
        {currentRoute.path}
      </Link>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "45px",
        backgroundColor: "#fff",
        padding: "0 16px",
        userSelect: "none",
        borderBottom: "1px solid #e8e8e8",
      }}
    >
      <Breadcrumb
        separator=">"
        style={{
          fontSize: "16px",
        }}
        itemRender={itemRender}
        items={items}
      />
    </div>
  );
};

export default BreadcrumbToolkit;
