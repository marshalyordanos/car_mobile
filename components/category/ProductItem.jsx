import React, { memo, useState, useEffect } from "react";
import { TouchableOpacity, Image, Text, View, StyleSheet, Modal, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { addToCart } from "../../redux/cartReducer";

import { Ionicons } from "react-native-vector-icons";

import Icon from "react-native-vector-icons/FontAwesome";

const ProductItem = memo(({ item }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.auth.lan);
  const { t } = useTranslation();
console.log("==========item======", item)
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedCombination, setSelectedCombination] = useState(null);
  const [currentImage, setCurrentImage] = useState(item.image);

  useEffect(() => {
    if (item.product_variation_options) {
      const initialVariants = {};
      item.product_variation_options.forEach((variation) => {
        const inStockOption = variation.product_variation_options_values.find(option => 
          item.product_combinations.some(combination => 
            combination.combination_string.includes(`${variation.variation_name}=${option.variation_name}`) 
            && combination.available_stock > 0
          )
        );
        if (inStockOption) {
          initialVariants[variation.variation_name] = inStockOption.variation_name;
        }
      });
      setSelectedVariants(initialVariants);
    }
  }, [item]);

  useEffect(() => {
    if (item.product_combinations) {
      const newSelectedCombination = item.product_combinations.find(
        (combination) => {
          return Object.entries(selectedVariants).every(([key, value]) => {
            return combination.combination_string.includes(`${key}=${value}`);
          });
        }
      );

      setSelectedCombination(newSelectedCombination);
      setCurrentImage(newSelectedCombination?.image || item.image);
    }
  }, [item, selectedVariants]);

  const handleVariantChange = (variationName, value) => {
    setSelectedVariants((prevVariants) => ({
      ...prevVariants,
      [variationName]: value,
    }));
  };

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  const handleAddToCart = () => {
    if (!selectedCombination) {
      Alert.alert(
        "Selection Required",
        "Please select all product options before adding to cart."
      );
      return;
    }

    const availableStock = selectedCombination.available_stock;

    if (quantity > availableStock) {
      Alert.alert(
        "Insufficient Stock",
        `Sorry, only ${availableStock} items are available.`
      );
      return;
    }
    console.log("======combination id=====", selectedCombination.id)
    const cartItem = {
      id: item.id,
      name: item.name,
      image: currentImage,
      price: selectedCombination.price,
      selectedVariants: { ...selectedVariants },
      quantity: quantity,
      availableStock: availableStock,
      combinationId: selectedCombination.id, // Add this line
    };

    dispatch(addToCart(cartItem));
    Alert.alert("Success", "Item added to cart successfully!");
    setModalVisible(false);
  };

  const renderVariantButtons = (variation) => {
    return (
      <View key={variation.id} style={styles.variantContainer}>
        <Text style={styles.variantTitle}>{variation.variation_name}:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {variation.product_variation_options_values.map((option) => {
            const [colorName, colorValue] = option.variation_name.split(':');
            const isColor = variation.variation_name.toLowerCase() === 'color';
            
            // Check if this option has stock
            const hasStock = item.product_combinations.some(combination => 
              combination.combination_string.includes(`${variation.variation_name}=${option.variation_name}`) 
              && combination.available_stock > 0
            );
  
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.variantButton,
                  selectedVariants[variation.variation_name] === option.variation_name && styles.selectedVariantButton,
                  isColor && colorValue && { backgroundColor: colorValue },
                  !hasStock && styles.outOfStockButton
                ]}
                onPress={() => hasStock && handleVariantChange(variation.variation_name, option.variation_name)}
                disabled={!hasStock}
              >
                <Text
                  style={[
                    styles.variantButtonText,
                    selectedVariants[variation.variation_name] === option.variation_name && styles.selectedVariantButtonText,
                    isColor && { color: colorValue ? '#fff' : '#000' },
                    !hasStock && styles.outOfStockButtonText
                  ]}
                >
                  {isColor ? colorName : option.variation_name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const imageUrl = `https://api.kelatibeauty.com${currentImage}`;

  return (
    <View style={styles.productItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate("detail", { productId: item.id })}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {language === "am"
              ? item.name.split("*+*")[1]
              : item.name.split("*+*")[0]}
          </Text>
          <Text style={styles.productBrand}>
            {language === "am"
              ? item.brand.name.split("*+*")[1]
              : item.brand.name.split("*+*")[0]}
          </Text>
          {selectedCombination && (
            <Text style={styles.productPrice}>
              {`${selectedCombination.price} ${t("birr")}`}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addToCartButton}
      >
        <Icon name="shopping-cart" size={20} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <ScrollView>
              <Image
                source={{ uri: imageUrl }}
                style={styles.modalProductImage}
                resizeMode="cover"
              />
              <Text style={styles.modalProductName}>
                {language === "am"
                  ? item.name.split("*+*")[1]
                  : item.name.split("*+*")[0]}
              </Text>
              { item.product_variation_options.map(renderVariantButtons)}
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Quantity:</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(-1)}
                  >
                    <Icon name="minus" size={16} color="#000" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(1)}
                  >
                    <Icon name="plus" size={16} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
              {selectedCombination && (
                <Text style={styles.modalProductPrice}>
                  {`${selectedCombination.price} ${t("birr")}`}
                </Text>
              )}
              <TouchableOpacity
              style={[
                styles.modalAddToCartButton,
                (!selectedCombination || selectedCombination.available_stock === 0) &&
                  styles.disabledButton,
              ]}
              onPress={handleAddToCart}
              disabled={!selectedCombination || selectedCombination.available_stock === 0}
            >
              <Ionicons
               name="cart-outline"
               size={24} 
               color="#fff" 
               style={styles.cartIcon}
                />
                
              <Text style={styles.modalAddToCartButtonText}>
                {!selectedCombination || selectedCombination.available_stock === 0
                  ? "Select Available Option"
                  : t("add_to_art")}
              </Text>
            </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  productItem: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  addToCartButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#393381",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalProductImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalProductName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalProductPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  variantContainer: {
    marginBottom: 10,
  },
  variantTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
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
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  modalAddToCartButton: {
    backgroundColor: "#393381",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  modalAddToCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalAddToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: "#393381",
  },
  modalAddToCartButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cartIcon: {
    marginRight: 10,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  outOfStockButton: {
    opacity: 0.5,
    borderColor: '#ccc',
  },
  outOfStockButtonText: {
    color: '#999',
  },
});

export default ProductItem;