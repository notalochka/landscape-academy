import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const testConnection = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Помилка з'єднання з сервером:", error);
    throw error;
  }
};

export default api;
