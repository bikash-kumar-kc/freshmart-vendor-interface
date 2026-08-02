import { config } from "@/config/config";
import axios from "axios";

export const api = axios.create({
  baseURL: config.baseUrl as string,
  withCredentials: true,
});
