import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import images from "../../constants/images";

const EmptyState = ({ title, subtitle }) => {
  return (
    <View style={styles.con}>
      <Image style={styles.img} source={images.empty} />
      <Text style={{ fontSize: 17, color: "gray" }}>{title} </Text>
      <Text style={{ fontSize: 13, color: "gray" }}> {subtitle}</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  con: {
    width: "100%",
    // borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  img: {
    width: 250,
    height: 180,
    // borderWidth: 1,
    resizeMode: "contain",
  },
});
