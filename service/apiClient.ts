import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://paste-bin-api.onrender.com/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;