import { Calendar, History, MapPin, MessageCircle } from "lucide-react-native";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const mockBookings = [
  {
    id: "5",
    carName: "Porsche 911",
    carModel: "2023",
    renterName: "Sports Car Rentals",
    status: "completed",
    pickupDate: "Dec 1, 2024",
    returnDate: "Dec 5, 2024",
    pickupLocation: "555 Speed Way, Racing District",
    price: 800,
    isPaid: true,
  },
  {
    id: "6",
    carName: "Range Rover",
    carModel: "2024",
    renterName: "Premium Auto Rentals",
    status: "completed",
    pickupDate: "Nov 20, 2024",
    returnDate: "Nov 25, 2024",
    pickupLocation: "123 Main St, Downtown",
    price: 700,
    isPaid: true,
  },
  {
    id: "7",
    carName: "Honda Civic",
    carModel: "2023",
    renterName: "Budget Car Hire",
    status: "cancelled",
    pickupDate: "Nov 10, 2024",
    returnDate: "Nov 15, 2024",
    pickupLocation: "789 Budget Ave, Economy Zone",
    price: 250,
    isPaid: false,
  },
];

const styles = {
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardInfo: {
    flex: 1,
  },
  carTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  renterName: {
    fontSize: 14,
    color: "#6B7280",
  },
  badgeCompleted: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeTextCompleted: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  badgeCancelled: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeTextCancelled: {
    fontSize: 12,
    fontWeight: "600",
    color: "#DC2626",
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
    flex: 1,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    height: 44,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  messageButtonFull: {
    flex: 1,
    flexDirection: "row",
    height: 44,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: 4,
  },
  iconMargin: {
    marginRight: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 48,
    paddingVertical: 80,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
};

const BookingCard = ({ booking, onOpenChat, handleBookingPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <View style={styles.badgeCompleted}>
            <Text style={styles.badgeTextCompleted}>Completed</Text>
          </View>
        );
      case "cancelled":
        return (
          <View style={styles.badgeCancelled}>
            <Text style={styles.badgeTextCancelled}>Cancelled</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <TouchableOpacity onPress={handleBookingPress} style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.carTitle}>
            {booking.carName} {booking.carModel}
          </Text>
          <Text style={styles.renterName}>{booking.renterName}</Text>
        </View>
        {getStatusBadge(booking.status)}
      </TouchableOpacity>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Calendar color="#6B7280" size={16} />
          <Text style={styles.detailText}>
            {booking.pickupDate} - {booking.returnDate}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin color="#6B7280" size={16} />
          <Text style={styles.detailText} numberOfLines={1}>
            {booking.pickupLocation}
          </Text>
        </View>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Total Price</Text>
        <Text style={styles.priceValue}>${booking.price}</Text>
      </View>

      <TouchableOpacity
        style={styles.messageButtonFull}
        onPress={() => onOpenChat(booking)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <MessageCircle color="#6B7280" size={16} style={styles.iconMargin} />
        <Text style={styles.buttonText}>Message</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const BookingHistory = ({ onOpenChat, handleBookingPress }) => {
  const handleOpenChat = (booking) => {
    console.log("Open chat:", booking);
    // Your chat logic here
  };

  const historyBookings = mockBookings.filter(
    (booking) =>
      booking.status === "completed" || booking.status === "cancelled"
  );

  return (
    <FlatList
      data={historyBookings}
      renderItem={({ item }) => (
        <BookingCard
          booking={item}
          handleBookingPress={handleBookingPress}
          onOpenChat={handleOpenChat}
        />
      )}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <History color="#D1D5DB" size={64} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No booking history</Text>
          <Text style={styles.emptySubtitle}>
            Your past bookings will appear here
          </Text>
        </View>
      }
    />
  );
};

export default BookingHistory;
