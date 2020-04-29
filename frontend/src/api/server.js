import axios from "axios";
import jscookie from "js-cookie";

const instance = axios.create({
  baseURL: "http://127.0.0.1:9000", //check in production
});

instance.defaults.withCredentials = true;

instance.interceptors.request.use(
  async (config) => {
    const token = jscookie.get("blackbook");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (e) => {
    return Promise.reject(e);
  }
);

export default instance;
