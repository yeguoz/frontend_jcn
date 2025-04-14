import { useCallback } from "react";
import { useSearchParams } from "react-router";
import useLoadingStore from "../store/useLoadingStore";
import { fetchSharedFile } from "../services/shareController";
import useShareStore from "../store/useShareStore";

const useFetchSharedUserFiles = () => {
  const [searchParams] = useSearchParams();
  const setData = useShareStore((state) => state.setData);
  const data = useShareStore((state) => state.data);
  const shortId = useShareStore((state) => state.shortId);

  const setSharedTableIsLoading = useLoadingStore(
    (state) => state.setSharedTableIsLoading
  );
  
  const pwd = searchParams.get("pwd");
  const path = searchParams.get("path") || data?.sourceName;

  const fetchSharedUserFiles = useCallback(async () => {
    setSharedTableIsLoading(true);
    try {
      const response = await fetchSharedFile(
        shortId as string,
        pwd as string,
        path
      );
      
      if (response.code >= 400) {
        console.warn("fetchSharedUserFiles:", response.message);
        return;
      }
      setData(response.data);
    } finally {
      setSharedTableIsLoading(false);
    }

  }, [path, setData, setSharedTableIsLoading,pwd,shortId]);

  return {
    path,
    pwd,
    fetchSharedUserFiles,
  }
}

export default useFetchSharedUserFiles