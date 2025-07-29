import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Animated, // Import Animated
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import Modal from "react-native-modal";
import { useSelector } from "react-redux"; // Add this import

import ShopSideDrawer from "../../components/ShopDrawer";
import ProductFilters from "../../components/ProductFilters";
import MainCategoryComponent from "../../components/category/MainCategoryComponent";
import ProductItem from "../../components/category/ProductItem";
import Header from "../../components/Header";
// import ProductDetail from '../../components/category/ProductDetail';
import Breadcrumbs from "../../components/category/Breadcrumbs";
import { useTranslation } from "react-i18next";
import api from "../../redux/api";
import axios from "axios";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 10) / 2;

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

  useEffect(() => {
    fetchCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsDrawerVisible(false);
    }, [])
  );

  const fetchCategories = async () => {
    setIsCatssLoading(true);
    try {
      const response = await api.get(
        "/api/v1/main-categories/?page=1&pageSize=10&sort[column]=name&sort[order]=ascend&all=true"
      );
      setCategoriesData(response.data);
      setIsDrawerContentLoaded(true);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      setError(`Failed to load categories: ${error.message}`);
    } finally {
      setIsCatssLoading(false);
    }
  };

  const fetchProducts = async (
    results,
    count,
    level,
    id,
    filters = {},
    isLoadingMore = false
  ) => {
    if (!isLoadingMore) {
      setIsProductsLoading(true);
      setProducts([]);
      setNextPage(null);
    }
    setError(null);

    let url = `products/?page=1`;

    if (level === "main" && id) {
      url += `&main_category__id=${id}`;
      setSelectedMainCategoryId(id);
      setSelectedCategoryId(null);
      setSelectedSubcategoryId(null);
    } else if (level === "category" && id) {
      url += `&category__id=${id}`;
      setSelectedCategoryId(id);
      setSelectedSubcategoryId(null);
    } else if (level === "subcategory" && id) {
      url += `&sub_category__id=${id}`;
      setSelectedSubcategoryId(id);
    }

    if (results && results.category__id) {
      url += `&category__id=${results.category__id}`;
    }
    if (results && results.sub_category__id) {
      url += `&sub_category__id=${results.sub_category__id}`;
    }
    if (results && results.main_category__id) {
      url += `&main_category__id=${results.main_category__id}`;
    }

    if (results && results.minPrice !== undefined) {
      url += `&product_combinations__price__gte=${results.minPrice}`;
    }
    if (results && results.maxPrice !== undefined) {
      if (results.maxPrice === Infinity) {
        url += `&product_combinations__price__lte=999999999`;
      } else {
        url += `&product_combinations__price__lte=${results.maxPrice}`;
      }
    }
    let response;

    try {
      if (isLoadingMore && nextPage) {
        let url = nextPage;
        if (url.startsWith("http://")) {
          url = url.replace("http://", "https://");
        }

        response = await axios.get(url);
        setProducts((prev) => [...prev, ...response.data.results]);
        setLoadMore(false);
      } else {
        response = await api.get("/api/v1/" + url);
        setProducts(response.data.results);
      }

      setTotalCount(response.data.count);
      setNextPage(response.data.next);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again.");
    } finally {
      setIsProductsLoading(false);
      setIsRefreshing(false);
    }
  };
  const handleBreadcrumbNavigation = (level, name) => {
    switch (level) {
      case "main":
        setSelectedMainCategory(null);
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setSelectedMainCategoryId(null);
        setSelectedCategoryId(null);
        setSelectedSubcategoryId(null);
        fetchProducts(null, null, "main", null);
        setBreadCrumbTexts({ main: name, category: null, subcategory: null });
        break;
      case "mainCategory":
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setSelectedCategoryId(null);
        setSelectedSubcategoryId(null);
        fetchProducts(null, null, "main", selectedMainCategoryId);
        setBreadCrumbTexts({ main: null, category: null, subcategory: null });
        break;
      case "category":
        setSelectedSubcategory(null);
        setSelectedSubcategoryId(null);
        fetchProducts(null, null, "category", selectedCategoryId);
        break;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    console.log("refrash start");
    fetchProducts(
      {
        main_category__id: selectedMainCategoryId,
        category__id: selectedCategoryId,
        sub_category__id: selectedSubcategoryId,
      },
      null,
      null,
      null,
      {},
      true
    );
  };

  const handleLoadMore = async () => {
    if (nextPage && !isProductsLoading && products.length < totalCount) {
      // setLastLoad(true);
      setLoadMore(true);
      try {
        if (nextPage) {
          let url = nextPage;
          if (url.startsWith("http://")) {
            url = url.replace("http://", "https://");
          }

          const response = await axios.get(url);
          setProducts((prev) => [...prev, ...response.data.results]);
          setLoadMore(false);
          setNextPage(response.data?.next);
        }
      } catch (err) {
        console.log("errr: ------: ", err);
      } finally {
        setLoadMore(false);
      }
    } else {
      setLastLoad(true);
      setLoadMore(false);
    }
  };
  // [nextPage, isProductsLoading, products.length, totalCount]);

  const handleApplyFilters = useCallback((filters) => {
    fetchProducts({
      ...filters,
      main_category__id: selectedMainCategoryId,
      category__id: selectedCategoryId,
      sub_category__id: selectedSubcategoryId,
    });
  });
  // [selectedMainCategoryId, selectedCategoryId, selectedSubcategoryId]);

  // Function to toggle the drawer and handle animation
  const toggleDrawer = () => {
    setIsDrawerVisible((prev) => !prev);

    Animated.timing(drawerOpacity, {
      toValue: isDrawerVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const toggleModal = useCallback((product = null) => {
    setSelectedProduct(product);
    setModalVisible((prev) => !prev);
  }, []);

  const renderProductItem = useCallback(
    ({ item }) => (
      <View
        key={item.id}
        style={{
          marginVertical: 0,
          maxWidth: itemWidth,
          flex: 1,
        }}
      >
        {/* <Text> dd</Text> */}
        <ProductItem item={item} />
      </View>
    ),
    [navigation]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 200,
      offset: 200 * index,
      index,
    }),
    []
  );

  const handleSelectContent = (
    mainCategory,
    category,
    subcategory,
    data,
    categoryId,
    subcategoryId,
    mainCategoryId
  ) => {
    setSelectedMainCategory(mainCategory);
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setSelectedMainCategoryId(mainCategoryId);
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(subcategoryId);

    // Fetch products for the selected subcategory
    if (subcategoryId) {
      fetchProducts(null, null, "subcategory", subcategoryId);
    } else if (categoryId) {
      fetchProducts(null, null, "category", categoryId);
    } else if (mainCategoryId) {
      fetchProducts(null, null, "main", mainCategoryId);
    }
  };

  useEffect(() => {
    if (!selectedMainCategory) {
      fetchProducts(null, null, "main", null);
    }
  }, []);
  useEffect(() => {
    setSelectedMainCategory(route.params?.mainName);
    setSelectedMainCategoryId(route.params?.mainId);
    setSelectedCategory(null);
    setSelectedCategoryId(null);
    setSelectedSubcategory(null);
    setSelectedSubcategoryId(null);
  }, [route.params?.mainId]);

  useEffect(() => {
    fetchProducts(null, null, "main", route.params?.mainId);
  }, [route.params?.mainId]);

  const handleSelectMainCategory = (id, name, level) => {
    setIsProductsLoading(true);
    setProducts([]); // Clear products immediately
    setNextPage(null);

    if (level === "main") {
      setSelectedMainCategory(name);
      setSelectedMainCategoryId(id);
      setSelectedCategory(null);
      setSelectedCategoryId(null);
      setSelectedSubcategory(null);
      setSelectedSubcategoryId(null);
    } else if (level === "category") {
      setSelectedCategory(name);
      setSelectedCategoryId(id);
      setSelectedSubcategory(null);
      setSelectedSubcategoryId(null);
    } else if (level === "subcategory") {
      setSelectedSubcategory(name);
      setSelectedSubcategoryId(id);
    }

    // Use a callback to ensure state is updated before fetching
    setTimeout(() => {
      fetchProducts(null, null, level, id);
    }, 0);
  };
  const leftIcon = ({ navigation }) => (
    <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
      <Icon name="bars" size={24} color="#fff" style={styles.iconStyle} />
    </TouchableOpacity>
  );
  const language = useSelector((state) => state.auth.lan);

  const { t, i18n } = useTranslation();


  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError(null); 
      }, 5000);
  
      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Header
        leftIcon={leftIcon}
        navigation={navigation}
        title={t("shop")}
        isShopScreen={true}
      />

      <View style={{ backgroundColor: "white", flex: 1 }}>
        <FlatList
          ListHeaderComponent={
            <>
              <Breadcrumbs
                lan={language}
                t={t}
                mainCategory={selectedMainCategory}
                category={selectedCategory}
                subcategory={selectedSubcategory}
                onNavigate={handleBreadcrumbNavigation}
              />
              {isCatsLoading ? (
                <View style={styles.productsLoadingContainer}>
                  <ActivityIndicator size="large" color="#393381" />
                </View>
              ) : (
                <MainCategoryComponent
                  mainCategoryData={categoriesData}
                  selectedMainCategory={selectedMainCategory}
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleSelectMainCategory}
                />
              )}
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
              {areFiltersVisible && (
                <ProductFilters
                  t={t}
                  onApplyFilters={handleApplyFilters}
                  category={selectedCategory}
                  subcategory={selectedSubcategory}
                  selectedCategoryId={selectedCategoryId}
                  selectedSubcategoryId={selectedSubcategoryId}
                />
              )}
            </>
          }
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={21}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#393381"
            />
          }
          ListFooterComponent={() =>
            nextPage || isProductsLoading ? (
              <ActivityIndicator
                size="small"
                color="#393381"
                // style={styles.loadingMore}
              />
            ) : null
          }
          // ListFooterComponent={() =>
          //   nextPage && !lastLoad && !isLOadMOre ? (
          //     <View style={{ justifyContent: "center", alignItems: "center" }}>
          //       <TouchableOpacity
          //         style={{
          //           paddingHorizontal: 10,
          //           paddingVertical: 10,
          //           backgroundColor: "#393381",
          //           width: 100,
          //         }}
          //         onPress={handleLoadMore}
          //       >
          //         <Text style={{ color: "white" }}>Load More</Text>
          //       </TouchableOpacity>
          //     </View>
          //   ) : (isLOadMOre && !lastLoad) || isProductsLoading ? (
          //     <ActivityIndicator
          //       size="small"
          //       color="#393381"
          //       // style={styles.loadingMore}
          //     />
          //   ) : null
          // }
          // ListFooterComponent={

          // }
          ListEmptyComponent={
            !isProductsLoading && (
              <View style={styles.emptyContainer}>
                <Icon name="inbox" size={50} color="#ccc" />
                <Text style={styles.emptyText}>No products found</Text>
              </View>
            )
          }
          removeClippedSubviews={true}
        />
      </View>

      {/* {isDrawerVisible ? ( */}
      <ShopSideDrawer
        lan={language}
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        onSelectContent={handleSelectContent}
        categoriesData={categoriesData}
        drawerOpacity={drawerOpacity}
        isDrawerContentLoaded={isDrawerContentLoaded}
        setIsLoading={setIsLoading} // Pass loading state setter
      />
      {/* ) : null} */}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#469E70",
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
});

export default Shop;
