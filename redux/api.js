import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { store } from "./store";
import { logout } from "./authReducer";
const BASE_URL = "https://api.kelatibeauty.com/";

const api = axios.create({
  baseURL: "https://api.kelatibeauty.com/",
  // baseURL: "http://192.168.0.113:8080",
  // baseURL: "http://10.10.4.135:8080",
  
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.title = error.response?.data?.title;
    error.description = error.response?.data?.detail;
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(
      "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
    , api);
    console.log(error.response.data);
    if (error.response && error.response.status === 401) {
      if (error.response.data.code == "token_not_valid") {
        await AsyncStorage.removeItem("data");

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
      const data = await AsyncStorage.getItem("data");
      const d = JSON.parse(data);
      if (d) {
        console.log("==============", d.access);
        config.headers.Authorization = `JWT ${d.access}`;
      }
      return config;
    } catch (error) {
      console.error("Error retrieving auth token from AsyncStorage:", error);
      // Handle errors appropriately, e.g., redirect to login or display an error message
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default api;
