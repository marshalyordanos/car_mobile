import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./authReducer";
import carsReducer from "./carsSlice";
import cartReducer, { cartMiddleware } from "./cartReducer";
import categoryReducer from "./categoryReducer";
import favoritesReducer from "./favoritesSlice";

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["cart"], // only cart will be persisted
};

// Create persisted reducers
const persistedCartReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    main_category: categoryReducer,
    cart: persistedCartReducer,
    cars: carsReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }).concat(cartMiddleware),
});

export const persistor = persistStore(store);
