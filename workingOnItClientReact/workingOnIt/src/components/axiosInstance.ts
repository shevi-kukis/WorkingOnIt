import axios from "axios";
const rawBaseUrl = process.env.REACT_APP_API_BASE_URL || "";
const axiosInstance = axios.create({

     baseURL: `${rawBaseUrl.replace(/\/+$/, "")}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
