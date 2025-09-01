import { Ionicons as Icon } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../redux/favoritesSlice";

const CarCard = ({ car }) => {
  const dispatch = useDispatch();
  const favoriteCarIds = useSelector((state) => state.favorites.ids);
  const isFavorited = favoriteCarIds.includes(car?.id);
  const toggleFavorite = () => {
    if (!car?.id) return;
    if (isFavorited) {
      dispatch(removeFavorite(car.id));
    } else {
      dispatch(addFavorite(car.id));
    }
  };
  const carName = car.name || `${car.make} ${car.model}`;
  const carBrand = car.brand?.name || car.make || "N/A";
  const price = car.price || car.daily_rate || 0;
  const imageUrl = car.images && car.images.length > 0 ? car.images[0] : null;
  return (
    <View style={styles.card}>
      <Image
        source={
          imageUrl
            ? { uri: imageUrl }
            : require("../../assets/images/car1.jpeg")
        }
        style={styles.image}
        resizeMode="cover"
      />

      <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
        <Icon
          name={isFavorited ? "heart" : "heart-outline"}
          size={24}
          color={isFavorited ? "#111827" : "white"}
        />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {carName}
        </Text>
        <Text style={styles.brand}>{carBrand}</Text>
        <Text style={styles.price}>{price.toLocaleString()} ETB / day</Text>
      </View>
    </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 6,
    borderRadius: 20,
  },
  info: {
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  brand: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
    marginBottom: 16,
  },
});
