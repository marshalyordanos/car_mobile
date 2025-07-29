import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/cartReducer";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";


const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const language = useSelector((state) => state.auth.lan);
  const { t } = useTranslation();

  const BASE_URL = "https://api.kelatibeauty.com";

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onRemove(item.id, item.selectedVariants));
  };

  const renderVariant = (key, value) => {
    if (key.toLowerCase() === 'color') {
      const [colorName, colorValue] = value.split(':');
      return (
        <View key={key} style={styles.colorVariantContainer}>
          <Text style={styles.variantKey}>{key}:</Text>
          <View style={[styles.colorSwatch, { backgroundColor: colorValue }]}>
            <Text style={[styles.colorName, { color: isLightColor(colorValue) ? '#000' : '#fff' }]}>
              {colorName}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <Text key={key} style={styles.variantText}>
          {key}: {value}
        </Text>
      );
    }
  };

  const isLightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 155;
  };

  return (
    <Animated.View style={[styles.cartItem, { opacity: fadeAnim }]}>
      <Image source={{ uri: BASE_URL + item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>
          {language === "am"
            ? item.name?.split("*+*")[1]
            : item.name?.split("*+*")[0]}
        </Text>
        <Text style={styles.itemPrice}>
          {item.price} {t("birr")}
        </Text>
        {item.selectedVariants &&
          Object.entries(item.selectedVariants).map(([key, value]) => renderVariant(key, value))}
        <View style={styles.quantityControl}>
          <TouchableOpacity
            onPress={() =>
              onUpdateQuantity(
                item.id,
                item.selectedVariants,
                item.quantity - 1
              )
            }
          >
            <Ionicons name="remove-circle" size={28} color="#393381" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() =>
              onUpdateQuantity(
                item.id,
                item.selectedVariants,
                item.quantity + 1
              )
            }
          >
            <Ionicons name="add-circle" size={28} color="#393381" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={fadeOut}>
        <Ionicons name="close-circle" size={28} color="#FF6B6B" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const Cart = () => {
  const { items, totalQuantity, totalAmount } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const language = useSelector((state) => state.auth.lan);

  const handleRemoveItem = (id, selectedVariants) => {
    dispatch(removeFromCart({ id, selectedVariants }));
  };

  const handleUpdateQuantity = (id, selectedVariants, newQuantity) => {
    const item = items.find(
      (item) =>
        item.id === id &&
        JSON.stringify(item.selectedVariants) ===
          JSON.stringify(selectedVariants)
    );

    if (item && newQuantity > 0 && newQuantity <= item.availableStock) {
      dispatch(
        updateCartItemQuantity({ id, selectedVariants, quantity: newQuantity })
      );
    } else if (newQuantity > item.availableStock) {
      Alert.alert(
        "Insufficient Stock",
        `Sorry, only ${item.availableStock} items are available.`
      );
    }
  };

  const leftIcon = ({ navigation }) => (
    <TouchableOpacity
      style={styles.menuButton}
      onPress={() => navigation.goBack()}
    >
      <Ionicons
        name="arrow-back"
        size={24}
        color="#fff"
        style={styles.iconStyle}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <Header
          leftIcon={leftIcon}
          navigation={navigation}
          title={t("cart")}
          isShopScreen={false}
        />

        {items.length > 0 ? (
          <>
            <FlatList
              data={items}
              renderItem={({ item }) => (
                <CartItem
                  item={item}
                  onRemove={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                />
                
              )}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              contentContainerStyle={styles.listContainer}
            />
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>{t("total")}:</Text>
              <Text style={styles.totalAmount}>
                {totalAmount.toFixed(2)} {t("birr")}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate("Checkout")}
            >
              <Text style={styles.checkoutButtonText}>
                {t("checkout_items")} ({totalQuantity}
                {" " + t("items")})
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyCartContainer}>
            <Ionicons name="cart-outline" size={100} color="#393381" />
            <Text style={styles.emptyCartText}>{t("Your_cart_is_empty")}</Text>
            <TouchableOpacity
              style={styles.continueShopping}
              onPress={() => navigation.navigate("shop")}
            >
              <Text style={styles.continueShoppingText}>
                {t("continue_shopping")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#469E70",
  },
  listContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A5568",
    marginBottom: 4,
  },
  variantText: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 2,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 12,
    color: "#2D3748",
  },
  removeButton: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#393381",
  },
  checkoutButton: {
    backgroundColor: "#393381",
    paddingVertical: 16,
    borderRadius: 12,
    margin: 16,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#4A5568",
    marginTop: 16,
    marginBottom: 24,
  },
  continueShopping: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#393381",
    borderRadius: 8,
  },
  continueShoppingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  menuButton: {
    padding: 8,
  },
  iconStyle: {
    padding: 1,
  },
  colorVariantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  variantKey: {
    fontSize: 12,
    color: '#718096',
    marginRight: 4,
  },
  colorSwatch: {
    width: 40,
    height: 15,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    // color: "#fff"
  },
  colorName: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Cart;
