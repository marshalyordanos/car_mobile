import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
import { fetchCars } from "../../redux/carsSlice";

const Shop = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {
    items: carList,
    status,
    totalCars,
  } = useSelector((state) => state.cars);
  const activeFilters = useSelector((state) => state.filters, shallowEqual);
  useEffect(() => {
    searchCars();
  }, [activeFilters, dispatch]);
  const searchCars = () => {
    const apiFilters = {
      minPrice:
        activeFilters.price.min === 10 ? undefined : activeFilters.price.min,
      maxPrice:
        activeFilters.price.max === 500 ? undefined : activeFilters.price.max,
      minYear:
        activeFilters.years.min === 1952 ? undefined : activeFilters.years.min,
      maxYear:
        activeFilters.years.max === new Date().getFullYear()
          ? undefined
          : activeFilters.years.max,
      seating_capacity:
        activeFilters.seats !== "All seats"
          ? parseInt(activeFilters.seats)
          : undefined,
      vehicle_type:
        activeFilters.vehicleTypes.length > 0
          ? activeFilters.vehicleTypes.join(",")
          : undefined,
      brand:
        activeFilters.brands.length > 0
          ? activeFilters.brands.join(",")
          : undefined,
      model:
        activeFilters.models.length > 0
          ? activeFilters.models.join(",")
          : undefined,
      transmission:
        activeFilters.transmission !== "All"
          ? activeFilters.transmission
          : undefined,
      eco_friendly:
        activeFilters.ecoFriendly.length > 0
          ? activeFilters.ecoFriendly.join(",")
          : undefined,
      features:
        activeFilters.features.length > 0
          ? activeFilters.features.join(",")
          : undefined,
      sortby:
        activeFilters.sortBy !== "Relevance" ? activeFilters.sortBy : undefined,
    };

    dispatch(fetchCars(apiFilters));
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SearchHeader />
      <FilterPills onPillPress={handlePillPress} />

      {status === "loading" && carList.length === 0 && (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      )}

      {status === "failed" && (
        <Text style={styles.errorText}>
          Error loading cars. Please try again.
        </Text>
      )}
      {status === "loading" && carList.length > 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#111827" />
        </View>
      )}
      {status === "succeeded" && (
        <FlatList
          data={carList}
          keyExtractor={(item) => item?._id}
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
          refreshControl={
            <RefreshControl
              refreshing={status === "loading"}
              onRefresh={searchCars}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
      />
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
});
