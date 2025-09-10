import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./authReducer";
import carsReducer from "./carsSlice";
import categoryReducer from "./categoryReducer";
import favoritesReducer from "./favoritesSlice";
import filtersReducer from "./filtersSlice";
import vehicleOptionsReducer from "./vehicleOptionsSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  main_category: categoryReducer,
  cars: carsReducer,
  favorites: favoritesReducer,
  filters: filtersReducer,
  filterOptions: vehicleOptionsReducer,
});
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
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
