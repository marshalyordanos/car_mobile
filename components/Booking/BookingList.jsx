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
  RefreshControl,
  ScrollView,
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
import api from "../../redux/api";
import LottieView from "lottie-react-native";
import StatusModal from "../utils/StatusModal";
import { MaterialIcons } from "@expo/vector-icons";
import { Toast } from "toastify-react-native";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatPrice = (value) => {
  if (!value || isNaN(value)) return "0.00";
  return parseFloat(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const transformBookingData = (bookings, userId) => {
  if (!Array.isArray(bookings)) {
    console.error("Bookings is not an array:", bookings);
    return [];
  }
  return bookings.map((booking) => {
    const statusMap = {
      PENDING: "pending",
      CONFIRMED: "confirmed",
      REJECTED: "rejected",
      CANCELLED_BY_GUEST: "cancelled",
      CANCELLED_BY_HOST: "cancelled",
      COMPLETED: "completed",
    };
    return {
      id: booking.id,
      carName: booking.car?.make?.name || "Unknown Make",
      carModel: booking.car?.model?.name || "Unknown Model",
      renterName: `${booking.guest?.firstName || "Unknown"} ${
        booking.guest?.lastName || "Guest"
      }`,
      hostName: `${booking.host?.firstName} ${booking.host?.lastName}`,
      hostId: booking.host?.id,

      status: statusMap[booking.status],
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
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedInnspection, setSelectedInspection] = useState(null);

  const [accpetCarModal, setaccpetCarModal] = useState(false);
  const [returnCarModal, setreturnCarModal] = useState(false);
  const [accpetCarModalLoading, setaccpetCarModalLoading] = useState(false);
  const [returnCarModalLoading, setreturnCarModalLoading] = useState(false);
  const [isDropOfCreate, setIsDropOffCreate] = useState(null);

  const fetchBooking = async () => {
    try {
      setIsLoading(true);
      let params;
      if (selectedStatus) {
        params = { filter: `status:${selectedStatus.toLocaleUpperCase()}` };
      } else {
        params = {};
      }

      console.log("--------------------------------------------:", params);
      const res = await api.get("bookings/my", { params: params });

      const initialBookings = transformBookingData(res.data.data, user.id);

      setBookings(initialBookings);
      // console.log("bokingresres", res.data);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // if (user) {
    fetchBooking();
    // const initialBookings = transformBookingData(mockBookings, user.id);
    // setBookings(initialBookings);
    // }sssss
  }, [selectedStatus]);

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <View style={styles.badgePending}>
            <Text style={styles.badgeTextPending}>Pending</Text>
          </View>
        );
      case "confirmed":
        return (
          <View style={styles.badgeActive}>
            <Text style={styles.badgeTextActive}>Confirmed</Text>
          </View>
          // <View style={styles.badgeApproved}>
          //   <Text style={styles.badgeTextApproved}>Confirmed</Text>
          // </View>
        );
      case "rejected":
        return (
          <View style={[styles.badgeActive, { backgroundColor: "#fecaca" }]}>
            <Text style={[styles.badgeTextActive, { color: "#c2410c" }]}>
              Rejected
            </Text>
          </View>
        );
      case "completed":
        return (
          <View style={styles.badgeActive}>
            <Text style={styles.badgeTextActive}>Completed</Text>
          </View>
        );
      case "cancelled":
        return (
          <View style={[styles.badgeActive, { backgroundColor: "#fecaca" }]}>
            <Text style={[styles.badgeTextActive, { color: "#c2410c" }]}>
              Cancelled
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  const BookingCard = ({ booking, onOpenChat, onCancel, onPay, onPress }) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => (scale.value = withSpring(0.98));
    const handlePressOut = () => (scale.value = withSpring(1));

    // const isDropOffDate = new Date() >= new Date(booking.endDate);
    const canCreateDropOff =
      booking.inspections.some((i) => i.type === "PICKUP" && i.approved) &&
      !booking.inspections.some((i) => i.type === "DROPOFF");

    const pickUp = booking.inspections?.find((i) => i.type === "PICKUP");
    const dropOff = booking.inspections?.find((i) => i.type === "DROPOFF");

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
              <Text style={styles.renterName}>{booking.hostName}</Text>
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
          {/* {booking.inspections?.length > 0 && (
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
          )} */}
          {pickUp && pickUp?.approved && (
            <View
              style={[
                styles.status,
                { backgroundColor: "#bbf7d0", width: 150 },
              ]}
            >
              <Text style={{ color: "#166534" }}>Car Received</Text>
            </View>
          )}
          {dropOff && dropOff?.approved && (
            <View
              style={[
                styles.status,
                { backgroundColor: "#bbf7d0", width: 150 },
              ]}
            >
              <Text style={{ color: "#166534" }}>Car Returned</Text>
            </View>
          )}

          {dropOff &&
            dropOff?.submittedById == user?.user?.id &&
            !dropOff?.approved && (
              <View
                style={[
                  styles.status,
                  { backgroundColor: "#f0e3a6", justifyContent: "flex-start" },
                ]}
              >
                <Text style={{ color: "#654916", textAlign: "left" }}>
                  Waiting for host to confirm return
                </Text>
              </View>
            )}
          {/* {canCreateDropOff && (
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
          )} */}
          <View style={styles.priceRow}>
            {/* <Text style={styles.priceLabel}>Total Price</Text> */}
            <View></View>
            <Text style={[styles.priceValue, { marginTop: 15 }]}>
              {formatPrice(booking.price)} {booking.currency}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            {!["pending", "rejected"].includes(booking?.status) && (
              <TouchableOpacity
                style={styles.messageButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onOpenChat(booking);
                }}
              >
                <MessageCircle color="#6B7280" size={20} />
              </TouchableOpacity>
            )}
            {pickUp && !pickUp.approved && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "black" }]}
                onPress={(e) => {
                  e.stopPropagation();
                  // onCancel(booking.id);
                  setaccpetCarModal(true);
                  setSelectedInspection(pickUp);
                  console.log(
                    "[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[:",
                    pickUp
                  );
                }}
              >
                {/* <X color="#6B7280" size={16} style={styles.iconMargin} /> */}
                <Text style={styles.buttonTextWhite}>Accept Car</Text>
              </TouchableOpacity>
            )}

            {(canCreateDropOff ||
              (dropOff &&
                !dropOff?.approved &&
                dropOff?.submittedById !== user?.user?.id)) && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "black" }]}
                onPress={(e) => {
                  e.stopPropagation();
                  if (canCreateDropOff) {
                    setIsDropOffCreate(booking);
                  } else {
                    setSelectedInspection(dropOff);
                  }
                  // onCancel(booking.id);
                  setreturnCarModal(true);
                }}
              >
                {/* <X color="#6B7280" size={16} style={styles.iconMargin} /> */}
                <Text style={styles.buttonTextWhite}>Return Car</Text>
              </TouchableOpacity>
            )}

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
            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };
  const onRefresh = () => {
    fetchBooking();
  };

  return (
    <>
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
          ListHeaderComponent={
            <View
              style={{
                // borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                {[
                  "Confirmed",
                  "Pending",
                  "Completed",
                  "rejected",
                  "Cancelled",
                ].map((status) => {
                  return (
                    <TouchableOpacity
                      key={status}
                      onPress={() => {
                        if (selectedStatus == status) {
                          setSelectedStatus("");
                        } else {
                          setSelectedStatus(status);
                        }
                      }}
                      style={{ marginHorizontal: 5, marginBottom: 25 }}
                    >
                      <View
                        style={[
                          styles.badgePending,
                          {
                            borderWidth: 1,
                            borderColor: "#cbd5e1",
                            borderRadius: 5,
                            backgroundColor:
                              selectedStatus == status ? "black" : "white",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeTextPending,
                            {
                              color:
                                selectedStatus == status ? "white" : "balck",
                            },
                          ]}
                        >
                          {status}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {isLoading && (
                <LottieView
                  source={require("../../assets/loading.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              )}
            </View>
          }
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              onOpenChat={onOpenChat}
              onCancel={handleCancel}
              onPay={handlePay}
              onPress={(booking) =>
                router.push({
                  pathname: "/booking/booking-detail",
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
          refreshControl={
            <RefreshControl
              // colors={["transparent"]} // hide android spinner
              // tintColor="transparent" // hide iOS spinner
              refreshing={isLoading}
              onRefresh={onRefresh}
            />
          }
        />
      )}

      <StatusModal
        visible={accpetCarModal}
        onClose={() => {
          setaccpetCarModal(false);
          setSelectedInspection(null);
        }}
        type="info"
        icon={<MaterialIcons name="error-outline" size={44} color="#338fd5" />}
        title="Are you accepted the car"
        message=" "
        primaryLabel="Yes"
        secondaryLabel={"Close"}
        onSecondaryPress={() => {
          setaccpetCarModal(false);
          setSelectedInspection(null);
        }}
        onPrimaryPress={async () => {
          try {
            setaccpetCarModalLoading(true);

            const res = await api.patch(
              "bookings/inspection/approve/" + selectedInnspection.id
            );

            fetchBooking();
            setaccpetCarModal(false);
            setaccpetCarModalLoading(false);
            setSelectedInspection(null);
          } catch (error) {
            setaccpetCarModal(false);
            Toast.show({
              type: "error",
              text1: error?.response?.data?.message || "Something want wrong!",
              text2: "",
              props: {
                style: { fontSize: 20 },
                textStyle: { flexWrap: "wrap" },
              },
            });
            setaccpetCarModalLoading(false);
            setSelectedInspection(null);
          }
        }}
        loading={accpetCarModalLoading}
      />
      <StatusModal
        visible={returnCarModal}
        onClose={() => {
          setreturnCarModal(false);
          setSelectedInspection(null);
          setIsDropOffCreate(null);
        }}
        type="info"
        icon={<MaterialIcons name="error-outline" size={44} color="#338fd5" />}
        title="Are you returning the car"
        message=" "
        primaryLabel="Yes"
        secondaryLabel={"Close"}
        onSecondaryPress={() => {
          setreturnCarModal(false);
          setSelectedInspection(null);
          setIsDropOffCreate(null);
        }}
        onPrimaryPress={async () => {
          try {
            setreturnCarModalLoading(true);
            console.log("wwwwwwwwwwwwwwwww: ", error, isDropOfCreate);

            if (isDropOfCreate) {
              const res = await api.post("bookings/inspection", {
                bookingId: isDropOfCreate.id,
                type: "DROPOFF",
                fuelLevel: 0,
                mileage: 0,
              });
            } else {
              const res = await api.patch(
                "bookings/inspection/approve/" + selectedInnspection.id
              );
            }

            fetchBooking();
            setreturnCarModalLoading(false);
            setreturnCarModal(false);
            setSelectedInspection(null);
            setIsDropOffCreate(null);
          } catch (error) {
            console.log("wwwwwwwwwwwwwwwww: ", error, isDropOfCreate);
            setaccpetCarModal(false);
            Toast.show({
              type: "error",
              text1: error?.response?.data?.message || "Something want wrong!",
              text2: "",
              props: {
                style: { fontSize: 20 },
                textStyle: { flexWrap: "wrap" },
              },
            });
            setreturnCarModalLoading(false);
            setSelectedInspection(null);
            setIsDropOffCreate(null);
            setreturnCarModal(false);
          }
        }}
        loading={returnCarModalLoading}
      />
      {/* <InspectionForm
        bookingId={currentBookingId}
        visible={inspectionVisible}
        onClose={() => setInspectionVisible(false)}
        onSubmit={handleCreateDropOffInspection}
      /> */}
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
    // marginBottom: 20,
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
  lottie: {
    width: 70,
    height: 70,
  },
  status: {
    // flex: 1,
    marginVertical: 4,
    flexDirection: "row",
    // height: 44,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
};

export default BookingList;
