import axios from "axios";
import { API } from "../config/api.config";

const apiClient = axios.create({
  baseURL: API.BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // Fallback to token if needed
  const existingToken = localStorage.getItem("token"); // Accommodating existing codebase 
  const finalToken = token || existingToken;
  if (finalToken) {
    config.headers.Authorization = `Bearer ${finalToken}`;
  }
  return config;
});

// Handle 401 globally (auto logout)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
