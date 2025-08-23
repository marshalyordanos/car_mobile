import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { initializeCart } from "../redux/cartReducer"; // Ensure you have this action
import { persistor, store } from "../redux/store";

import "../localization";

import { useTranslation } from "react-i18next";
SplashScreen.preventAutoHideAsync();

const RootScreen = () => {
  const [fontsLoaded, error] = useFonts({
    OpenSans: require("../assets/fonts/OpenSans.ttf"),
    Play: require("../assets/fonts/Playwrite.ttf"),
    ...Ionicons.font,
  });
  const router = useRouter();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // confLocale();
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    // This will log the state on every update
    initializeCart();

    // console.log('Store updated:', store.getState());
  }, [store]);

  useEffect(() => {
    initializeCart();
  }, []);

  if (!fontsLoaded && !error) return null;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack>
          <Stack.Screen name="(tab)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="LocationSearchScreen"
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
        </Stack>
        <StatusBar barStyle="dark-content" />
      </PersistGate>
    </Provider>
  );
};

export default RootScreen;

const styles = StyleSheet.create({});
