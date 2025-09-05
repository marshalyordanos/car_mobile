import { Ionicons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import CarCard from "../../components/car/CarCard";
const Favorites = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const allCars = useSelector((state) => state.cars.items);
  const favoriteCarIds = useSelector((state) => state.favorites.ids);
  const favoritedCars = allCars.filter((car) =>
    favoriteCarIds.includes(car.id)
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      {favoritedCars.length > 0 ? (
        <FlatList
          data={favoritedCars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <CarCard car={item} />
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="heart-outline" size={80} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart icon on any car to save it here.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/shop")}
          >
            <Text style={styles.browseButtonText}>Browse Cars</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  listContainer: {
    paddingVertical: 16,
  },
  cardWrapper: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
