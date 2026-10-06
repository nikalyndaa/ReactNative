import axios from "axios";
import { API_URL } from "@/constants/config";

export const http = axios.create({
  baseURL: API_URL,
});