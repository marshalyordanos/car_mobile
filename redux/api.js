// src/redux/api.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { logout } from "./authReducer";
import { store } from "./store";

const api = axios.create({
  baseURL: "https://car-back-22tv.onrender.com/",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const raw = await AsyncStorage.getItem("data");
      if (!raw) return config;

      const data = JSON.parse(raw);
      const token = data?.tokens?.accessToken;   // <-- exact path you store

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // OPTIONAL: nice debug log
      const url = `${config.baseURL?.replace(/\/$/, "")}/${config.url?.replace(
        /^\//,
        ""
      )}`;
      console.log("API →", config.method?.toUpperCase(), url);
    } catch (e) {
      console.warn("Failed to read token from AsyncStorage", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------- RESPONSE: handle 401 ---------- */
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // token expired / invalid → wipe storage & logout
      await AsyncStorage.removeItem("data");
      store.dispatch(logout());
      // you can also redirect: router.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default api;