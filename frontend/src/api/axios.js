import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://radiology-qlts.onrender.com"; 

console.log("API BASE URL:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
