import { useRouter } from "expo-router";
import {
  Calendar,
  CreditCard,
  MapPin,
  MessageCircle,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import AppLoader from "../../components/AppLoader";
import { selectCurrentUser } from "../../redux/authReducer";

import { mockBookings } from "./mockBookings";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const transformBookingData = (bookings, userId) => {
  if (!Array.isArray(bookings)) {
    console.error("Bookings is not an array:", bookings);
    return [];
  }
  return bookings
    .filter((booking) => booking.guestId === userId)
    .map((booking) => {
      const statusMap = {
        pending: "pending",
        confirmed: "approved",
        active: "active",
        cancelled_by_guest: "cancelled",
        cancelled_by_host: "cancelled",
        completed: "completed",
      };
      return {
        id: booking.id,
        carName: booking.car?.make?.name || "Unknown Make",
        carModel: booking.car?.model?.name || "Unknown Model",
        renterName: `${booking.guest?.firstName || "Unknown"} ${
          booking.guest?.lastName || "Guest"
        }`,
        status:
          statusMap[booking.status.toLowerCase()] ||
          booking.status.toLowerCase(),
        pickupDate: booking.startDate ? formatDate(booking.startDate) : "N/A",
        returnDate: booking.endDate ? formatDate(booking.endDate) : "N/A",
        pickupLocation:
          booking.pickupLocation?.split("+*+")[2] || "Unknown Location",
        price: booking.totalPrice || 0,
        currency: booking.payment?.currency || "ETB",
        isPaid: booking.payment?.status === "PENDING" ? false : true,
        inspections: booking.inspections || [],
        endDate: booking.endDate,
        hostId: booking.hostId,
      };
    });
};

const InspectionForm = ({ bookingId, visible, onClose, onSubmit }) => {
  const translateY = useSharedValue(1000);
  const [fuelLevel, setFuelLevel] = useState("");
  const [mileage, setMileage] = useState("");
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    translateY.value = visible
      ? withSpring(0, { damping: 20 })
      : withSpring(1000);
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleSubmit = () => {
    if (!fuelLevel || !mileage) {
      alert("Please fill in fuel level and mileage.");
      return;
    }
    onSubmit(bookingId, {
      fuelLevel: parseInt(fuelLevel),
      mileage: parseInt(mileage),
      photo,
    });
    onClose();
  };

  return (
    <Animated.View style={[styles.inspectionContainer, animatedStyle]}>
      <View style={styles.inspectionHeader}>
        <Text style={styles.inspectionTitle}>Create Drop-Off Inspection</Text>
        <TouchableOpacity onPress={onClose}>
          <X color="#000" size={24} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Fuel Level (0-100)"
        value={fuelLevel}
        onChangeText={setFuelLevel}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Mileage"
        value={mileage}
        onChangeText={setMileage}
        keyboardType="numeric"
      />
      <Button
        title="Upload Photo"
        onPress={() => alert("Photo upload functionality to be implemented")}
      />
      {photo && <Image source={{ uri: photo }} style={styles.photoPreview} />}
      <Button title="Submit Inspection" onPress={handleSubmit} />
    </Animated.View>
  );
};

const BookingList = ({ onOpenChat }) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inspectionVisible, setInspectionVisible] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const user = useSelector(selectCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const initialBookings = transformBookingData(mockBookings, user.id);
      setBookings(initialBookings);
    }
  }, [user]);

  const handleCancel = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking
      )
    );
  };

  const handlePay = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: "active",
              isPaid: true,
              inspections: [
                ...booking.inspections,
                {
                  id: `inspection-${Date.now()}`,
                  bookingId,
                  type: "PICKUP",
                  photos: [],
                  fuelLevel: 0,
                  mileage: 0,
                  submittedById: user.id,
                  submittedByRole: "GUEST",
                  approved: false,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
            }
          : booking
      )
    );
  };

  const handleApproveInspection = (bookingId, inspectionId) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              inspections: booking.inspections.map((inspection) =>
                inspection.id === inspectionId
                  ? {
                      ...inspection,
                      approved: true,
                      approvedById:
                        inspection.submittedByRole === "GUEST"
                          ? booking.hostId
                          : user.id,
                      approvedByRole:
                        inspection.submittedByRole === "GUEST"
                          ? "HOST"
                          : "GUEST",
                      updatedAt: new Date().toISOString(),
                    }
                  : inspection
              ),
            }
          : booking
      )
    );
  };

  const handleCreateDropOffInspection = (
    bookingId,
    { fuelLevel, mileage, photo }
  ) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              inspections: [
                ...booking.inspections,
                {
                  id: `inspection-${Date.now()}`,
                  bookingId,
                  type: "DROPOFF",
                  photos: photo ? [photo] : [],
                  fuelLevel,
                  mileage,
                  submittedById: user.id,
                  submittedByRole: "GUEST",
                  approved: false,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
            }
          : booking
      )
    );
  };

  const BookingCard = ({ booking, onOpenChat, onCancel, onPay, onPress }) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => (scale.value = withSpring(0.98));
    const handlePressOut = () => (scale.value = withSpring(1));

    const isDropOffDate = new Date() >= new Date(booking.endDate);
    const canCreateDropOff =
      isDropOffDate &&
      booking.status === "active" &&
      booking.inspections.some((i) => i.type === "PICKUP" && i.approved) &&
      !booking.inspections.some((i) => i.type === "DROPOFF");

    const getStatusBadge = (status) => {
      switch (status) {
        case "pending":
          return (
            <View style={styles.badgePending}>
              <Text style={styles.badgeTextPending}>Pending</Text>
            </View>
          );
        case "approved":
          return (
            <View style={styles.badgeApproved}>
              <Text style={styles.badgeTextApproved}>Approved</Text>
            </View>
          );
        case "active":
          return (
            <View style={styles.badgeActive}>
              <Text style={styles.badgeTextActive}>Active</Text>
            </View>
          );
        default:
          return null;
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.cardTouchable}
        onPress={() => onPress?.(booking)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.carTitle}>
                {booking.carName} {booking.carModel}
              </Text>
              <Text style={styles.renterName}>{booking.renterName}</Text>
            </View>
            {getStatusBadge(booking.status)}
          </View>
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
          {booking.inspections?.length > 0 && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>Inspections:</Text>
              {booking.inspections.map((inspection) => (
                <View key={inspection.id} style={styles.detailRow}>
                  <Text style={styles.detailText}>
                    {inspection.type}:{" "}
                    {inspection.approved ? "Approved" : "Pending"} (Submitted by{" "}
                    {inspection.submittedByRole})
                  </Text>
                  {!inspection.approved &&
                    ((inspection.submittedByRole === "HOST" &&
                      user.id === booking.guestId) ||
                      (inspection.submittedByRole === "GUEST" &&
                        user.id === booking.hostId)) && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.payButton]}
                        onPress={() =>
                          handleApproveInspection(booking.id, inspection.id)
                        }
                      >
                        <Text style={styles.buttonTextWhite}>
                          Approve {inspection.type}
                        </Text>
                      </TouchableOpacity>
                    )}
                </View>
              ))}
            </View>
          )}
          {canCreateDropOff && (
            <TouchableOpacity
              style={[styles.actionButton, styles.payButton]}
              onPress={() => {
                setCurrentBookingId(booking.id);
                setInspectionVisible(true);
              }}
            >
              <Text style={styles.buttonTextWhite}>
                Create Drop-Off Inspection
              </Text>
            </TouchableOpacity>
          )}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total Price</Text>
            <Text style={styles.priceValue}>
              {booking.currency} {booking.price}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.messageButton}
              onPress={(e) => {
                e.stopPropagation();
                onOpenChat(booking);
              }}
            >
              <MessageCircle color="#6B7280" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={(e) => {
                e.stopPropagation();
                onCancel(booking.id);
              }}
            >
              <X color="#6B7280" size={16} style={styles.iconMargin} />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.payButton,
                booking.status !== "approved" && { opacity: 0.5 },
              ]}
              onPress={(e) => {
                e.stopPropagation();
                if (booking.status === "approved") onPay(booking.id);
              }}
              disabled={booking.status !== "approved"}
            >
              <CreditCard color="#FFF" size={16} style={styles.iconMargin} />
              <Text style={styles.buttonTextWhite}>Pay</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {isLoading && <AppLoader />}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {!user && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Please log in</Text>
          <Text style={styles.emptySubtitle}>Log in to view your bookings</Text>
          <Button title="Log In" onPress={() => router.push("/Sign-in")} />
        </View>
      )}
      {user && (
        <FlatList
          data={bookings}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              onOpenChat={onOpenChat}
              onCancel={handleCancel}
              onPay={handlePay}
              onPress={(booking) =>
                router.push({
                  pathname: "/BookingDetail",
                  params: { id: booking.id },
                })
              }
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Calendar color="#D1D5DB" size={64} style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No active bookings</Text>
              <Text style={styles.emptySubtitle}>
                Your upcoming bookings will appear here
              </Text>
            </View>
          }
        />
      )}
      <InspectionForm
        bookingId={currentBookingId}
        visible={inspectionVisible}
        onClose={() => setInspectionVisible(false)}
        onSubmit={handleCreateDropOffInspection}
      />
    </>
  );
};

const styles = {
  inspectionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    height: "60%",
  },
  inspectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  inspectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  photoPreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  cardTouchable: {
    borderRadius: 16,
    overflow: "hidden",
  },
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
  badgePending: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeTextPending: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  badgeApproved: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeTextApproved: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFF",
  },
  badgeActive: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeTextActive: {
    fontSize: 12,
    fontWeight: "600",
    color: "#166534",
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
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFF",
  },
  payButton: {
    backgroundColor: "#000",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: 4,
  },
  buttonTextWhite: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
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
  errorContainer: {
    backgroundColor: "#FDE2E2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  errorText: {
    color: "#B00020",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
};

export default BookingList;
