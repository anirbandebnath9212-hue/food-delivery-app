import axios from "axios";

const api = axios.create({
  baseURL: "https://food-delivery-app-lrc3.onrender.com/api",
});


/* =========================
   ADD AUTH TOKEN
========================= */

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "biterush_token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;