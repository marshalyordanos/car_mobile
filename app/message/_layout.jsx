import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import images from "../../constants/images";

function LogoTitle() {
  return <Image style={styles.image} source={{ uri: images.back }} />;
}

const AppLayout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="[booking_id]" options={{ headerShown: false }} />
      <Stack.Screen name="notification" options={{ headerShown: false }} />

      <Stack.Screen
        name="forget"
        options={{
          title: "",

          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
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
              <Ionicons name="arrow-back" size={35} color={Colors.dark} />
              <Text>Sign in</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="terms"
        options={{
          title: "Terms and Conditions",

          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
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
              <Ionicons name="arrow-back" size={35} color={Colors.dark} />
              <Text>Sign in</Text>
            </TouchableOpacity>
          ),
        }}
      />

      {/* <Stack.Screen name="index" options={{headerShown:false}}  /> */}
    </Stack>
  );
};

export default AppLayout;

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
