import useAuthStore from "../store/useAuthStore";
import { getCurrentUser } from "../services/userController";
import { debounce, throttle } from "lodash";

const useFetchUser = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const fetchCurrentUser = async () => {
    const resp = await getCurrentUser();
    if (resp.code === 200 && resp.data) {
      setUser(resp.data);
    }
  };
  const throttledFetchCurrentUser = throttle(fetchCurrentUser, 1000);
  const debouncedFetchCurrentUser = debounce(throttledFetchCurrentUser, 500);

  return {
    fetchCurrentUser,
    debouncedFetchCurrentUser
  }
}

export default useFetchUser;