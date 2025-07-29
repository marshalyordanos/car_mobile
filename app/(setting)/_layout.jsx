import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Stack, useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/native";

const SettingLayout = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation(); // Get navigation from hook

  return (
    <Stack>
      <Stack.Screen
        name="about"
        options={{
          title: t("about_us"),

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
      <Stack.Screen
        name="purchase-history"
        options={{
          title: t("purchase_history"),

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
      <Stack.Screen
        name="check-item"
        options={{
          title: t("check_item"),

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

      <Stack.Screen
        name="order-confirmation"
        options={{
          title: t("order_confirmation"),

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

      <Stack.Screen
        name="profile-detail"
        options={{
          title: t("detail"),

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

      <Stack.Screen
        name="track-order"
        options={{
          title: t("track_order"),

          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#469E70",
          },
          headerTitleStyle: {
            color: "white",
          },
          headerLeft: () => {
            const route = useRoute(); // Use the route hook to get params
            const { type } = route.params || {}; // Get the 'type' param

            return (
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
                onPress={() => {
                  const { type } = route?.params || {};
                  console.log("-----------", type);

                  // Navigate based on type
                  if (type === "shop") {
                    navigation.navigate("shop"); // Navigate to 'shop' if type is 'shop'
                  } else {
                    navigation.goBack(); // Default action: Go back
                  }
                }}
              >
                <Ionicons name="arrow-back" size={35} color={"white"} />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Stack.Screen
        name="contact"
        options={{
          title: t("contact_us"),
          headerTitleStyle: {
            color: "white",
          },

          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#469E70",
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
      <Stack.Screen
        name="address"
        options={{
          title: "Address",

          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#469E70",
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

export default SettingLayout;

const styles = StyleSheet.create({});
