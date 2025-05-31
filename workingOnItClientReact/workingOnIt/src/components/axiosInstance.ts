import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL  


const axiosInstance = axios.create({

     baseURL: `${rawBaseUrl.replace(/\/+$/, "")}/api`,
     
     withCredentials: true,
});


axiosInstance.interceptors.request.use((config) => {
  console.log("Base URL is:", rawBaseUrl);

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
