import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://yardstick-backend.manishdahiya.me/api",
  withCredentials: true,
});
