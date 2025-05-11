import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import {
  fetchSharedFile,
  fetchSharedFileInfo,
} from "../../services/shareController";
import PwdCard from "./components/PwdCard";
import ShareFile from "./components/ShareFile";
import ShareFolder from "./components/ShareFolder";
import useShareStore from "../../store/useShareStore";
import { Flex, notification } from "antd";
import useFetchSharedUserFiles from "../../hooks/useFetchSharedUserFiles";
import ItemContextMenu from "./components/ItemContextMenu";
import HeaderMenu from "./components/HeaderMenu";
import Navbar from "../../components/Navbar";
import { authItems, homeItems } from "../../constants/common";
import useAuthStore from "../../store/useAuthStore";
import MultipleMenu from "./components/MultipleMenu";

export const Share = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const { shortId } = useParams();
  const { pwd } = useFetchSharedUserFiles();
  const [api, contextHolder] = notification.useNotification();
  const itemCtxMenuRef = useRef<HTMLDivElement>(null);
  const multipleMenuMenuRef = useRef<HTMLDivElement>(null);
  const {
    setInfoData,
    setData,
    pwdVisible,
    setPwdVisible,
    fileVisible,
    setFileVisible,
    folderVisible,
    setFolderVisible,
    setShortId,
    itemCtxMenuVisible,
    multipleMenuVisible,
    setItemCtxMenuVisible,
    setMultipleMenuVisible,
    selectedRows,
  } = useShareStore((state) => state);

  useEffect(() => {
    setShortId(shortId as string);
    console.log("shortId", shortId);
    const fetchInfoData = async () => {
      const response = await fetchSharedFileInfo(shortId as string);
      if (response.code === 200) {
        fetchData();
      } else if (response.code >= 400) {
        api.warning({ message: response.message });
        return;
      }
      console.log("response.data", response.data);
      setInfoData(response.data);
      if (response.data.passwordEnabled) {
        setPwdVisible(true);
      } else {
        if (response.data.isDir) {
          setFolderVisible(true);
        } else {
          setFileVisible(true);
        }
      }
    };

    const fetchData = async () => {
      const response = await fetchSharedFile(shortId as string, pwd as string);
      if (response.code >= 400) {
        api.warning({ message: response.message });
        return;
      }
      console.log(response.data);
      setData(response.data);
      setPwdVisible(false);

      if (response.data.isDir) {
        setFolderVisible(true);
      } else {
        setFileVisible(true);
      }
    };

    fetchInfoData();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        itemCtxMenuRef.current &&
        !itemCtxMenuRef.current.contains(event.target as Node)
      ) {
        setItemCtxMenuVisible(false);
      }
      if (
        multipleMenuMenuRef.current &&
        !multipleMenuMenuRef.current.contains(event.target as Node)
      ) {
        setMultipleMenuVisible(false);
      }
    };
    if (itemCtxMenuVisible || multipleMenuVisible) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [
    itemCtxMenuVisible,
    multipleMenuVisible,
    setItemCtxMenuVisible,
    setMultipleMenuVisible,
  ]);

  return (
    <Flex style={{ flex: 1, overflow: "hidden" }}>
      {isAuth ? (
        <Navbar menuItems={homeItems} showStorage optionOpen/>
      ) : (
        <Navbar menuItems={authItems} />
      )}
      {contextHolder}
      {selectedRows.length > 0 && <HeaderMenu />}
      {pwdVisible && <PwdCard api={api} />}
      {fileVisible && <ShareFile />}
      {folderVisible && <ShareFolder api={api} />}
      {itemCtxMenuVisible && <ItemContextMenu ref={itemCtxMenuRef} />}
      {multipleMenuVisible && <MultipleMenu ref={multipleMenuMenuRef} />}
    </Flex>
  );
};
