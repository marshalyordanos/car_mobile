import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Breadcrumbs = ({
  mainCategory,
  category,
  subcategory,
  onNavigate,
  lan,
  t,
}) => {
  const renderCrumb = (text, onPress, isLast) => (
    <>
      <Icon name="chevron-right" size={12} color="#666" style={styles.icon} />
      {isLast ? (
        <Text style={[styles.crumbText, styles.currentCrumb]}>{text}</Text>
      ) : (
        <TouchableOpacity onPress={onPress} style={styles.crumb}>
          <Text style={styles.crumbText}>{text}</Text>
        </TouchableOpacity>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onNavigate("main")} style={styles.crumb}>
        <Text style={styles.crumbText}>{t("shop")}</Text>
      </TouchableOpacity>
      {mainCategory &&
        renderCrumb(
          mainCategory,
          () => onNavigate("mainCategory", mainCategory),
          !category && !subcategory
        )}
      {category &&
        renderCrumb(
          category,
          () => onNavigate("category", category),
          !subcategory
        )}
      {subcategory && renderCrumb(subcategory, null, true)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    flexWrap: "wrap", // Added to handle long category names
  },
  crumb: {
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  crumbText: {
    fontSize: 14,
    color: "#393381",
  },
  currentCrumb: {
    fontWeight: "bold",
  },
  icon: {
    marginHorizontal: 5,
  },
});

export default Breadcrumbs;
