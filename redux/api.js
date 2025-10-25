// src/redux/api.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { logout } from "./authReducer";

const api = axios.create({
  // baseURL: "https://car-back-22tv.onrender.com/",
  // baseURL: "http://10.0.2.2:3000/",
  baseURL: "http://172.17.0.1:3000/",

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // error.title = error.response?.data?.title;
    // error.description = error.response?.data?.detail;
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(
      "error.response.data",
      error.response.data,
      error.response.status
    );
    if (error.response && error.response.status === 401) {
      if (error.response.data.message == "Invalid token") {
        await AsyncStorage.removeItem("data");
        console.log(
          "|||||||||||||||||||||||||||||sdsaasxas|||||||||||||||||||||||||||||||||||||",
          error.response.data
        );

        store.dispatch(logout());
      }
      // Dispatch the logout action
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  async (config) => {
    try {
      const raw = await AsyncStorage.getItem("data");
      if (!raw) return config;

      console.log("Request URL:", fullUrl, JSON.stringify(d, null, 2));
      if (d) {
        console.log("==============", d?.tokens.accessToken);
        config.headers.Authorization = `Bearer ${d?.tokens?.accessToken}`;
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
