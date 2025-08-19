import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import CarCard from "../../components/car/CarCard";
import FilterPills from "../../components/shop/FilterPills";
import SearchHeader from "../../components/shop/SearchHeader";
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
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const language = useSelector((state) => state.auth.lan);

  const { t, i18n } = useTranslation();

  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <SearchHeader />
      <FilterPills />
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
  );
};

const styles = StyleSheet.create({
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
export default Shop;
