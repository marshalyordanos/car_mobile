import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CarCard from "../../components/car/CarCard";
import AllFiltersModal from "../../components/shop/AllFiltersModal";
import DeliverySheet from "../../components/shop/DeliverySheet";
import FilterPills from "../../components/shop/FilterPills";
import MakeModelModal from "../../components/shop/MakeModelModal";
import PriceRangeSheet from "../../components/shop/PriceRangeSheet";
import SearchHeader from "../../components/shop/SearchHeader";
import SeatsSheet from "../../components/shop/SeatsSheet";
import VehicleTypeSheet from "../../components/shop/VehicleTypeSheet";
import YearRangeSheet from "../../components/shop/YearRangeSheet";
import images from "../../constants/images";

const cars = [
  { id: 1, name: "Model S", price: 79999, brand: "Tesla", image: images.car1 },
  { id: 2, name: "Civic", price: 22000, brand: "Honda", image: images.car2 },
  { id: 3, name: "Mustang", price: 35000, brand: "Ford", image: images.car3 },
  { id: 4, name: "Corolla", price: 19000, brand: "Toyota", image: images.van1 },
  { id: 5, name: "A4", price: 40000, brand: "Audi", image: images.car1 },
  { id: 6, name: "Camry", price: 24000, brand: "Toyota", image: images.car2 },
];
const Shop = () => {
  const insets = useSafeAreaInsets();
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
          <FlatList
            data={cars}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={() => (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>200+ cars available</Text>
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
});
