import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { selectMap } from "../redux/authReducer";
import { useTranslation } from "react-i18next";
const App = () => {
  const { t, i18n } = useTranslation();
  const x = useSelector(selectMap);
  console.log("=============", x);
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View style={styles.container}>
          <Text>{t("welcome")}</Text>
          <Link href={"/home"}> go to ss</Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 4,
  },
  text: {
    fontFamily: "Play",
  },
});
