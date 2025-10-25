import { useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import CarCard from "../../components/car/CarCard";
import AllFiltersModal from "../../components/shop/modals/AllFiltersModal";
import DeliverySheet from "../../components/shop/modals/DeliverySheet";
import MakeModelModal from "../../components/shop/modals/MakeModelModal";
import PriceRangeSheet from "../../components/shop/modals/PriceRangeSheet";
import SeatsSheet from "../../components/shop/modals/SeatsSheet";
import VehicleTypeSheet from "../../components/shop/modals/VehicleTypeSheet";
import YearRangeSheet from "../../components/shop/modals/YearRangeSheet";
import SearchHeader from "../../components/shop/SearchHeader";
import FilterPills from "../../components/shop/ui/FilterPills";
import { clearCars, fetchCars } from "../../redux/carsSlice";

const Shop = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {
    items: carList,
    status,
    pagination,
    canLoadMore,
  } = useSelector((state) => state.cars);
  const totalCars = pagination?.total || 0;
  const activeFilters = useSelector((state) => state.filters, shallowEqual);
  const { selectedLocation } = useLocalSearchParams();
  console.log("selectedLocation:", selectedLocation);

  const buildApiQuery = useCallback(
    (page = 1) => {
      const filterParts = [];
      if (activeFilters.price.min !== 10) {
        filterParts.push(`rentalPricePerDay_gte:${activeFilters.price.min}`);
      }
      if (activeFilters.price.max !== 500) {
        filterParts.push(`rentalPricePerDay_lte:${activeFilters.price.max}`);
      }
      if (activeFilters.vehicleTypes.length > 0) {
        filterParts.push(`carType:[${activeFilters.vehicleTypes.join(",")}]`);
      }
      if (activeFilters.brands.length > 0) {
        filterParts.push(`makeId:[${activeFilters.brands.join(",")}]`);
      }
      if (activeFilters.models.length > 0) {
        filterParts.push(`modelId:[${activeFilters.models.join(",")}]`);
      }

      // other filters
      let sortString;
      if (activeFilters.sortBy === "price_asc") {
        sortString = "rentalPricePerDay:asc";
      } else if (activeFilters.sortBy === "price_desc") {
        sortString = "rentalPricePerDay:desc";
      }

      return {
        filter: filterParts.length > 0 ? filterParts.join(",") : undefined,
        sort: sortString,
        page: page,
      };
    },
    [activeFilters]
  );

  useEffect(() => {
    if (status === "idle") {
      const apiQuery = buildApiQuery(1);
      dispatch(fetchCars(apiQuery));
    }
  }, []);
  //
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    dispatch(clearCars());
    const apiQuery = buildApiQuery(1);
    dispatch(fetchCars(apiQuery));
  }, [activeFilters, dispatch, buildApiQuery]);

  const handleLoadMore = () => {
    if (canLoadMore && status !== "loadingMore") {
      const nextPage = (pagination?.page || 1) + 1;
      const apiQuery = buildApiQuery(nextPage);
      dispatch(fetchCars(apiQuery));
    }
  };
  const onRefresh = () => {
    dispatch(clearCars());
  };

  // const { t, i18n } = useTranslation();
  const [isMakeModalVisible, setMakeModalVisible] = useState(false);
  const [isAllFiltersVisible, setAllFiltersVisible] = useState(false);
  const priceSheetRef = useRef(null);
  const vehicleTypeSheetRef = useRef(null);
  const yearSheetRef = useRef(null);
  const seatsSheetRef = useRef(null);
  const deliverySheetRef = useRef(null);

  const handlePillPress = (item) => {
    console.log("Pill pressed:", item);
    if (item === "Price") {
      priceSheetRef.current?.present();
    } else if (item === "Vehicle type") {
      vehicleTypeSheetRef.current?.present();
    } else if (item === "Years") {
      yearSheetRef.current?.present();
    } else if (item === "Seats") {
      seatsSheetRef.current?.present();
    } else if (item === "Deliver to me") {
      deliverySheetRef.current?.present();
    } else if (item === "Make & model") {
      setMakeModalVisible(true);
    } else if (item === "All filters") {
      setAllFiltersVisible(true);
    } else {
      console.log(item, "pressed");
    }
  };

  const handleNavigationFromAllFilters = (filterName) => {
    setAllFiltersVisible(false);
    setTimeout(() => {
      if (filterName === "Make & model") {
        setMakeModalVisible(true);
      } else if (filterName === "Seats") {
        seatsSheetRef.current?.present();
      }
    }, 250);
  };

  const renderFooter = () => {
    if (status !== "loadingMore") return null;
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <LottieView
          source={require("../../assets/loading.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <SearchHeader selectedLocation={selectedLocation} />
        <FilterPills onPillPress={handlePillPress} />

        {status === "failed" && (
          <Text style={styles.errorText}>
            Error loading cars. Please try again.
          </Text>
        )}
        <FlatList
          data={carList}
          keyExtractor={(item) => item?.id}
          ListHeaderComponent={() => (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>
                {totalCars} cars available
              </Text>
              <Text style={styles.resultsSubtitle}>
                These cars are located in and around Addis Ababa
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <CarCard car={item} onRent={() => console.log(item.name)} />
            </View>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5} // to trigger the load when its close to the end
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={status === "loading"}
              onRefresh={onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
        />

        <PriceRangeSheet ref={priceSheetRef} />
        <VehicleTypeSheet ref={vehicleTypeSheetRef} />
        <YearRangeSheet ref={yearSheetRef} />
        <SeatsSheet ref={seatsSheetRef} />
        <DeliverySheet ref={deliverySheetRef} />
        <MakeModelModal
          isVisible={isMakeModalVisible}
          onClose={() => setMakeModalVisible(false)}
        />
        <AllFiltersModal
          isVisible={isAllFiltersVisible}
          onClose={() => setAllFiltersVisible(false)}
          onNavigateToFilter={handleNavigationFromAllFilters}
        />
      </View>
    </View>
  );
};

export default Shop;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  resultsSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  cardWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  errorText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "red",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  lottie: {
    width: 150,
    height: 150,
  },
});
