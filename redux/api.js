import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  // baseURL: "https://car-back-22tv.onrender.com/",
  // baseURL: "http://10.0.2.2:3000/",
  baseURL: "http://172.20.10.6:3000/",

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
  } //
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

      console.log("Request URL:", fullUrl, JSON.stringify(d, null, 2));
      if (d) {
        console.log("==============", d?.tokens.accessToken);
        config.headers.Authorization = `Bearer ${d?.tokens?.accessToken}`;
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
