import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { getUserFiles } from "../services/userFileController";
import useDataStore from "../store/useDataStore";
import useLoadingStore from "../store/useLoadingStore";

const useFetchUserFiles = () => {
  const [searchParams] = useSearchParams();
  const path = searchParams.get("path") || "/";
  const setData = useDataStore((state) => state.setData);
  const setTableIsLoading = useLoadingStore(
    (state) => state.setTableIsLoading
  );
  const pathRef = useRef(path);

  useEffect(() => {
    pathRef.current = path;
  }, [path]);

  const fetchUserFiles = useCallback(async (path: string) => {
    setTableIsLoading(true);
    const response = await getUserFiles(path);
    setData(response.data.list);
    setTableIsLoading(false);
  }, [setData, setTableIsLoading]);

  return {
    path,
    fetchUserFiles,
    pathRef
  }
}

export default useFetchUserFiles