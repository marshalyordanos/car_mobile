import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
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
  const activeFilters = useSelector((state) => state.filters);
  useEffect(() => {
    const apiFilters = {
      minPrice:
        activeFilters.price.min === 10 ? undefined : activeFilters.price.min,
      maxPrice:
        activeFilters.price.max === 500 ? undefined : activeFilters.price.max,
      vehicle_type:
        activeFilters.vehicleTypes.length > 0
          ? activeFilters.vehicleTypes.join(",")
          : undefined,
      model: activeFilters.model,
    };

    dispatch(fetchCars(apiFilters));
  }, [activeFilters, dispatch]);

  // useEffect(() => {
  //   if (status === "idle") {
  //     dispatch(fetchCars());
  //   }
  // }, [status, dispatch]);
  // const language = useSelector((state) => state.auth.lan);

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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
      <BottomSheetModalProvider>
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <SearchHeader />
          <FilterPills onPillPress={handlePillPress} />

          {status === "loading" && (
            <ActivityIndicator size="large" style={{ marginTop: 50 }} />
          )}

          {status === "failed" && (
            <Text style={styles.errorText}>
              Error loading cars. Please try again.
            </Text>
          )}
          {status === "succeeded" && (
            <FlatList
              data={carList}
              keyExtractor={(item) => item.id.toString()}
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
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
        <PriceRangeSheet ref={priceSheetRef} />
        <VehicleTypeSheet ref={vehicleTypeSheetRef} />
        <YearRangeSheet ref={yearSheetRef} />
        <SeatsSheet ref={seatsSheetRef} />
        <DeliverySheet ref={deliverySheetRef} />
      </BottomSheetModalProvider>
      <MakeModelModal
        isVisible={isMakeModalVisible}
        onClose={() => setMakeModalVisible(false)}
      />
      <AllFiltersModal
        isVisible={isAllFiltersVisible}
        onClose={() => setAllFiltersVisible(false)}
      />
    </GestureHandlerRootView>
  );
};

export default Shop;
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
