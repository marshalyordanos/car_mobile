import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./authReducer";
import carsReducer from "./carsSlice";
import categoryReducer from "./categoryReducer";
import favoriteReducer from "./favoriteSlice.js";
import favoritesReducer from "./favoritesSlice";
import filterOptionsReducer from "./filterOptionsSlice";
import filtersReducer from "./filtersSlice";

// Custom storage engine to handle Node.js environment
const storage = {
  getItem: async (key) => {
    if (typeof window === 'undefined') {
      console.warn('Running in Node.js, skipping AsyncStorage.getItem');
      return null; // Return null in Node.js to avoid persistence
    }
    return await AsyncStorage.getItem(key);
  },
  setItem: async (key, value) => {
    if (typeof window === 'undefined') {
      console.warn('Running in Node.js, skipping AsyncStorage.setItem');
      return; // Skip persistence in Node.js
    }
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    if (typeof window === 'undefined') {
      console.warn('Running in Node.js, skipping AsyncStorage.removeItem');
      return; // Skip persistence in Node.js
    }
    await AsyncStorage.removeItem(key);
  },
};

const rootReducer = combineReducers({
  auth: authReducer,
  main_category: categoryReducer,
  cars: carsReducer,
  favorites: favoritesReducer,
  filters: filtersReducer,
  filterOptions: filterOptionsReducer,
  favorite: favoriteReducer,
});

const persistConfig = {
  key: "root",
  storage, // Use custom storage instead of AsyncStorage directly
  whitelist: ["auth", "favorites"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);