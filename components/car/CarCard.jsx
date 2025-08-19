import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome as Icon } from '@expo/vector-icons';

const CarCard = ({ car, onRent }) => {
  return (
    <View style={styles.card}>
      <Image source={car.image} style={styles.image} resizeMode="contain" />

      <View style={styles.info}>
        <View>
          <Text style={styles.name}>{car.name}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 10,
          }}
        >
          <View>
            <Text style={styles.brand}>{car.brand}</Text>

            <Text style={styles.price}>{car.price.toLocaleString()} ETB</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => onRent(car)}>
            {/* <Text style={styles.buttonText}>Rent</Text> */}
            {/* <Image /> */}
            <Icon name="shopping-cart" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CarCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    marginVertical: 10,

    // marginHorizontal: 16,
    // padding: 16,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
    objectFit: "cover",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: "lightgray",
  },
  info: {
    paddingHorizontal: 8,
    marginTop: 6,
    // flexDirection: "row",
    // justifyContent: "space-between",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e1e1e",
  },
  brand: {
    fontSize: 14,
    color: "#777",
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2ecc71",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#393381",
    paddingVertical: 10,
    // borderRadius: 10,
    // alignItems: "center",
    paddingHorizontal: 10,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
