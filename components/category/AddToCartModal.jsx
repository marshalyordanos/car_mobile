import React, { useState } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartReducer';
import { useTranslation } from "react-i18next";

const AddToCartModal = ({ isVisible, onClose, item, language }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...item, quantity }));
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image
            source={{ uri: `https://api.kelatibeauty.com${item.image}` }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <Text style={styles.productName}>
            {language === "am" ? item.name.split("*+*")[1] : item.name.split("*+*")[0]}
          </Text>
          <Text style={styles.productBrand}>
            {language === "am" ? item.brand.name.split("*+*")[1] : item.brand.name.split("*+*")[0]}
          </Text>
          {item.product_combinations && item.product_combinations.length > 0 && (
            <Text style={styles.productPrice}>
              {`${item.product_combinations[0].price} ${t("currency")}`}
            </Text>
          )}
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Text style={styles.quantityButton}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
              <Text style={styles.quantityButton}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productBrand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#393381',
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#393381',
    paddingHorizontal: 10,
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#393381',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: '#393381',
    fontSize: 16,
  },
});

export default AddToCartModal;