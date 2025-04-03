import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import {
  API_URL,
  REFRESH_TOKEN_KEY,
  TIME_THRESHOLD,
  TOKEN_EXPIRES_AT_KEY,
  TOKEN_KEY,
} from "../constants";
import { axiosInstance } from "@refinedev/nestjsx-crud";
import { HttpError } from "@refinedev/core";
export { axiosInstance };

const refreshAxios = axios.create();
axiosInstance.defaults.baseURL = API_URL;

axiosInstance.interceptors.request.use(
  async (request: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const tokenExpiresAt = parseInt(
        localStorage.getItem(TOKEN_EXPIRES_AT_KEY) || "0",
        10
      );
      const currentTime = Date.now();
      if (tokenExpiresAt - currentTime <= TIME_THRESHOLD) {
        handleLogout();
        // const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        // try {
        //   const res = await refreshAxios.post(
        //     `${API_URL}/auth/refresh`,
        //     {},
        //     {
        //       headers: {
        //         Authorization: "Bearer " + refreshToken,
        //       },
        //     }
        //   );

        //   const { token, tokenExpires } = res.data;

        //   localStorage.setItem(TOKEN_KEY, token);
        //   localStorage.setItem(TOKEN_EXPIRES_AT_KEY, tokenExpires);
        // } catch (error) {
        //   handleLogout();
        // }
      }
    }

    if (request.headers) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }

    return request;
  }
);

axiosInstance.interceptors.response.use(
  (response) => response, // Nếu không có lỗi, trả về response bình thường
  (error: AxiosError) => {
    const customError: HttpError = {
      ...error,
      message: (error.response?.data as any)?.message ?? "Something went wrong",
      statusCode: error.response?.status ?? 500,
    };

    if (error.response?.status === 401) {
      handleLogout();
    }
    return Promise.reject(customError);
  }
);

const handleLogout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  axiosInstance.defaults.headers["Authorization"] = ``;
  window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
};
