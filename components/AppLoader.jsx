import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";

const AppLoader = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.con]}>
      <ActivityIndicator
        size="large"
        color="#393381"
        style={styles.loadingMore}
      />
    </View>
  );
};

export default AppLoader;

const styles = StyleSheet.create({
  con: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});
