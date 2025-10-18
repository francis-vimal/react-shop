import axios from "axios";

const api = axios.create({
  baseURL: "https://fakestoreapi.com", // base URL for all API calls
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;