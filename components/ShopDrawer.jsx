import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeInDown,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { t } from "i18next";

const BASE_URL = "https://api.kelatibeauty.com/api/v1/";
// const BASE_URL = 'http://10.10.4.116:8000/api/v1/';

const fetchCategories = async () => {
  try {
    const response = await fetch(
      BASE_URL +
        "main-categories/?page=1&pageSize=10&sort[column]=name&sort[order]=ascend&all=true"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const ShopSideDrawer = ({
  isVisible,
  onClose,
  onSelectContent,
  drawerOpacity,
  isDrawerContentLoaded,
  lan,
}) => {
  console.log("langu: ", lan);
  const [currentMainCategory, setCurrentMainCategory] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);

  const translateX = useSharedValue(-300);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(isVisible ? 0 : -350, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    opacity.value = withTiming(isVisible ? 1 : 0, { duration: 300 });
  }, [isVisible, drawerOpacity]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategoriesData(data);
    };
    loadCategories();
  }, []);

  // const handleSelectMainCategory = (mainCategory, mainCategoryId) => {
  //   setCurrentMainCategory(mainCategory);
  //   setCurrentCategory(null);
  // };

  const handleSelectAllProductsInMainCategory = async () => {
    onClose();

    if (currentMainCategory) {
      const mainCategoryData = categoriesData.find((mc) =>
        lan == "am"
          ? mc.name.split("*+*")[1]
          : mc.name.split("*+*")[0] === currentMainCategory
      );
      const mainCategoryId = mainCategoryData ? mainCategoryData.id : null;

      if (mainCategoryId) {
        try {
          const apiUrl =
            BASE_URL + `products/?page=1&main_category__id=${mainCategoryId}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          onSelectContent(
            currentMainCategory,
            null,
            null,
            data,
            null,
            null,
            mainCategoryId
          );
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    }
  };

  const handleSelectMainCategory = (mainCategory, mainCategoryId) => {
    setCurrentMainCategory(mainCategory);
    setCurrentCategory(null);
    // setIsLoading(true); // Trigger loading state in Shop component
    // onClose(); // Close the drawer immediately
    onSelectContent(mainCategory, null, null, [], mainCategoryId, null, null);
  };

  const handleSelectCategory = async (category, categoryId) => {
    setCurrentCategory(category);
    // setIsLoading(true); // Trigger loading state in Shop component
    onClose(); // Close the drawer immediately
    onSelectContent(
      currentMainCategory,
      category,
      null,
      [],
      categoryId,
      null,
      null
    );
  };

  // const handleSelectSubcategory = async (subcategory, subcategoryId) => {
  //   // setIsLoading(true); // Trigger loading state in Shop component
  //   onClose(); // Close the drawer immediately
  //   onSelectContent(currentMainCategory, currentCategory, subcategory, [], null, subcategoryId, null);
  // };

  const handleSelectSubcategory = async (subcategory, subcategoryId) => {
    setCurrentCategory(subcategory);
    onClose();
    onSelectContent(
      currentMainCategory,
      currentCategory,
      subcategory,
      [],
      null,
      subcategoryId,
      null
    );
  };

  const renderMainCategories = () => (
    <View style={styles.categoryContainer}>
      {categoriesData.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.mainCategoryItem}
          onPress={() =>
            handleSelectMainCategory(
              lan == "am"
                ? category.name.split("*+*")[1]
                : category.name.split("*+*")[0],
              category.id
            )
          }
        >
          <Image
            source={{ uri: `https://api.kelatibeauty.com${category.image}` }}
            style={styles.categoryImage}
          />
          <Text style={styles.mainCategoryText}>
            {lan == "am"
              ? category.name.split("*+*")[1]
              : category.name.split("*+*")[0]}
          </Text>
          <Icon name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSubcategories = () => {
    const mainCategoryData = categoriesData.find((mc) =>
      lan == "am"
        ? mc.name.split("*+*")[1]
        : mc.name.split("*+*")[0] === currentMainCategory
    );

    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          onPress={() => handleSelectMainCategory(null)}
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={20} color="#000" />
          <Text style={styles.backButtonText}>{t("back_to_categories")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSelectAllProductsInMainCategory}
          style={styles.allProductsButton}
        >
          <Text style={styles.allProductsButtonText}>
            <Text style={styles.crumbText}>{t("all") + " "}</Text>
            {currentMainCategory}
          </Text>
          <Icon name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

        {mainCategoryData &&
          mainCategoryData.categories.map((category) => (
            <Animated.View
              key={category.id}
              entering={FadeInDown.duration(300)}
            >
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() =>
                  handleSelectCategory(
                    lan == "am"
                      ? category.name.split("*+*")[1]
                      : category.name.split("*+*")[0],
                    category.id
                  )
                }
              >
                <Text style={styles.categoryText}>
                  {lan == "am"
                    ? category.name.split("*+*")[1]
                    : category.name.split("*+*")[0]}
                </Text>
                <Icon name="chevron-down" size={20} color="#000" />
              </TouchableOpacity>

              {category.sub_categories.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.subcategoryItem}
                  onPress={() =>
                    handleSelectSubcategory(
                      lan == "am"
                        ? item.name.split("*+*")[1]
                        : item.name.split("*+*")[0],
                      item.id
                    )
                  }
                >
                  <Text style={styles.subcategoryText}>
                    {lan == "am"
                      ? item.name.split("*+*")[1]
                      : item.name.split("*+*")[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          ))}
      </View>
    );
  };
  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="dark" />
      <LinearGradient
        colors={["#fff", "#fff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.content}
      >
        {!isDrawerContentLoaded && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="black" />
          </View>
        )}
        {isDrawerContentLoaded && (
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{t("categories")}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon name="close" size={28} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {currentMainCategory
                ? renderSubcategories()
                : renderMainCategories()}
            </ScrollView>
          </>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "85%",
    maxWidth: 350,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },
  closeButton: {
    padding: 8,
  },
  categoryContainer: {
    padding: 15,
    // backgroundColor: "red",
  },
  mainCategoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  mainCategoryText: {
    flex: 1,
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },
  subcategoryItem: {
    paddingVertical: 12,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  subcategoryText: {
    fontSize: 16,
    color: "rgba(26, 25, 25, 0.8)",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: "#000",
    marginLeft: 10,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },
  allProductsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    marginBottom: 10,
  },
  allProductsButtonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShopSideDrawer;
