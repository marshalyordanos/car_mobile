import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux"; // Add this import

import Header from "../../components/Header";
// import ProductDetail from '../../components/category/ProductDetail';
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { View } from "react-native-animatable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CarCard from "../../components/car/CarCard";
import CarCategotyCard from "../../components/car/CarCategoryCard";
import images from "../../constants/images";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 10) / 2;

const cars = [
  { id: 1, name: "Model S", price: 79999, brand: "Tesla", image: images.car1 },
  { id: 2, name: "Civic", price: 22000, brand: "Honda", image: images.car2 },
  { id: 3, name: "Mustang", price: 35000, brand: "Ford", image: images.car3 },
  { id: 4, name: "Corolla", price: 19000, brand: "Toyota", image: images.van1 },
  { id: 5, name: "A4", price: 40000, brand: "Audi", image: images.car1 },
  { id: 6, name: "Camry", price: 24000, brand: "Toyota", image: images.car2 },
];
const Shop = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [areFiltersVisible, setAreFiltersVisible] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isDrawerContentLoaded, setIsDrawerContentLoaded] = useState(false); // Add this line
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isCatsLoading, setIsCatssLoading] = useState(false);
  const [breadCrumbTexts, setBreadCrumbTexts] = useState({
    main: null,
    category: null,
    subcategory: null,
  });
  const [isLodding, setLodding] = useState(false);
  const [isLOadMOre, setLoadMore] = useState(false);

  const [lastLoad, setLastLoad] = useState(false);

  const navigation = useNavigation();

  const drawerOpacity = useRef(new Animated.Value(0)).current;

  const route = useRoute();
  const insets = useSafeAreaInsets();

  const leftIcon = ({ navigation }) => (
    <TouchableOpacity
      style={styles.menuButton}
      // onPress={toggleDrawer}
    >
      <Icon name="bars" size={24} color="#fff" style={styles.iconStyle} />
    </TouchableOpacity>
  );
  const language = useSelector((state) => state.auth.lan);

  const { t, i18n } = useTranslation();

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <CarCard
        car={item}
        onRent={(car) => {
          console.log("Renting car:", car.name);
        }}
      />
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: "#469E70",
        height: "100%",
      }}
    >
      <View
        style={{
          marginTop: insets.top,
          flex: 1,
          backgroundColor: "white",
        }}
      >
        {" "}
        <StatusBar style="light" />
        <Header
          leftIcon={leftIcon}
          navigation={navigation}
          title={t("shop")}
          isShopScreen={true}
        />
        <View>
          <View style={styles.topMenu}>
            <Text>Shop</Text>
          </View>

          <View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                marginBottom: 15,
                marginLeft: 20,
                color: "#333",
              }}
            >
              Shop by Category
            </Text>
            <FlatList
              data={cars}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                return (
                  <View key={item.id}>
                    <CarCategotyCard
                      car={item}
                      onRent={() => console.log("rent")}
                    />
                  </View>
                );
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            />
          </View>

          <View style={styles.filterContainer}>
            <Text style={styles.resultCount}>
              {totalCount} {totalCount !== 1 ? t("results") : t("result")}
            </Text>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setAreFiltersVisible(!areFiltersVisible)}
            >
              <Icon
                name={areFiltersVisible ? "chevron-up" : "sliders"}
                size={16}
                color="#393381"
              />
              <Text style={styles.filterButtonText}>
                {areFiltersVisible ? t("hide_filters") : t("filters")}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={cars}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#469E70",
  },
  topMenu: {
    backgroundColor: "#f1f5f9",
    padding: 10,
    margin: 10,
    borderRadius: 7,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 30,
  },
  menuButton: {
    padding: 8,
    // borderStyle: "solid",
    // borderColor: "red",
    // borderWidth: 1,
  },
  iconStyle: {
    padding: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  // cartButton: {
  //   padding: 8,
  // },
  cartButton: {
    padding: 8,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  productList: {
    padding: 8,
  },
  productItem: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    backgroundColor: "#fff",
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
  },
  productInfo: {
    padding: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  productBrand: {
    fontSize: 12,
    color: "#f0f0f0",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  resultCount: {
    fontSize: 14,
    color: "#666",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 2,
  },
  filterButtonText: {
    fontSize: 14,
    marginLeft: 8,
    color: "#393381",
    fontWeight: "bold",
  },
  loadingMore: {
    marginVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  errorContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "#fff",
    textAlign: "center",
  },
  productsLoadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 1,
  },
  cardContainer: {
    width: "48%",
  },
});

export default Shop;
