import axios from "axios";
import { API } from "../config/api.config";

const apiClient = axios.create({
  baseURL: API.BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests
});

// Handle 401 globally (auto logout)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only auto-logout on 401 if not on login page
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      // Redirect to login (cookies are cleared by backend)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
