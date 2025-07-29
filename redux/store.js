import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from "./authReducer";
import categoryReducer from "./categoryReducer";
import cartReducer, { cartMiddleware } from "./cartReducer";

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['cart'], // only cart will be persisted
};

// Create persisted reducers
const persistedCartReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    main_category: categoryReducer,
    cart: persistedCartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(cartMiddleware),
});




export const persistor = persistStore(store);