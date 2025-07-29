import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import images from "../../constants/images";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

function LogoTitle() {
  return <Image style={styles.image} source={{ uri: images.back }} />;
}

const AppLayout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="[query]"
        options={{
          title: "Products",

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
