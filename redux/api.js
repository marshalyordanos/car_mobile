import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const BASE_URL = "https://localhost:8000/";

const api = axios.create({
  baseURL: "http://10.0.2.2:8000/api/v1/",
  // baseURL: "https://car-rental-back-hzzg.onrender.com",
  // baseURL: "http://10.10.4.135:8080",

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
      "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||",
      api
    );
    // console.log(error.response.data);
    // if (error.response && error.response.status === 401) {
    //   if (error.response.data.code == "token_not_valid") {
    //     await AsyncStorage.removeItem("data");

    //     store.dispatch(logout());
    //   }
    //   // Dispatch the logout action
    // }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  async (config) => {
    try {
      const data = await AsyncStorage.getItem("data");
      const d = data && JSON.parse(data);
      const fullUrl = config.baseURL
        ? `${config.baseURL.replace(/\/$/, "")}/${config.url.replace(
            /^\//,
            ""
          )}`
        : config.url;

      console.log("Request URL:", fullUrl);
      if (d) {
        console.log("==============", d.accessToken);
        config.headers.Authorization = `Bearer ${d.accessToken}`;
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
