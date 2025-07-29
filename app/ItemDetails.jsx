import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from "react-native-vector-icons/Ionicons";
import { addToCart } from "../redux/cartReducer";
import { Ionicons } from "@expo/vector-icons";
import { removeHTMLTags } from "../utils/TextFunction";
import { useTranslation } from "react-i18next";

const ItemDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const itemData = route?.params?.itemData || {};
  const [quantity, setQuantity] = useState(1);
  const language = useSelector((state) => state.auth.lan);
  const { t } = useTranslation();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (itemData && itemData.product) {
      setProduct(itemData.product);
    }
  }, [itemData]);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No product data available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: itemData.price,
      selectedVariants: {}, // Add selected variants if applicable
      quantity: quantity,
      availableStock: itemData.available_stock,
      combinationId: itemData.id,
    };

    dispatch(addToCart(cartItem));
    // Optionally, show a success message or navigate to cart
  };

  const CustomAccordion = ({ header, content }) => {
    const [expanded, setExpanded] = useState(false);
  
    return (
      <View style={styles.accordionContainer}>
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.accordionHeader}>
          <Text style={styles.accordionHeaderText}>{header}</Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#393381"
          />
        </TouchableOpacity>
        {expanded && (
          <View style={styles.accordionContent}>
            <Text>{removeHTMLTags(content)}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#393381" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Product Detail</Text>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <Image 
            source={{ uri: `https://api.kelatibeauty.com${product.image}` }} 
            style={styles.productImage} 
          />

          <View style={styles.infoContainer}>
            <Text style={styles.productName}>
              {language === "am" ? product.name.split("*+*")[1] : product.name.split("*+*")[0]}
            </Text>

            <View style={styles.priceContainer}>
              <Text style={styles.productPrice}>
                {`${itemData.price} ${t("birr")}`}
              </Text>
            </View>

            <Text style={styles.skuText}>SKU: {itemData.sku || 'N/A'}</Text>

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
                  onPress={() => handleQuantityChange(1)}
                >
                  <Icon name="add" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.accordionSection}>
              <CustomAccordion
                header="Product Details"
                content={language === "am" ? product.description?.split("*+*")[1] : product.description?.split("*+*")[0]}
              />
              <CustomAccordion
                header="How to Use"
                content={language === "am" ? product.how_to_use?.split("*+*")[1] : product.how_to_use?.split("*+*")[0]}
              />
              <CustomAccordion
                header="Ingredients"
                content={language === "am" ? product.ingredients?.split("*+*")[1] : product.ingredients?.split("*+*")[0]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Icon name="cart-outline" size={24} color="#fff" style={styles.cartIcon} />
          <Text style={styles.addToCartButtonText}>{t("add_to_cart")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#393381',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: StatusBar.currentHeight + 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priceContainer: {
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#393381',
  },
  skuText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  accordionSection: {
    marginTop: 20,
  },
  accordionContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  accordionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accordionContent: {
    padding: 15,
    backgroundColor: '#fff',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addToCartButton: {
    backgroundColor: '#393381',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  cartIcon: {
    marginRight: 10,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
  },
});

export default ItemDetails;