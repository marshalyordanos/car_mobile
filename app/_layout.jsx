import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Stack, SplashScreen, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import { initializeCart } from "../redux/cartReducer"; // Ensure you have this action

import "../localization";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { confLocale } from "../localization";
SplashScreen.preventAutoHideAsync();

const RootScreen = () => {
  const [fontsLoaded, error] = useFonts({
    OpenSans: require("../assets/fonts/OpenSans.ttf"),
    Play: require("../assets/fonts/Playwrite.ttf"),
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
          <Stack.Screen name="(setting)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(other)" options={{ headerShown: false }} />
          <Stack.Screen name="search" options={{ headerShown: false }} />

          <Stack.Screen name="detail" options={{ headerShown: false }} />
          <Stack.Screen name="cart" options={{ headerShown: false }} />
          <Stack.Screen
            name="Checkout"
            options={{
              title: t("checkout_items"),

              headerBackTitle: "",
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: "#469E70",
              },
              headerTitleStyle: {
                color: "white",
              },
              headerLeft: () => (
                <TouchableOpacity
                  style={{
                    display: "flex",
                    flexDirection: "row",

                    alignItems: "center",
                    gap: 5,
                  }}
                  onPress={router.back}
                >
                  <Ionicons name="arrow-back" size={35} color={"white"} />
                </TouchableOpacity>
              ),
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
