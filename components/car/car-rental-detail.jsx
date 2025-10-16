import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const isWeb = Platform.OS === "web";

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    console.log("ErrorBoundary caught an error:", error);
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <Text style={styles.errorText}>Something went wrong</Text>;
    }
    return this.props.children;
  }
}

// Simple icon components
const ArrowLeftIcon = () => (
  <MaterialIcons name="arrow-back" style={styles.icon} />
);
const ShareIcon = () => <MaterialIcons name="share" style={styles.icon} />;
const HeartIcon = () => (
  <MaterialIcons name="favorite-outline" style={styles.icon} />
);
const StarIcon = ({ filled = false }) => (
  <MaterialIcons
    name="star"
    style={[styles.icon, { color: filled ? "#000000" : "#B0B0B0" }]}
  />
);
const EditIcon = () => (
  <View style={styles.editIcon}>
    <MaterialIcons name="edit" style={styles.editIconText} />
  </View>
);
const HelpIcon = () => (
  <MaterialIcons name="help-outline" style={styles.icon} />
);

export default function CarRentalDetail({ car }) {
  console.log("Received car prop (raw):", JSON.stringify(car, null, 2));

  const { width } = Dimensions.get("window");

  if (!car) {
    console.error("Car prop is missing or undefined:", JSON.stringify(car));
    return (
      <Text style={styles.errorText}>Car data is missing or incomplete</Text>
    );
  }

  // Move availableCities to avoid TDZ error
  const availableCities = [
    "Addis Ababa",
    "Dire Dawa",
    "Bahir Dar",
    "Gondar",
    "Mekele",
    "Adama",
    "Hawassa",
    "Jimma",
    "Dessie",
    "Jijiga",
    "Arba Minch",
    "Debre Markos",
    "Shashemene",
    "Hosaena",
    "Nekemte",
  ];

  const isValidDate = (date) => {
    if (!date) return false;
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pickupLocation, setPickupLocation] = useState(
    car.location || "Not specified"
  );
  const [returnLocation, setReturnLocation] = useState(
    car.location || "Not specified"
  );
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [tempPickupLocation, setTempPickupLocation] = useState(
    car?.location && availableCities.includes(car.location)
      ? car.location
      : availableCities[0]
  );
  const [tempReturnLocation, setTempReturnLocation] = useState(
    car?.location && availableCities.includes(car.location)
      ? car.location
      : availableCities[0]
  );
  const [isInsuranceModalVisible, setIsInsuranceModalVisible] = useState(false);
  const tripStartDateDefault = new Date();
  const tripEndDateDefault = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const [tripStartDate, setTripStartDate] = useState(
    car?.tripStart && isValidDate(car.tripStart)
      ? new Date(car.tripStart)
      : tripStartDateDefault
  );
  const [tripEndDate, setTripEndDate] = useState(
    car?.tripEnd && isValidDate(car.tripEnd)
      ? new Date(car.tripEnd)
      : tripEndDateDefault
  );
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState(null); // 'start', 'end', or null
  const [dateError, setDateError] = useState("");
  const [totalPrice, setTotalPrice] = useState("N/A");

  // Calculate total price based on daily rate and trip duration
  useEffect(() => {
    const calculateTotalPrice = () => {
      if (!car.dailyRate || !tripStartDate || !tripEndDate) return "N/A";
      const days = Math.ceil(
        (tripEndDate - tripStartDate) / (1000 * 60 * 60 * 24)
      );
      if (days <= 0) return "N/A";
      let total = days * car.dailyRate;
      if (car.longTermDiscount && days >= 7) {
        total *= 1 - car.longTermDiscount / 100;
      }
      return total.toFixed(2);
    };
    setTotalPrice(calculateTotalPrice());
  }, [tripStartDate, tripEndDate, car.dailyRate, car.longTermDiscount]);

  // Format price for display
  const formatPrice = (value) => {
    if (value === "N/A" || typeof value !== "string") return "N/A";
    return parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Enhanced image source normalization
  const normalizeImageSource = (img) => {
    console.log("Normalizing image source:", img);
    if (typeof img === "string" && img.trim()) {
      return { uri: img };
    } else if (
      img &&
      (typeof img === "string" || (typeof img === "object" && img.default))
    ) {
      return { uri: typeof img === "string" ? img : img.default };
    } else if (
      img &&
      typeof img === "object" &&
      img.uri &&
      typeof img.uri === "string" &&
      img.uri.trim()
    ) {
      return { uri: img.uri };
    }
    console.warn("Invalid image source, returning null:", img);
    return null;
  };

  let images = [];
  if (Array.isArray(car.image)) {
    images = car.image
      .map((img) => normalizeImageSource(img))
      .filter((img) => img !== null && img.uri);
  } else if (car.image) {
    const normalized = normalizeImageSource(car.image);
    images = normalized ? [normalized] : [];
  } else {
    console.warn("No valid image or images found in car prop");
  }
  console.log("Processed images array:", JSON.stringify(images, null, 2));

  const renderRatingBar = (category) => (
    <View key={category} style={styles.ratingRow}>
      <Text style={styles.ratingCategory}>{category}</Text>
      <View style={styles.ratingBarContainer}>
        <View style={styles.ratingBarBg}>
          <View style={styles.ratingBarFill} />
        </View>
        <Text style={styles.ratingValue}>5.0</Text>
      </View>
    </View>
  );

  const renderFeatureChip = (icon, text) => (
    <View key={text} style={styles.featureChip}>
      <MaterialIcons name={icon || "check-circle"} style={styles.featureIcon} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );

  const renderReviewCard = (review) => (
    <View
      key={`${review.reviewerId}-${review.comment}`}
      style={styles.reviewCard}
    >
      <View style={styles.reviewHeader}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.reviewerName}>
            {review.reviewerId || "Guest"}
          </Text>
          <Text style={styles.reviewDate}>Date not available</Text>
        </View>
      </View>
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} filled={i < (review.rating || 0)} />
        ))}
      </View>
      <Text style={styles.reviewText}>{review.comment || "No comment"}</Text>
    </View>
  );

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentImageIndex(index);
  };

  const handleEditDates = (mode = "start") => {
    console.log(`Edit button pressed for ${mode} date selection`);
    setDatePickerMode(mode);
    setDateError("");
    setIsDateModalVisible(true);
  };

  const handleEditLocation = () => {
    console.log("Edit button pressed for location selection");
    setTempPickupLocation(pickupLocation);
    setTempReturnLocation(returnLocation);
    setIsLocationModalVisible(true);
  };

  const handleConfirmLocation = () => {
    console.log("Confirm button pressed:", {
      pickup: tempPickupLocation,
      return: tempReturnLocation,
    });
    setPickupLocation(tempPickupLocation);
    setReturnLocation(tempReturnLocation);
    setIsLocationModalVisible(false);
  };

  const handleConfirmDates = () => {
    if (tripEndDate <= tripStartDate) {
      setDateError("End date must be after start date");
      return;
    }
    console.log("Confirm dates:", {
      start: tripStartDate.toISOString(),
      end: tripEndDate.toISOString(),
    });
    setIsDateModalVisible(false);
    setDatePickerMode(null);
    setDateError("");
  };

  const handleInsuranceModal = () => {
    console.log("Insurance help icon pressed");
    setIsInsuranceModalVisible(true);
  };

  const handleContinue = () => {
    console.log("Continue button pressed, navigating to Checkout");
    const serializableCar = {
      name: car.name,
      owner: car.owner,
      image: car.image,
      location: car.location,
      tripStart: car.tripStart,
      tripEnd: car.tripEnd,
      rating: car.rating,
      trips: car.trips,
      trim: car.trim,
      year: car.year,
      color: car.color,
      licensePlate: car.licensePlate,
      vin: car.vin,
      mileage: car.mileage,
      dailyRate: car.dailyRate,
      longTermDiscount: car.longTermDiscount,
      seatingCapacity: car.seatingCapacity,
      ecoFriendly: car.ecoFriendly,
      carType: car.carType,
      cancellation: car.cancellation,
      payment: car.payment,
      miles: car.miles,
      insurance: car.insurance,
      features: car.features,
      safetyFeatures: car.safetyFeatures,
      connectivity: car.connectivity,
      convenienceFeatures: car.convenienceFeatures,
      peaceOfMindFeatures: car.peaceOfMindFeatures,
      ratingCategories: car.ratingCategories,
      reviews: car.reviews,
      ratingCount: car.ratingCount,
      host: car.host,
      rules: car.rules,
      transmission: car.transmission,
      totalPrice, // Include calculated total price
    };
    console.log("Navigating with:", {
      car: serializableCar,
      pickupLocation,
      returnLocation,
      tripStartDate: tripStartDate.toISOString(),
      tripEndDate: tripEndDate.toISOString(),
    });
    try {
      router.push({
        pathname: "/Checkout",
        params: {
          car: JSON.stringify(serializableCar),
          pickupLocation,
          returnLocation,
          tripStartDate: tripStartDate.toISOString(),
          tripEndDate: tripEndDate.toISOString(),
        },
      });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      console.log(`${datePickerMode} date picker dismissed`);
      setIsDateModalVisible(false);
      setDatePickerMode(null);
      setDateError("");
      return;
    }
    const currentDate =
      selectedDate && isValidDate(selectedDate)
        ? new Date(selectedDate)
        : datePickerMode === "start"
        ? tripStartDate
        : tripEndDate;
    console.log(
      `Date changed: ${datePickerMode} -> ${currentDate.toISOString()}`
    );
    if (datePickerMode === "start") {
      setTripStartDate(currentDate);
      setDatePickerMode("end");
      if (currentDate >= tripEndDate) {
        const newEndDate = new Date(
          currentDate.getTime() + 24 * 60 * 60 * 1000
        );
        console.log(`Adjusting end date to: ${newEndDate.toISOString()}`);
        setTripEndDate(newEndDate);
      }
    } else {
      setTripEndDate(currentDate);
      setDatePickerMode(null);
    }
    setDateError("");
  };

  const onWebDateChange = (event, mode) => {
    const selectedDate = new Date(event.target.value);
    if (isValidDate(selectedDate)) {
      console.log(`Web date changed: ${mode} -> ${selectedDate.toISOString()}`);
      if (mode === "start") {
        setTripStartDate(selectedDate);
        if (selectedDate >= tripEndDate) {
          const newEndDate = new Date(
            selectedDate.getTime() + 24 * 60 * 60 * 1000
          );
          console.log(`Adjusting end date to: ${newEndDate.toISOString()}`);
          setTripEndDate(newEndDate);
        }
      } else {
        setTripEndDate(selectedDate);
      }
      setDateError("");
    } else {
      setDateError("Invalid date selected");
    }
  };

  const formatDate = (date) => {
    if (!isValidDate(date)) {
      console.warn("Invalid date in formatDate:", date);
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateForInput = (date) => {
    if (!isValidDate(date)) return "";
    return date.toISOString().split("T")[0];
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                console.log("Back button pressed");
                router.back();
              }}
              accessibilityLabel="Go back"
            >
              <ArrowLeftIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{car.name || "Unknown Car"}</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerAction}>
                <ShareIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction}>
                <HeartIcon />
              </TouchableOpacity>
            </View>
          </View>

          {/* Car Image */}
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {images.length > 0 ? (
                images.map((image, index) => (
                  <Image
                    key={image.uri || `image-${index}`}
                    source={image}
                    style={[styles.carImage, { width }]}
                    resizeMode="cover"
                  />
                ))
              ) : (
                <Text style={styles.noImageText}>
                  No valid images available
                </Text>
              )}
            </ScrollView>
            {images.length > 0 && (
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1}/{images.length}
                </Text>
              </View>
            )}
          </View>

          {/* Car Info */}
          <View style={styles.section}>
            <Text style={styles.ownerText}>{car.owner || "Unknown"}'s</Text>
            <Text style={styles.carTitle}>
              {car.name || "Unknown"} {car.year || ""}
            </Text>
            <Text style={styles.carSubtitle}>{car.trim || "N/A"}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingScore}>{car.rating || "N/A"}</Text>
              <StarIcon filled={true} />
              <Text style={styles.ratingCount}>({car.trips || 0} trips)</Text>
            </View>
          </View>

          {/* Vehicle Details */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <MaterialIcons name="directions-car" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Vehicle Details</Text>
            </View>
            <View style={styles.vehicleDetails}>
              <View style={styles.vehicleDetailRow}>
                <Text style={styles.vehicleDetailLabel}>Type</Text>
                <Text style={styles.vehicleDetailValue}>
                  {car.carType || "Not specified"}
                </Text>
              </View>
              <View style={styles.vehicleDetailRow}>
                <Text style={styles.vehicleDetailLabel}>Color</Text>
                <Text style={styles.vehicleDetailValue}>
                  {car.color || "Not specified"}
                </Text>
              </View>
              <View style={styles.vehicleDetailRow}>
                <Text style={styles.vehicleDetailLabel}>License Plate</Text>
                <Text style={styles.vehicleDetailValue}>
                  {car.licensePlate || "Not specified"}
                </Text>
              </View>
              <View style={styles.vehicleDetailRow}>
                <Text style={styles.vehicleDetailLabel}>VIN</Text>
                <Text style={styles.vehicleDetailValue}>
                  {car.vin || "Not specified"}
                </Text>
              </View>
              <View style={styles.vehicleDetailRow}>
                <Text style={styles.vehicleDetailLabel}>Daily Rate</Text>
                <Text style={styles.vehicleDetailValue}>
                  {car.dailyRate
                    ? `ETB ${formatPrice(car.dailyRate.toString())}`
                    : "Not specified"}
                </Text>
              </View>
            </View>
          </View>

          {/* Your Trip */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <MaterialIcons name="calendar-today" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Your Trip</Text>
            </View>
            <View style={styles.tripRow}>
              <View style={styles.tripInfo}>
                <MaterialIcons name="calendar-today" style={styles.tripIcon} />
                <View>
                  <Text style={styles.tripLabel}>Trip dates</Text>
                  <Text style={styles.tripDetail}>
                    {formatDate(tripStartDate)}
                  </Text>
                  <Text style={styles.tripDetail}>
                    {formatDate(tripEndDate)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleEditDates("start")}
                accessibilityLabel="Edit trip dates"
              >
                <EditIcon />
              </TouchableOpacity>
            </View>
            <View style={styles.tripRow}>
              <View style={styles.tripInfo}>
                <MaterialIcons name="location-pin" style={styles.tripIcon} />
                <View>
                  <Text style={styles.tripLabel}>Pickup & return city</Text>
                  <Text style={styles.tripDetail}>
                    {pickupLocation}{" "}
                    {pickupLocation === returnLocation
                      ? ""
                      : `/ ${returnLocation}`}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleEditLocation}
                accessibilityLabel="Edit pickup and return city"
              >
                <EditIcon />
              </TouchableOpacity>
            </View>
          </View>

          {/* Cancellation Policy */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <MaterialIcons name="cancel" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Cancellation Policy</Text>
            </View>
            <View style={styles.policyItem}>
              <View>
                <Text style={styles.policyTitle}>
                  {car.cancellation?.title || "Not specified"}
                </Text>
                <Text style={styles.policyDesc}>
                  {car.cancellation?.desc || "No details available"}
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Options */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <MaterialIcons name="payment" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Payment Options</Text>
            </View>
            <View style={styles.policyItem}>
              <View>
                <Text style={styles.policyTitle}>
                  {car.payment?.title || "Not specified"}
                </Text>
                <Text style={styles.policyDesc}>
                  {car.payment?.desc || "No details available"}
                </Text>
              </View>
            </View>
          </View>

          {/* Miles Included */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <MaterialIcons name="speed" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Miles</Text>
            </View>
            <View style={styles.policyItem}>
              <View>
                <Text style={styles.policyTitle}>
                  {car.miles?.title || "Not specified"}
                </Text>
                <Text style={styles.policyDesc}>
                  {car.miles?.desc || "No details available"}
                </Text>
              </View>
            </View>
            <View style={styles.vehicleDetailRow}>
              <Text style={styles.vehicleDetailLabel}>Current Mileage</Text>
              <Text style={styles.vehicleDetailValue}>
                {car.mileage ? `${car.mileage} miles` : "Not specified"}
              </Text>
            </View>
          </View>

          {/* Insurance & Protection */}
          <View style={styles.section}>
            <View style={styles.insuranceHeader}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <MaterialIcons name="security" style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Insurance & Protection</Text>
              </View>
              <TouchableOpacity
                onPress={handleInsuranceModal}
                accessibilityLabel="View insurance details"
              >
                <HelpIcon />
              </TouchableOpacity>
            </View>
            <View style={styles.insuranceInfo}>
              <View>
                <Text style={styles.insuranceProvider}>
                  {car.insurance?.provider || "Not specified"}
                </Text>
              </View>
            </View>
          </View>

          {/* Deluxe Class */}
          <View style={styles.section}>
            <View style={styles.deluxeHeader}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <MaterialIcons name="verified" style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Deluxe Class</Text>
              </View>
              <TouchableOpacity accessibilityLabel="View deluxe class details">
                <HelpIcon />
              </TouchableOpacity>
            </View>
            <Text style={styles.deluxeDescription}>
              This exclusive car has additional safety checks for guests under
              30.
            </Text>
          </View>

          {/* Vehicle Features */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <MaterialIcons name="build" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Vehicle Features</Text>
            </View>
            <View style={styles.featuresGrid}>
              {car.features?.map((feature) =>
                renderFeatureChip(feature.icon, feature.text)
              ) || <Text style={styles.noDataText}>No features available</Text>}
            </View>
            <View style={styles.featureChipSingle}>
              <MaterialIcons name="settings" style={styles.featureIcon} />
              <Text style={styles.featureText}>
                {car.transmission || "Not specified"}
              </Text>
            </View>
            <View style={styles.featureChipSingle}>
              <MaterialIcons name="people" style={styles.featureIcon} />
              <Text style={styles.featureText}>
                {car.seatingCapacity
                  ? `${car.seatingCapacity} seats`
                  : "Not specified"}
              </Text>
            </View>
          </View>

          {/* Safety */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <MaterialIcons name="security" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Safety</Text>
            </View>
            <View style={styles.listContainer}>
              {car.safetyFeatures?.map((feature, index) => (
                <Text key={index} style={styles.listItem}>
                  {feature}
                </Text>
              )) || (
                <Text style={styles.noDataText}>
                  No safety features available
                </Text>
              )}
              <Text style={styles.listItem}>
                {car.ecoFriendly
                  ? `Eco-Friendly: ${car.ecoFriendly}`
                  : "Eco-Friendly: Not specified"}
              </Text>
            </View>
          </View>

          {/* Device Connectivity */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <MaterialIcons name="wifi" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Device Connectivity</Text>
            </View>
            <View style={styles.listContainer}>
              {car.connectivity?.map((feature, index) => (
                <Text key={index} style={styles.listItem}>
                  {feature}
                </Text>
              )) || (
                <Text style={styles.noDataText}>
                  No connectivity features available
                </Text>
              )}
            </View>
          </View>

          {/* Included in the Price */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <MaterialIcons name="check" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Included in the Price</Text>
            </View>
            <Text style={styles.subsectionTitle}>Convenience</Text>
            <View style={styles.featureList}>
              {car.convenienceFeatures?.map((feature) => (
                <View key={feature.title} style={styles.featureItem}>
                  <View style={styles.featureItemContent}>
                    <Text style={styles.featureItemTitle}>{feature.title}</Text>
                    {feature.desc && (
                      <Text style={styles.featureItemDesc}>{feature.desc}</Text>
                    )}
                  </View>
                </View>
              )) || (
                <Text style={styles.noDataText}>
                  No convenience features available
                </Text>
              )}
            </View>
            <Text style={styles.subsectionTitle}>Peace of Mind</Text>
            <View style={styles.featureList}>
              {car.peaceOfMindFeatures?.map((feature) => (
                <View key={feature.title} style={styles.featureItem}>
                  <Text style={styles.featureItemTitle}>{feature.title}</Text>
                </View>
              )) || (
                <Text style={styles.noDataText}>
                  No peace of mind features available
                </Text>
              )}
            </View>
            <Text style={styles.subsectionTitle}>Discounts</Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureItemTitle}>Long-Term Discount</Text>
                <Text style={styles.featureItemDesc}>
                  {car.longTermDiscount
                    ? `${car.longTermDiscount}% off for extended rentals`
                    : "Not available"}
                </Text>
              </View>
            </View>
          </View>

          {/* Ratings and Reviews */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <MaterialIcons name="star" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Ratings and Reviews</Text>
            </View>
            <View style={styles.overallRating}>
              <Text style={styles.overallRatingScore}>
                {car.rating || "N/A"}
              </Text>
              <StarIcon filled={true} />
              <Text style={styles.overallRatingCount}>
                ({car.ratingCount || 0} ratings)
              </Text>
            </View>
            <View style={styles.ratingsBreakdown}>
              {car.ratingCategories?.map((category) =>
                renderRatingBar(category)
              ) || <Text style={styles.noDataText}>No ratings available</Text>}
            </View>
            <Text style={styles.ratingsNote}>
              Based on {car.ratingCount ? car.ratingCount - 1 : 0} guest ratings
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.reviewsScroll}
            >
              {car.reviews?.length > 0 ? (
                car.reviews.map((review) => renderReviewCard(review))
              ) : (
                <Text style={styles.noDataText}>No reviews available</Text>
              )}
            </ScrollView>
            <TouchableOpacity>
              <Text style={styles.seeAllReviews}>SEE ALL REVIEWS</Text>
            </TouchableOpacity>
          </View>

          {/* Hosted By */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <MaterialIcons name="person" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Hosted By</Text>
            </View>
            <View style={styles.hostContainer}>
              <View style={styles.hostImageContainer}>
                <Image
                  source={
                    normalizeImageSource(car.host?.image) || {
                      uri: "https://via.placeholder.com/60",
                    }
                  }
                  style={styles.hostImage}
                />
                <View style={styles.hostRating}>
                  <Text style={styles.hostRatingText}>
                    {car.host?.rating || "N/A"}
                  </Text>
                  <StarIcon filled={true} />
                </View>
              </View>
              <View>
                <Text style={styles.hostName}>
                  {car.host?.name || "Unknown"}
                </Text>
                <Text style={styles.hostInfo}>
                  {car.host?.info || "No info available"}
                </Text>
              </View>
            </View>
          </View>

          {/* Rules of the Road */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <MaterialIcons name="rule" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Rules of the Road</Text>
            </View>
            <View style={styles.rulesList}>
              {car.rules?.map((rule) => (
                <View key={rule.title} style={styles.ruleItem}>
                  <View>
                    <Text style={styles.ruleTitle}>{rule.title}</Text>
                    <Text style={styles.ruleDesc}>{rule.desc}</Text>
                  </View>
                </View>
              )) || <Text style={styles.noDataText}>No rules available</Text>}
              <Text style={styles.vehicleDetailValue}>
                {car.seatingCapacity
                  ? `${car.seatingCapacity} seats`
                  : "Not specified"}
              </Text>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Date Selection Modal */}
        <Modal
          visible={isDateModalVisible}
          animationType="slide"
          transparent={false} // Changed to false for white background
          onRequestClose={() => {
            console.log("Date modal closed via onRequestClose");
            setIsDateModalVisible(false);
            setDatePickerMode(null);
            setDateError("");
          }}
        >
          <ErrorBoundary>
            <View style={[styles.modalOverlay, { backgroundColor: "#FFFFFF" }]}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Trip Dates</Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log("Close date modal");
                      setIsDateModalVisible(false);
                      setDatePickerMode(null);
                      setDateError("");
                    }}
                    accessibilityLabel="Close date selection modal"
                  >
                    <MaterialIcons name="close" style={styles.modalCloseIcon} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSubtitle}>Trip Dates</Text>
                  {dateError ? (
                    <Text style={styles.errorText}>{dateError}</Text>
                  ) : null}
                  {isWeb ? (
                    <View style={styles.webDateContainer}>
                      <View style={styles.webDateField}>
                        <Text style={styles.webDateLabel}>Start Date</Text>
                        <input
                          type="date"
                          value={formatDateForInput(tripStartDate)}
                          onChange={(e) => onWebDateChange(e, "start")}
                          min={formatDateForInput(new Date())}
                          style={styles.webDateInput}
                        />
                      </View>
                      <View style={styles.webDateField}>
                        <Text style={styles.webDateLabel}>End Date</Text>
                        <input
                          type="date"
                          value={formatDateForInput(tripEndDate)}
                          onChange={(e) => onWebDateChange(e, "end")}
                          min={formatDateForInput(
                            new Date(
                              tripStartDate.getTime() + 24 * 60 * 60 * 1000
                            )
                          )}
                          style={styles.webDateInput}
                        />
                      </View>
                    </View>
                  ) : (
                    <>
                      <View style={styles.dateSummary}>
                        <Text style={styles.dateSummaryText}>
                          Start: {formatDate(tripStartDate)}
                        </Text>
                        <Text style={styles.dateSummaryText}>
                          End: {formatDate(tripEndDate)}
                        </Text>
                        <View style={styles.dateEditButtons}>
                          <TouchableOpacity
                            style={styles.editDateButton}
                            onPress={() => setDatePickerMode("start")}
                            accessibilityLabel="Edit start date"
                          >
                            <Text style={styles.editDateButtonText}>
                              Edit Start Date
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.editDateButton}
                            onPress={() => setDatePickerMode("end")}
                            accessibilityLabel="Edit end date"
                          >
                            <Text style={styles.editDateButtonText}>
                              Edit End Date
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {DateTimePicker && datePickerMode && (
                        <DateTimePicker
                          value={
                            datePickerMode === "start"
                              ? tripStartDate
                              : tripEndDate
                          }
                          mode="date"
                          display="spinner"
                          onChange={onDateChange}
                          minimumDate={
                            datePickerMode === "start"
                              ? new Date()
                              : new Date(
                                  tripStartDate.getTime() + 24 * 60 * 60 * 1000
                                )
                          }
                          style={styles.datePicker}
                        />
                      )}
                    </>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      dateError && styles.disabledButton,
                    ]}
                    onPress={handleConfirmDates}
                    disabled={!!dateError}
                    accessibilityLabel="Confirm trip dates"
                  >
                    <Text style={styles.confirmButtonText}>Confirm Dates</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ErrorBoundary>
        </Modal>

        {/* Location Selection Modal */}
        <Modal
          visible={isLocationModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            console.log("Location modal closed via onRequestClose");
            setIsLocationModalVisible(false);
          }}
        >
          <ErrorBoundary>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    Select Pickup and Return Cities
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log("Close location modal");
                      setIsLocationModalVisible(false);
                    }}
                    accessibilityLabel="Close location selection modal"
                  >
                    <MaterialIcons name="close" style={styles.modalCloseIcon} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSubtitle}>Pickup City</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={tempPickupLocation}
                      onValueChange={(itemValue) => {
                        console.log("Selected pickup city:", itemValue);
                        setTempPickupLocation(itemValue);
                      }}
                      style={styles.picker}
                    >
                      {availableCities.map((city) => (
                        <Picker.Item
                          key={`pickup-${city}`}
                          label={city}
                          value={city}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSubtitle}>Return City</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={tempReturnLocation}
                      onValueChange={(itemValue) => {
                        console.log("Selected return city:", itemValue);
                        setTempReturnLocation(itemValue);
                      }}
                      style={styles.picker}
                    >
                      {availableCities.map((city) => (
                        <Picker.Item
                          key={`return-${city}`}
                          label={city}
                          value={city}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmLocation}
                  accessibilityLabel="Confirm pickup and return cities"
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ErrorBoundary>
        </Modal>

        {/* Insurance & Protection Modal */}
        <Modal
          visible={isInsuranceModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            console.log("Insurance modal closed via onRequestClose");
            setIsInsuranceModalVisible(false);
          }}
        >
          <ErrorBoundary>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Insurance & Protection</Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log("Close insurance modal");
                      setIsInsuranceModalVisible(false);
                    }}
                    accessibilityLabel="Close insurance modal"
                  >
                    <MaterialIcons name="close" style={styles.modalCloseIcon} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.insuranceContent}>
                  <Text style={styles.insuranceText}>
                    For car rentals in Ethiopia, basic insurance like Collision
                    Damage Waiver (CDW) is typically included, covering damage
                    to the rental vehicle with a potential excess (e.g., up to
                    $5,000). Optional protections include: Theft Waiver (TW):
                    Covers theft or vandalism. Third-Party Liability: Mandatory
                    in Ethiopia, with rates updated to 4,360 birr annually as of
                    August 2025. Additional Coverage: Available through local
                    providers like Ethiopian Insurance Corporation or
                    international options like AXA.
                    {"\n\n"}Tips: Review your rental agreement carefully,
                    consider third-party insurance for savings (up to 50% less
                    than rental desk rates), and take photos of the car at
                    pickup and return to avoid disputes. Contact your rental
                    company or local insurers for tailored plans.
                  </Text>
                </ScrollView>
              </View>
            </View>
          </ErrorBoundary>
        </Modal>

        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.totalPrice}>
              ETB {formatPrice(totalPrice)} total
            </Text>
            {totalPrice === "N/A" && (
              <Text style={styles.errorText}>
                Price unavailable. Please check car details or dates.
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.continueButton,
              totalPrice === "N/A" && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={totalPrice === "N/A"}
            accessibilityLabel="Continue to checkout"
          >
            <MaterialIcons name="arrow-forward" style={styles.buttonIcon} />
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#000000" },
  headerActions: { flexDirection: "row", gap: 12 },
  headerAction: { padding: 4 },
  icon: { fontSize: 20, color: "#000000" },
  sectionIcon: { fontSize: 20, color: "#000000" },
  buttonIcon: { fontSize: 20, color: "#FFFFFF", marginRight: 8 },
  imageContainer: { position: "relative" },
  carImage: { height: 256 },
  imageCounter: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  imageCounterText: { color: "#FFFFFF", fontSize: 14 },
  noImageText: {
    color: "#666666",
    fontSize: 16,
    textAlign: "center",
    padding: 16,
  },
  section: { padding: 16, borderTopWidth: 1, borderTopColor: "#E0E0E0" },
  ownerText: { color: "#4B4B4B", fontSize: 14 },
  carTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 2,
  },
  carSubtitle: { color: "#4B4B4B", fontSize: 14, marginTop: 2 },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingScore: { fontSize: 18, fontWeight: "bold", color: "#000000" },
  ratingCount: { color: "#4B4B4B", fontSize: 14 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  tripRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  tripInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    flex: 1,
  },
  tripIcon: { fontSize: 20, marginTop: 2, color: "#000000" },
  tripLabel: { fontWeight: "600", color: "#000000", fontSize: 16 },
  tripDetail: { color: "#4B4B4B", fontSize: 14, marginTop: 2 },
  editIcon: {
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 4,
    padding: 4,
    zIndex: 1,
  },
  editIconText: { color: "#000000", fontSize: 16 },
  deluxeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deluxeDescription: {
    color: "#4B4B4B",
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  featureChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    minWidth: "45%",
  },
  featureChipSingle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    alignSelf: "flex-start",
  },
  featureIcon: { fontSize: 16, color: "#000000" },
  featureText: { color: "#000000", fontSize: 14 },
  listContainer: { gap: 12 },
  listItem: { color: "#666666", fontSize: 16 },
  noDataText: { color: "#666666", fontSize: 14 },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
    marginTop: 8,
  },
  featureList: { gap: 16, marginBottom: 24 },
  featureItem: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  featureItemContent: { flex: 1 },
  featureItemTitle: {
    fontWeight: "500",
    color: "#000000",
    fontSize: 16,
    lineHeight: 22,
  },
  featureItemDesc: {
    color: "#4B4B4B",
    fontSize: 14,
    marginTop: 2,
    lineHeight: 20,
  },
  overallRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  overallRatingScore: { fontSize: 24, fontWeight: "bold", color: "#000000" },
  overallRatingCount: { color: "#4B4B4B", fontSize: 16 },
  ratingsBreakdown: { gap: 12, marginBottom: 16 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingCategory: { color: "#666666", fontSize: 16 },
  ratingBarContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  ratingBarBg: {
    width: 128,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
  },
  ratingBarFill: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
    borderRadius: 4,
  },
  ratingValue: { color: "#000000", fontSize: 14, minWidth: 24 },
  ratingsNote: { color: "#4B4B4B", fontSize: 14, marginBottom: 16 },
  reviewsScroll: { marginBottom: 8 },
  reviewCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    padding: 16,
    marginRight: 16,
    width: 280,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: "#B0B0B0",
    borderRadius: 16,
  },
  reviewerName: { fontWeight: "500", color: "#000000", fontSize: 14 },
  reviewDate: { color: "#4B4B4B", fontSize: 12 },
  starsContainer: { flexDirection: "row", gap: 2, marginBottom: 8 },
  reviewText: { color: "#666666", fontSize: 14, lineHeight: 20 },
  seeAllReviews: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  hostContainer: { flexDirection: "row", alignItems: "center", gap: 12 },
  hostImageContainer: { position: "relative" },
  hostImage: { width: 60, height: 60, borderRadius: 30 },
  hostRating: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  hostRatingText: { color: "#000000", fontSize: 12 },
  hostName: { fontWeight: "bold", color: "#000000", fontSize: 18 },
  hostInfo: { color: "#4B4B4B", fontSize: 14 },
  rulesList: { gap: 16 },
  ruleItem: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  ruleTitle: { fontWeight: "500", color: "#000000", fontSize: 16 },
  ruleDesc: { color: "#4B4B4B", fontSize: 14, marginTop: 2, lineHeight: 20 },
  policyItem: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  policyTitle: { fontWeight: "500", color: "#000000", fontSize: 16 },
  policyDesc: { color: "#4B4B4B", fontSize: 14, marginTop: 2, lineHeight: 20 },
  insuranceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  insuranceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  insuranceProvider: { color: "#4B4B4B", fontSize: 14 },
  bottomPadding: { height: 80 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalPrice: { fontSize: 20, fontWeight: "bold", color: "#000000" },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  continueButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Changed to white for date modal in render
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    width: "100%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#000000" },
  modalCloseIcon: { fontSize: 28, color: "#000000" },
  modalSection: { marginBottom: 24 },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  picker: {
    color: "#000000",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#000000",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  confirmButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  datePicker: { width: "100%", height: 200, marginBottom: 16 },
  dateSummary: { marginBottom: 16 },
  dateSummaryText: { fontSize: 16, color: "#000000", marginBottom: 8 },
  dateEditButtons: { flexDirection: "row", gap: 8, marginTop: 12 },
  editDateButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    flex: 1,
  },
  editDateButtonText: { color: "#000000", fontSize: 16, fontWeight: "600" },
  errorText: { color: "#FF0000", fontSize: 14, marginBottom: 12 },
  disabledButton: { backgroundColor: "#B0B0B0" },
  insuranceContent: { maxHeight: "60%" },
  insuranceText: { color: "#4B4B4B", fontSize: 14, lineHeight: 20 },
  webDateContainer: { gap: 16 },
  webDateField: { marginBottom: 16 },
  webDateLabel: { fontSize: 16, color: "#000000", marginBottom: 8 },
  webDateInput: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    fontSize: 16,
    width: "100%",
  },
  vehicleDetails: { gap: 12 },
  vehicleDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vehicleDetailLabel: { fontSize: 16, fontWeight: "500", color: "#000000" },
  vehicleDetailValue: { fontSize: 16, color: "#4B4B4B" },
});
