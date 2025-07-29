import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const BASE_URL = "https://api.kelatibeauty.com/api/v1/";
// const BASE_URL = 'http://10.10.4.116:8000/api/v1/';

const CategoryItem = React.memo(
  ({ item, index, onSelectCategory, level, lan, t }) => {
    const scale = useSharedValue(1);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    const handlePress = () => {
      scale.value = withSpring(0.95, {}, () => {
        scale.value = withSpring(1);
      });
      onSelectCategory(
        item.id,
        lan == "am" ? item.name.split("*+*")[1] : item.name.split("*+*")[0],
        level
      );
    };

    return (
      <TouchableOpacity onPress={handlePress}>
        <Animated.View style={[animatedStyles, styles.categoryItemContainer]}>
          <View style={[styles.categoryItem, { marginLeft: index === 0 ? 20 : 0 }]}>
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image
                  source={{ uri: "https://api.kelatibeauty.com" + item.image }}
                  style={styles.categoryImage}
                />
              ) : (
                <Text style={styles.categoryInitial}>
                  {item.name.split("*+*")[0].charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            <Text style={styles.categoryName} numberOfLines={2}>
              {lan == "am"
                ? item.name.split("*+*")[1]
                : item.name.split("*+*")[0]}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }
);
const MainCategoryComponent = ({
  mainCategoryData,
  selectedMainCategory,
  selectedCategory,
  onSelectCategory,
}) => {
  const language = useSelector((state) => state.auth.lan);

  const { t, i18n } = useTranslation();

  const renderCategoryItem = ({ item, index }) => {
    return (
      <CategoryItem
        lan={language}
        t={t}
        item={item}
        index={index}
        onSelectCategory={handleCategorySelect}
        level={
          !selectedMainCategory
            ? "main"
            : !selectedCategory
            ? "category"
            : "subcategory"
        }
      />
    );
  };

  const getDisplayData = () => {
    if (!selectedMainCategory) {
      return mainCategoryData;
    }

    const selectedMainCategoryData = mainCategoryData.find(
      (cat) =>
        (language == "am"
          ? cat.name.split("*+*")[1]
          : cat.name.split("*+*")[0]) === selectedMainCategory
    );

    if (!selectedCategory && selectedMainCategoryData) {
      return selectedMainCategoryData.categories;
    }

    const selectedCategoryData = selectedMainCategoryData?.categories.find(
      (cat) =>
        (language == "am"
          ? cat.name.split("*+*")[1]
          : cat.name.split("*+*")[0]) === selectedCategory
    );

    if (selectedCategoryData) {
      return selectedCategoryData.sub_categories;
    }

    return [];
  };

  const handleCategorySelect = async (id, name, level) => {
    onSelectCategory(id, name, level);
  };

  const displayData = getDisplayData();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {selectedMainCategory
          ? selectedCategory
            ? `${selectedCategory} `
            : `${selectedMainCategory} `
          : t("shop_by_category")}
      </Text>
      <FlatList
        data={displayData}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    marginLeft: 20,
    color: "#333",
  },
  listContainer: {
    paddingRight: 20,
  },
  categoryItemContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItem: {
    width: 120,
    height: 160,
    borderRadius: 12,
    marginRight: 15,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryInitial: {
    color: "#333",
    fontSize: 28,
    fontWeight: "bold",
  },
  categoryName: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
});

export default MainCategoryComponent;