// import { toast } from "@/components/ui/toast";
import { api } from "../axios";
import Cookies from "js-cookie";
import { showToast } from "@/components/ReactToast";

// intercepting request to attach token
api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// variable to control race condition...
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

// intercepting response to do refresh token request...
api.interceptors.response.use(
  (response) => {
    return { ...response };
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        refreshQueue.forEach(({ resolve }) => resolve());
        refreshQueue = [];
        return api(originalRequest);
      } catch (refreshError) {
      

        showToast.error("Session Expired", "Please log in again");
        window.location.href = "/login";
        refreshQueue.forEach(({ reject }) => reject(refreshError));
        refreshQueue = [];
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
