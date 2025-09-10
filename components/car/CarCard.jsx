import { FontAwesome, Ionicons as Icon } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../redux/favoritesSlice";

const placeholderImage = require("../../assets/images/car1.jpeg");
const CarCard = ({ car }) => {
  const dispatch = useDispatch();
  const favoriteCarIds = useSelector((state) => state.favorites.ids);
  const carId = car?._id;
  const carName = `${car?.brand?.name || ""} ${
    car?.model?.name || car?.title || ""
  } ${car?.year || ""}`.trim();
  const price = car?.rental_price_per_day || 0;
  const imageUrl = car?.images && car.images.length > 0 ? car.images[0] : null;
  const rating = car?.average_rating || 0;
  const tripCount = car?.review_count || 0;
  const locationCity = car?.location?.city || "Unknown Location";
  const isFavorited = favoriteCarIds.includes(carId);
  const toggleFavorite = () => {
    if (!carId) return;
    if (isFavorited) {
      dispatch(removeFavorite(carId));
    } else {
      dispatch(addFavorite(carId));
    }
  };
  if (!carId || !carName) {
    return null;
  }
  return (
    <TouchableOpacity style={styles.card}>
      <Image
        source={imageUrl ? { uri: imageUrl } : placeholderImage}
        style={styles.image}
        resizeMode="cover"
      />

      <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
        <Icon
          name={isFavorited ? "heart" : "heart-outline"}
          size={20}
          color={isFavorited ? "#111827" : "white"}
        />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {carName}
        </Text>
        <View style={styles.statsRow}>
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          <FontAwesome
            name="star"
            size={14}
            color="#f59e0b"
            style={{ marginHorizontal: 4 }}
          />
          <Text style={styles.statsText}>({tripCount} trips)</Text>
          {/* later for All-Star Host  */}
        </View>

        <View style={styles.locationRow}>
          <Icon name="location-outline" size={16} color="#6b7280" />
          <Text style={styles.statsText}>{locationCity}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{price.toLocaleString()} ETB</Text>
          <Text style={styles.priceLabel}> total</Text>
        </View>
        <Text style={styles.taxLabel}>Before taxes</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CarCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 190,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#acb0b9ff",
    padding: 6,
    borderRadius: 10,
  },
  info: {
    paddingHorizontal: 16,
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  statsText: {
    fontSize: 14,
    color: "#6b7280",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    alignSelf: "flex-end",
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  priceLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  taxLabel: {
    fontSize: 12,
    color: "#6b7280",
    alignSelf: "flex-end",
  },
});
