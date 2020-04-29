import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:9000",
});

// instance.interceptors.request.use(
//     async (config) => {
//       const token = await AsyncStorage.getItem('token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (e) => {
//       return Promise.reject(e);
//     },
//   );

export default instance;
