import axios from "axios";

axios.defaults.baseURL = import.meta.env.PROD ? "" : "/";
axios.defaults.headers.get["Content-Type"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

export default axios;