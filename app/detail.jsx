import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
  Animated,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { addToCart } from "../redux/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { removeHTMLTags } from "../utils/TextFunction";
import { useTranslation } from "react-i18next";
const { width } = Dimensions.get("window");

const CustomAccordion = ({ header, content, style }) => {
  const [expanded, setExpanded] = useState(false);
  const animationHeight = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.timing(animationHeight, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={[styles.accordionContainer, style]}>
      <TouchableOpacity onPress={toggleExpand} style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>{header}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#393381"
        />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.accordionContent,
          {
            maxHeight: animationHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 500],
            }),
            opacity: animationHeight,
          },
        ]}
      >
        {content}
      </Animated.View>
    </View>
  );
};

const ProductDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const productId = route.params?.productId;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedCombination, setSelectedCombination] = useState(null);

  const [animating, setAnimating] = useState(false);
  const animatedValue = useRef(new Animated.ValueXY()).current;
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  const notificationOpacity = useRef(new Animated.Value(0)).current;
  const [hasAvailableStock, setHasAvailableStock] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const [selectedSku, setSelectedSku] = useState(null);

  const BASE_URL = "https://api.kelatibeauty.com/api/v1/products/";

  const scrollY = useRef(new Animated.Value(0)).current;

  const language = useSelector((state) => state.auth.lan);

  const { t, i18n } = useTranslation();
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    if (product && product.product_combinations) {
      const newSelectedCombination = product.product_combinations.find(
        (combination) => {
          return Object.entries(selectedVariants).every(([key, value]) => {
            return combination.combination_string.includes(`${key}=${value}`);
          });
        }
      );

      setSelectedCombination(newSelectedCombination);
      setCurrentImage(newSelectedCombination?.image || product.image);
      setSelectedSku(newSelectedCombination?.sku || null);

      // Check if any combination has stock
      const hasStock = product.product_combinations.some(
        (combo) => combo.available_stock > 0
      );
      setHasAvailableStock(hasStock);
    }
  }, [product, selectedVariants]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(BASE_URL + productId);
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      const data = await response.json();
      setProduct(data);
      setLoading(false);

      if (data.product_variation_options) {
        const initialVariants = {};
        data.product_variation_options.forEach((variation) => {
          const inStockOption = variation.product_variation_options_values.find(
            (option) =>
              data.product_combinations.some(
                (combination) =>
                  combination.combination_string.includes(
                    `${variation.variation_name}=${option.variation_name}`
                  ) && combination.available_stock > 0
              )
          );
          if (inStockOption) {
            initialVariants[variation.variation_name] =
              inStockOption.variation_name;
          }
        });
        setSelectedVariants(initialVariants);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleImageScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setCurrentImageIndex(newIndex);
  };

  const handleVariantChange = (variationName, value) => {
    setSelectedVariants((prevVariants) => ({
      ...prevVariants,
      [variationName]: value,
    }));
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  const handleAddToCart = () => {
    if (!product) {
      console.log("No product data");
      return;
    }

    if (!selectedCombination) {
      Alert.alert(
        "Selection Required",
        "Please select all product options before adding to cart."
      );
      return;
    }

    const availableStock = selectedCombination.available_stock;

    // Check if the item is already in the cart
    const existingCartItem = cartItems.find(
      (item) =>
        item.id === product.id &&
        JSON.stringify(item.selectedVariants) ===
          JSON.stringify(selectedVariants)
    );

    const currentCartQuantity = existingCartItem
      ? existingCartItem.quantity
      : 0;
    const totalQuantity = currentCartQuantity + quantity;

    if (totalQuantity > availableStock) {
      Alert.alert(
        "Insufficient Stock",
        `Sorry, only ${
          availableStock - currentCartQuantity
        } more items are available.`
      );
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      image: currentImage,
      price: selectedCombination.price,
      selectedVariants: { ...selectedVariants },
      quantity: quantity,
      availableStock: availableStock,
      combinationId: selectedCombination.id,
    };

    dispatch(addToCart(cartItem));

    // Animation and notification
    animateAddToCart();
    showAddToCartNotification();

    // Optional: Reset quantity to 1 after adding to cart
    setQuantity(1);

    // Optional: Show a success message
    Alert.alert("Success", "Item added to cart successfully!");
  };

  const animateAddToCart = () => {
    setAnimating(true);
    animatedValue.setValue({ x: 0, y: 0 });
    animatedScale.setValue(1);
    animatedOpacity.setValue(1);

    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: { x: width - 60, y: -300 },
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(animatedScale, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setAnimating(false);
    });
  };

  const showAddToCartNotification = () => {
    setShowNotification(true);
    Animated.sequence([
      Animated.timing(notificationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(notificationOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowNotification(false));
  };

  const renderVariantButtons = (variation) => {
    return (
      <View key={variation.id} style={styles.variantContainer}>
        <Text style={styles.variantTitle}>{variation.variation_name}:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {variation.product_variation_options_values.map((option) => {
            const isColor = variation.variation_name.toLowerCase() === "color";
            const isSize = variation.variation_name.toLowerCase() === "size";
  
            // Extract colorValue if this is a color variation
            const colorValue = isColor ? option.variation_name.split(":")[1] : null;
  
            // Display size with unit if this is a size variation
            const displayValue = isSize
              ? `${option.variation_name} ${product.product_size_unit || ''}`
              : option.variation_name;
  
            // Check if this option has stock
            const hasStock = product.product_combinations.some(
              (combination) =>
                combination.combination_string.includes(
                  `${variation.variation_name}=${option.variation_name}`
                ) && combination.available_stock > 0
            );
  
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.variantButton,
                  selectedVariants[variation.variation_name] ===
                    option.variation_name && styles.selectedVariantButton,
                  isColor && colorValue && { backgroundColor: colorValue },
                  !hasStock && styles.outOfStockButton,
                ]}
                onPress={() =>
                  hasStock &&
                  handleVariantChange(
                    variation.variation_name,
                    option.variation_name
                  )
                }
                disabled={!hasStock}
              >
                <Text
                  style={[
                    styles.variantButtonText,
                    selectedVariants[variation.variation_name] ===
                      option.variation_name && styles.selectedVariantButtonText,
                    isColor && { color: colorValue ? "#fff" : "#000" },
                    !hasStock && styles.outOfStockButtonText,
                  ]}
                >
                  {displayValue}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };
  
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || "Product information not available."}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          title="Product Detail"
          isShopScreen={false}
        />

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: `https://api.kelatibeauty.com${
                  currentImage || product?.image
                }`,
              }}
              style={styles.productImage}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.productName}>
              {language === "am"
                ? product.name.split("*+*")[1]
                : product.name.split("*+*")[0]}
            </Text>

            <View style={styles.priceContainer}>
              <Text style={styles.productPrice}>
                {selectedCombination
                  ? `${selectedCombination.price} ${t("birr")}`
                  : product.price
                  ? `${product.price} ${t("birr")}`
                  : "Price not available"}
              </Text>
            </View>

            {selectedSku && (
              <View style={styles.skuContainer}>
                <Text style={styles.skuLabel}>SKU:</Text>
                <Text style={styles.skuValue}>{selectedSku}</Text>
              </View>
            )}

            {product.product_variation_options.map(renderVariantButtons)}

            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(-1)}
                >
                  <Icon name="remove" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  disabled={selectedCombination?.available_stock <= quantity}
                  onPress={() => handleQuantityChange(1)}
                >
                  <Icon
                    name="add"
                    size={24}
                    color={
                      selectedCombination?.available_stock <= quantity
                        ? "lightgray"
                        : "black"
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.accordionSection}>
              <CustomAccordion
                header="Product Details"
                content={
                  <Text style={styles.accordionContentText}>
                    {removeHTMLTags(
                      language == "am"
                        ? product.description?.split("*+*")[1]
                        : product.description?.split("*+*")[0]
                    ) || "No description available."}
                  </Text>
                }
              />
              <CustomAccordion
                header="How to Use"
                content={
                  <Text style={styles.accordionContentText}>
                    {removeHTMLTags(
                      language == "am"
                        ? product.how_to_use?.split("*+*")[1]
                        : product.how_to_use?.split("*+*")[0]
                    ) || "No instructions available."}
                  </Text>
                }
              />
              <CustomAccordion
                header="Ingredients"
                content={
                  <Text style={styles.accordionContentText}>
                    {removeHTMLTags(
                      product.how_to_use?.split("*+*")[0]
                        ? product.ingredients?.split("*+*")[1]
                        : product.ingredients?.split("*+*")[0]
                    ) || "No ingredients available."}
                  </Text>
                }
              />
            </View>
          </View>
        </Animated.ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              (!hasAvailableStock ||
                (selectedCombination &&
                  selectedCombination.available_stock === 0)) &&
                styles.disabledButton,
            ]}
            onPress={handleAddToCart}
            disabled={
              !hasAvailableStock ||
              (selectedCombination && selectedCombination.available_stock === 0)
            }
          >
            <Icon
              name="cart-outline"
              size={24}
              color="#fff"
              style={styles.cartIcon}
            />
            <Text style={styles.addToCartButtonText}>
              {!hasAvailableStock
                ? "Out of Stock"
                : selectedCombination &&
                  selectedCombination.available_stock === 0
                ? "Select Available Option"
                : t("add_to_art")}
            </Text>
          </TouchableOpacity>
        </View>

        {animating && (
          <Animated.Image
            source={{ uri: `https://api.kelatibeauty.com${product.image}` }}
            style={[
              styles.flyingImage,
              {
                transform: [
                  { translateX: animatedValue.x },
                  { translateY: animatedValue.y },
                  { scale: animatedScale },
                ],
                opacity: animatedOpacity,
              },
            ]}
          />
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
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingTop: StatusBar.currentHeight + 10,
    zIndex: 10,
  },
  headerButton: {
    padding: 5,
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: width,
    height: width,
    resizeMode: "cover",
  },
  imageIndicator: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 3,
  },
  activeIndicatorDot: {
    backgroundColor: "#fff",
  },
  infoContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  variantContainer: {
    marginBottom: 20,
  },
  variantTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  variantButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
  },
  selectedVariantButton: {
    backgroundColor: "#393381", // Changed from '#000' to match the primary color
    borderColor: "#393381",
  },
  variantButtonText: {
    fontSize: 14,
    color: "#000",
  },
  selectedVariantButtonText: {
    color: "#fff",
  },
  accordionSection: {
    marginTop: 20,
  },
  accordionContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f8f8f8",
  },
  accordionHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  accordionContent: {
    padding: 15,
    backgroundColor: "#fff",
  },
  accordionContentText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addToCartButton: {
    // backgroundColor: '#000',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: "#393381",
  },
  cartIcon: {
    marginRight: 10,
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    // backgroundColor: '#393381',
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    padding: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 15,
  },
  notification: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationIcon: {
    marginRight: 10,
  },
  notificationText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  iconStyle: {
    padding: 1,
  },
  flyingImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    position: "absolute",
    top: 300,
    left: 20,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  variantButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    minWidth: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedVariantButton: {
    backgroundColor: "#393381",
    borderColor: "#393381",
  },
  variantButtonText: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
  },
  selectedVariantButtonText: {
    color: "#fff",
  },
  skuContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  skuLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 5,
  },
  skuValue: {
    fontSize: 14,
    color: "#666",
  },
  outOfStockButton: {
    opacity: 0.5,
    borderColor: "#ccc",
  },
  outOfStockButtonText: {
    color: "#999",
  },
});

export default ProductDetail;
