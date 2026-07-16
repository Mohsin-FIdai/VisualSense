import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 900000, // 15 minutes (to allow the local AI model to download on first run)
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail || error.message || "An unexpected error occurred";
    console.error("[API Error]", message);
    return Promise.reject(new Error(message));
  }
);

export { API_BASE_URL };
