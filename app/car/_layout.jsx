import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import images from "../../constants/images";

function LogoTitle() {
  return <Image style={styles.image} source={{ uri: images.back }} />;
}

const CarLayout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{ headerShown: false }}

        // options={{
        //   title: "",
        //   headerBackTitle: "",
        //   headerShadowVisible: false,
        //   headerStyle: {
        //     backgroundColor: "white",
        //   },
        //   headerLeft: () => (
        //     <TouchableOpacity
        //       style={{
        //         display: "flex",
        //         flexDirection: "row",
        //         alignItems: "center",
        //         gap: 5,
        //       }}
        //       onPress={router.back}
        //     >
        //       <Ionicons name="arrow-back" size={35} color={Colors.dark} />
        //       <Text>Car</Text>
        //     </TouchableOpacity>
        //   ),
        // }}
      />

      {/* <Stack.Screen name="car-rental-detail" options={{ headerShown: false }} /> */}
      <Stack.Screen
        name="Checkout"
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
              <Text>Back</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default CarLayout;

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
