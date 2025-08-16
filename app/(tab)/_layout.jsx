import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import Icons from "../../constants/icons";

const TabIcon = ({ icon, color, name, focused, badgeCount }) => {
  return (
    <View style={styles.tab_con}>
      <View style={styles.iconContainer}>
        <Image
          source={icon}
          resizeMode="contain"
          tintColor={color}
          style={styles.icon}
        />
        {badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
      </View>
      <Text
        style={{
          fontFamily: focused ? "Play" : "OpenSans",
          fontSize: 10,
          color: color,
          marginTop: 4,
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const { t, i18n } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#393381",
        tabBarInactiveTintColor: "#5A8581",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          height: 84,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={Icons.home}
              color={color}
              name={t("home")}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={Icons.shop}
              color={color}
              name={t("shop")}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="brand"
        options={{
          title: "Brand",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={Icons.play}
              color={color}
              name={t("brand")}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="order"
        options={{
          title: "Order",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={Icons.cart}
              color={color}
              name={t("cart")}
              focused={focused}
              badgeCount={totalQuantity}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={Icons.profile}
              color={color}
              name={t("profile")}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

const styles = StyleSheet.create({
  tab_con: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -13,
    backgroundColor: "red",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
