import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
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
import { clearCars } from "../../redux/carsSlice";
import { isoToDisplayWithOutYear } from "../../utils/date";
import api from "../../redux/api";

const Shop = () => {
  const insets = useSafeAreaInsets();
  // const dispatch = useDispatch();
  // const {
  //   items: carList,
  //   status,
  //   pagination,
  //   canLoadMore,
  // } = useSelector((state) => state.cars);
  const [carList, setCarList] = useState([]);
  const [status, setStatus] = useState("");
  console.log("carListcarList:", carList);

  const [activeFilters, setActiveFilters] = useState({
    price: {
      min: 0,
      max: 50000,
    },
    vehicleTypes: [],
    years: {
      min: 1952,
      max: new Date().getFullYear(),
    },
    mileage: {
      min: 0,
      max: 1000,
    },
    seats: "All seats",
    brands: [],
    models: [],
    transmission: "All",
    ecoFriendly: [],
    features: [],
    sortBy: "Relevance",
    closeSignal: 0,
  });
  const { selectedLocation, startDate, endDate } = useLocalSearchParams();
  const router = useRouter();

  const fetchCars = async () => {
    try {
      setStatus("loading");
      const apiQuery = buildApiQuery(1);

      console.log("--------------:oias:", apiQuery);

      const response = await api.get("cars", { params: apiQuery });
      // console.log("API success1234:", response.data);
      setCarList(response.data?.data);
      return response.data;
    } catch (error) {
      console.log("API error:", error.response?.data || error.message);
    } finally {
      setStatus("done");
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log(":::::::", startDate, endDate);

      // if either date is missing → assign defaults
      if (!startDate || !endDate) {
        const now = new Date();

        // start = +2 days @ 10:00 AM
        const start = new Date(now);
        start.setDate(start.getDate() + 2);
        start.setHours(10, 0, 0, 0);

        // end = +4 days @ 11:00 PM
        const end = new Date(now);
        end.setDate(end.getDate() + 4);
        end.setHours(23, 0, 0, 0);

        console.log("kslka: ", {
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        });
        router.setParams({
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        });
      }
    }, [])
  );
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

      let start2;
      if (startDate) {
        start2 = startDate;
      } else {
        const now = new Date();

        const start = new Date(now);
        start.setDate(start.getDate() + 2);
        start.setHours(10, 0, 0, 0);

        start2 = start.toISOString();
      }
      let end2;
      if (startDate) {
        end2 = endDate;
      } else {
        const now = new Date();

        const end = new Date(now);
        end.setDate(end.getDate() + 4);
        end.setHours(23, 0, 0, 0);
        end2 = end.toISOString();
      }

      return {
        filter: filterParts.length > 0 ? filterParts.join(",") : undefined,
        sort: sortString,
        page: page,
        startDate: start2,
        endDate: end2,
      };
    },
    [activeFilters]
  );

  useFocusEffect(
    useCallback(() => {
      fetchCars();
    }, [activeFilters])
  );
  //
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // dispatch(clearCars());
    const apiQuery = buildApiQuery(1);
    // dispatch(fetchCars(apiQuery));
  }, [activeFilters, buildApiQuery]);

  const handleLoadMore = () => {
    // dispatch(fetchCars(apiQuery));
    // if (canLoadMore && status !== "loadingMore") {
    //   const nextPage = (pagination?.page || 1) + 1;
    //   const apiQuery = buildApiQuery(nextPage);
    //   dispatch(fetchCars(apiQuery));
    // }
  };
  const onRefresh = () => {
    fetchCars();

    // dispatch(fetchCars());
    // dispatch(clearCars());
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
        <SearchHeader
          startDate={startDate}
          endDate={endDate}
          selectedLocation={selectedLocation}
        />
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
              <Text style={styles.resultsTitle}>{0} cars available</Text>
              <Text style={styles.resultsSubtitle}>
                These cars are located in and around Addis Ababa
              </Text>
              {status == "loading" && (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <LottieView
                    source={require("../../assets/loading.json")}
                    autoPlay
                    loop
                    style={styles.lottie}
                  />
                </View>
              )}
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <CarCard
                selectedLocation={selectedLocation}
                startDate={startDate}
                endDate={endDate}
                car={item}
                onRent={() => console.log(item.name)}
              />
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
