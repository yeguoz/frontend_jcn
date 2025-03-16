import { useCallback } from "react";
import { useSearchParams } from "react-router";
import { getUserFiles } from "../services/userFileController";
import useDataStore from "../store/useDataStore";
import useLoadingStore from "../store/useLoadingStore";

const useFetchUserFiles = () => {
  const [searchParams] = useSearchParams();
  const setData = useDataStore((state) => state.setData);
  const setTableIsLoading = useLoadingStore(
    (state) => state.setTableIsLoading
  );
  const path = searchParams.get("path") || "/";

  const fetchUserFiles = useCallback(async () => {
    setTableIsLoading(true);
    const response = await getUserFiles(path);
    setData(response.data.list);
    setTableIsLoading(false);
  }, [path, setData, setTableIsLoading]);

  return {
    path,
    fetchUserFiles,
  }
}

export default useFetchUserFiles