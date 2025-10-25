import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { confLocale } from "../localization"; // Explicitly import confLocale
import { persistor, store } from "../redux/store";

SplashScreen.preventAutoHideAsync();

const RootScreen = () => {
  const [fontsLoaded, error] = useFonts({
    OpenSans: require("../assets/fonts/OpenSans.ttf"),
    Play: require("../assets/fonts/Playwrite.ttf"),
    ...Ionicons.font,
  });
  const { t, i18n } = useTranslation();

  useEffect(() => {
    confLocale(); 
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Stack>
            <Stack.Screen name="(tab)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="car" options={{ headerShown: false }} />
            <Stack.Screen name="BookingDetail" options={{ headerShown: false }} />
            <Stack.Screen name="Booking" options={{ headerShown: false }} />
          
            <Stack.Screen name="message" options={{ headerShown: false }} />

            <Stack.Screen
              name="location-search"
              options={{
                headerShown: false,
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="DatePickerScreen"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="model-select"
              options={{ headerShown: false }}
            />
          </Stack>
          {/* <StatusBar barStyle="dark-content" /> */}
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default RootScreen;

const styles = StyleSheet.create({});
