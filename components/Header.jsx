import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";

const Header = ({ navigation, title, isShopScreen, leftIcon }) => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  return (
    <View style={{ zIndex: 0 }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LinearGradient colors={["#469E70", "#469E70"]} style={styles.header}>
        {leftIcon({ navigation })}
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("cart")}
        >
          <Icon name="shopping-cart" size={24} color="#fff" />
          {totalQuantity > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalQuantity}</Text>
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    // paddingTop: Platform.OS === "ios" ? 50 : 30, // Adjust for iOS status bar
  },
  menuButton: {
    padding: 8,
  },
  iconStyle: {
    padding: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  cartButton: {
    padding: 8,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Header;
