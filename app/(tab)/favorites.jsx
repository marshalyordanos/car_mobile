import { Ionicons as Icon } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import CarCard from "../../components/car/CarCard";
import api from "../../redux/api";
import { selectFavorites, setFavorites } from "../../redux/favoriteSlice";
const Favorites = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const fevorites = useSelector(selectFavorites);
  const favoriteCarIds = useSelector((state) => state.favorites.ids);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // console.log(fevorites?.length);
      // if (fevorites && fevorites?.length == 0) {
      fetchFavorites();
      // }
    }, [])
  );

  const fetchFavorites = async () => {
    try {
      setLoading(false); // start loading
      const res = await api.get("users/wish-list");

      console.log("favorites: ", res.data);
      dispatch(setFavorites(res.data.data?.wishlist)); // adjust based on your API response
      setLoading(false); // start loading
    } catch (error) {
      console.error("error:", error);
      setLoading(true); // start loading
    } finally {
      setLoading(false); // stop loadings
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      <FlatList
        data={fevorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <CarCard car={item} />
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Icon name="heart-outline" size={80} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No Favorites Yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the heart icon on any car to save it here.
              </Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => {
                  fetchFavorites();

                  // router.push("/shop")
                }}
              >
                <Text style={styles.browseButtonText}>Browse Cars</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListHeaderComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color="#2563eb"
              style={{ marginTop: 20 }}
            />
          ) : null
        }
        contentContainerStyle={styles.listContainer}
      />
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
