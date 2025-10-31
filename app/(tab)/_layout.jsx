// app/(tabs)/_layout.jsx
import { Ionicons as Icon } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "@/redux/api";
import { setcancellationPolicies } from "@/redux/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { connectSocket } from "../../redux/socketSlice";
import { selectCurrentUser } from "../../redux/authReducer";
import { selectNotificationCount } from "../../redux/chatSlice";

const TabIcon = ({ iconName, color, name, focused, hasCount, count }) => (
  <View style={styles.tabContainer}>
    <Icon
      name={focused ? iconName : `${iconName}-outline`}
      size={22}
      color={color}
    />
    <Text style={[{ color }, styles.tabLabel]}>{name}</Text>
    {hasCount && count != 0 && (
      <View
        style={{
          width: 17,
          height: 17,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 100,
          backgroundColor: "black",
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <Text style={{ color: "white", fontSize: 11 }}>{count}</Text>
      </View>
    )}
  </View>
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userData = useSelector(selectCurrentUser);
  const notidicationCount = useSelector(selectNotificationCount);

  console.log("useData socket:", userData);

  useEffect(() => {
    dispatch(connectSocket(userData?.user?.id));
  }, []);

  return (
    <BottomSheetModalProvider>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#111827",
          tabBarInactiveTintColor: "#6b7280",
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "#f3f4f6",
            height: 50 + insets.bottom,
          },
          tabBarItemStyle: {
            height: 50,
            paddingTop: 15,
          },
        }}
      >
        {/* ---------- HOME ---------- */}
        <Tabs.Screen
          name="index"
          options={{
            title: t("home"),
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="home"
                color={color}
                name={t("home")}
                focused={focused}
              />
            ),
          }}
        />

        {/* ---------- SHOP ---------- */}
        <Tabs.Screen
          name="shop"
          options={{
            title: t("shop"),
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="search"
                color={color}
                name={t("shop")}
                focused={focused}
              />
            ),
          }}
        />

        {/* ---------- FAVORITES ---------- */}
        <Tabs.Screen
          name="favorites"
          options={{
            title: t("favorites"),
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="heart"
                color={color}
                name={t("favorites")}
                focused={focused}
              />
            ),
          }}
        />

        {/* ---------- PROFILE ---------- */}
        <Tabs.Screen
          name="profile"
          options={{
            title: t("profile"),
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="person"
                color={color}
                name={t("profile")}
                focused={focused}
              />
            ),
          }}
        />

        {/* ---------- INBOX ---------- */}
        <Tabs.Screen
          name="InboxTab"
          options={{
            title: t("inbox"),
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="chatbubble"
                color={color}
                name={t("inbox")}
                focused={focused}
                count={notidicationCount}
                hasCount={true}
              />
            ),
          }}
        />
      </Tabs>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    alignItems: "center",
    gap: 2,
    minWidth: 55,
    position: "relative",
    // borderWidth: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
  },
});
