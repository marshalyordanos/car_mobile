import { Ionicons as Icon } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

const TabIcon = ({ iconName, color, name, focused }) => {
  return (
    <View style={styles.tabContainer}>
      <Icon
        name={focused ? iconName : `${iconName}-outline`}
        size={22}
        color={color}
      />
      <Text style={[{ color }, styles.tabLabel]}>{name}</Text>
    </View>
  );
};

const TabLayout = () => {
  const { t, i18n } = useTranslation();

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
            paddingBottom: 5,
            height: 60,
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
                iconName="home"
                color={color}
                name={"Home"}
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
                iconName="search"
                color={color}
                name={"Search"}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="heart"
                color={color}
                name={"Favorites"}
                focused={focused}
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
                iconName="person"
                color={color}
                name={"Profile"}
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
                iconName="play-circle"
                color={color}
                name={"Brand"}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </BottomSheetModalProvider>
  );
};

export default TabLayout;

const styles = StyleSheet.create({
  tabContainer: {
    alignItems: "center",
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
});
