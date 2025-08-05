import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const CarCategotyCard = ({ car, onRent }) => {
  return (
    <View style={styles.card}>
      <Image source={car.image} style={styles.image} resizeMode="contain" />

      <Text style={styles.name}>{car.name}</Text>
    </View>
  );
};

export default CarCategotyCard;

const styles = StyleSheet.create({
  card: {
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginVertical: 10,
    height: 150,
    justifyContent: "space-between",
    alignItems: "center",

    // marginHorizontal: 16,
    // padding: 16,
  },
  image: {
    width: 70,
    height: 70,

    borderRadius: 100,
    backgroundColor: "#f4f4f4",
    objectFit: "cover",
    borderWidth: 1,
    borderTopWidth: 1,
    borderColor: "lightgray",
    marginTop: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e1e1e",
    marginBottom: 14,
  },
});
