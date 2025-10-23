import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import api from "../../redux/api";
import { selectCurrentUser } from "../../redux/authReducer";

export default function CheckoutScreen() {
  const { car, pickupLocation, returnLocation, tripStartDate, tripEndDate } =
    useLocalSearchParams();
  
  const user = useSelector(selectCurrentUser);
  const parsedCar = car
    ? JSON.parse(car)
    : {
        name: "Toyota Camry",
        year: 2020,
        rating: "4.8",
        trips: 120,
        price: 4500,
        images: [{ uri: "https://via.placeholder.com/96x64" }],
      };
  
  const isValidDate = (date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  };
  
  const startDate = isValidDate(tripStartDate)
    ? new Date(tripStartDate)
    : new Date();
  const endDate = isValidDate(tripEndDate)
    ? new Date(tripEndDate)
    : new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
  
  // 🆕 All state variables
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+251");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [promotions, setPromotions] = useState(true);
  const [terms, setTerms] = useState(true);
  const [declineProtection, setDeclineProtection] = useState(true);
  const [enhancedRoadside, setEnhancedRoadside] = useState(false);
  const [supplementalLiability, setSupplementalLiability] = useState(false);
  const [withDriver, setWithDriver] = useState(false);

  const protectionPrices = {
    enhancedRoadside: 290, 
    supplementalLiability: 1872, 
  };
  
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const protectionCost =
    (enhancedRoadside ? protectionPrices.enhancedRoadside * days : 0) +
    (supplementalLiability ? protectionPrices.supplementalLiability * days : 0) +
    (withDriver ? 500 * days : 0);
  const totalPrice = parsedCar.price * days + protectionCost; // 🆕 Fixed: price * days

  const formatPrice = (value) => {
    if (!value || isNaN(value)) return "0.00";
    return parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    if (!isValidDate(date)) {
      console.warn("Invalid date in formatDate:", date);
      return "Invalid Date";
    }
    return date.toLocaleString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Africa/Addis_Ababa",
    });
  };

  const CustomCheckbox = ({ value, onValueChange, tintColors }) => (
    <TouchableOpacity
      style={[
        styles.checkbox,
        { borderColor: value ? tintColors.true : tintColors.false },
        value && { backgroundColor: tintColors.true },
      ]}
      onPress={() => onValueChange(!value)}
    >
      {value && <MaterialIcons name="check" size={16} color="#FFF" />}
    </TouchableOpacity>
  );

  // 🆕 FIXED: EXACT backend format - ONLY 12 fields
  const handleBookTrip = async () => {
    if (!terms) {
      Alert.alert("Error", "Please accept terms and conditions");
      return;
    }
    
    if (!phoneNumber || !email || !firstName || !lastName || !ageRange) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (!user) {
      Alert.alert("Login Required", "Please login to book", [
        { text: "Cancel" },
        { text: "Login", onPress: () => router.push("/sign-in") },
      ]);
      return;
    }

    setLoading(true);
    try {
      // 🆕 EXACTLY what backend expects - ONLY 12 fields
      const backendBookingData = {
        carId: parsedCar.id || parsedCar._id || "cmfx1x55k0000lifipaliaw06",
        guestId: user?.user?.id || user?.id || "cmfvp3ty70002lidvmfsy3zyn",
        hostId: parsedCar.hostId || parsedCar.ownerId || "cmfvq23gz0000li0m9g7rq0ee",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice: totalPrice,
        withDriver: withDriver,
        pickupLat: 9.1450,
        pickupLng: 40.4897,
        pickupName: pickupLocation || "Addis Ababa",
        dropoffLat: returnLocation === pickupLocation ? 9.1450 : 8.9806,
        dropoffLng: returnLocation === pickupLocation ? 40.4897 : 38.7967,
        dropoffName: returnLocation || pickupLocation || "Addis Ababa",
      };

      console.log("🆕 SENDING TO BACKEND:", JSON.stringify(backendBookingData, null, 2));
      
      const response = await api.post("/bookings/", backendBookingData);
      
      console.log("✅ Booking success:", response.data);
      
      Alert.alert(
        "Booking Confirmed! 🎉",
        `Your trip is booked successfully!\nBooking ID: ${response.data.id || "12345"}`,
        [
          {
            text: "View My Bookings",
            onPress: () => router.push("/my-bookings"),
          },
          { text: "Done", onPress: () => router.push("/profile") },
        ]
      );
      
    } catch (error) {
      console.error("❌ Booking error:", error.response?.data);
      Alert.alert(
        "Booking Failed",
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.vehicleContainer}>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleTitle}>
                {parsedCar.name} {parsedCar.year}
              </Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{parsedCar.rating}</Text>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.tripsText}>({parsedCar.trips} trips)</Text>
              </View>
              <View style={styles.vehicleDetails}>
                <View style={styles.detailRow}>
                  <MaterialIcons name="calendar-today" size={16} color="#000" />
                  <Text style={styles.detailText}>{formatDate(startDate)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="calendar-today" size={16} color="#000" />
                  <Text style={styles.detailText}>{formatDate(endDate)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="location-pin" size={16} color="#000" />
                  <Text style={styles.detailText}>
                    {pickupLocation}
                    {pickupLocation === returnLocation
                      ? ""
                      : ` / ${returnLocation}`}
                  </Text>
                </View>
              </View>
            </View>
            <Image
              source={{
                uri:
                  parsedCar.images?.[0]?.uri ||
                  "https://via.placeholder.com/96x64",
              }}
              style={styles.vehicleImage}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary driver</Text>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.phoneInput}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={countryCode}
                  onValueChange={setCountryCode}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  dropdownIconColor="#000"
                >
                  <Picker.Item label="+251" value="+251" />
                  <Picker.Item label="+44" value="+44" />
                  <Picker.Item label="+1" value="+1" />
                  <Picker.Item label="+33" value="+33" />
                </Picker>
              </View>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Mobile number"
                style={styles.textInput}
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />
            </View>
            <Text style={styles.infoText}>
              By providing a phone number, you consent to receive automated text
              messages with trip or account updates.
            </Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                style={styles.textInput}
                placeholderTextColor="#666"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First name *</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                style={styles.textInput}
                placeholderTextColor="#666"
              />
              <Text style={styles.subLabel}>Driver's license first name</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last name *</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                style={styles.textInput}
                placeholderTextColor="#666"
              />
              <Text style={styles.subLabel}>Driver's license last name</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select your age *</Text>
              <Picker
                selectedValue={ageRange}
                onValueChange={setAgeRange}
                style={styles.pickerFull}
              >
                <Picker.Item label="Select age range" value="" />
                <Picker.Item label="18-24" value="18-24" />
                <Picker.Item label="25-34" value="25-34" />
                <Picker.Item label="35-44" value="35-44" />
                <Picker.Item label="45-54" value="45-54" />
                <Picker.Item label="55+" value="55+" />
              </Picker>
            </View>
            <View style={styles.infoBox}>
              <MaterialIcons name="info" size={20} color="#000" />
              <Text style={styles.infoBoxText}>
                After booking, you'll need to submit more information to avoid
                cancellation and fees.
              </Text>
            </View>
            <Text style={styles.infoText}>
              You can add additional drivers to your trip for free after
              booking.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Protection options*</Text>
          <View style={styles.protectionContainer}>
            <TouchableOpacity
              style={styles.protectionOption}
              onPress={() => {
                setDeclineProtection(true);
                setEnhancedRoadside(false);
                setSupplementalLiability(false);
              }}
            >
              <View style={styles.radioCircle}>
                {declineProtection && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionText}>Decline protection</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.protectionContainer}>
            <View style={styles.protectionOption}>
              <CustomCheckbox
                value={enhancedRoadside}
                onValueChange={(value) => {
                  setEnhancedRoadside(value);
                  if (value && declineProtection) setDeclineProtection(false);
                }}
                tintColors={{ true: "#000", false: "#666" }}
              />
              <View>
                <Text style={styles.optionTitle}>Roadside assistance</Text>
                <Text style={styles.optionDescription}>
                  Drive worry-free. Enhanced roadside assistance covers common
                  issues not included in our basic roadside assistance—helping
                  you avoid unexpected costs.
                </Text>
                <View style={styles.optionDetails}>
                  <Text style={styles.optionDetail}>
                    Protects you from extra costs caused by:
                  </Text>
                  <Text style={styles.optionDetail}>• Flat tires</Text>
                  <Text style={styles.optionDetail}>• Lockouts</Text>
                  <Text style={styles.optionDetail}>• Battery jumps</Text>
                  <Text style={styles.optionDetail}>• Refueling</Text>
                  <Text style={styles.optionDetail}>• Towing</Text>
                </View>
                <Text style={styles.optionPrice}>
                  ETB {protectionPrices.enhancedRoadside.toFixed(2)}/day
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.protectionContainer}>
            <View style={styles.protectionOption}>
              <CustomCheckbox
                value={supplementalLiability}
                onValueChange={(value) => {
                  setSupplementalLiability(value);
                  if (value && declineProtection) setDeclineProtection(false);
                }}
                tintColors={{ true: "#000", false: "#666" }}
              />
              <View>
                <Text style={styles.optionTitle}>Liability insurance</Text>
                <Text style={styles.optionDescription}>
                  Add optional supplemental liability insurance (SLI) from
                  Mobilita Insurance Company.
                </Text>
                <View style={styles.optionDetails}>
                  <Text style={styles.optionDetail}>
                    Supplemental liability insurance from Mobilita™
                  </Text>
                  <Text style={styles.optionDetail}>
                    An add-on — That increases your liability insurance coverage
                    limits above the state minimums.
                  </Text>
                  <Text style={styles.optionDetail}>
                    • ETB 33,000,000 max coverage for third party liability
                    claims
                  </Text>
                </View>
                <Text style={styles.optionPrice}>
                  ETB {protectionPrices.supplementalLiability.toFixed(2)}/day
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.protectionContainer}>
            <View style={styles.protectionOption}>
              <CustomCheckbox
                value={withDriver}
                onValueChange={setWithDriver}
                tintColors={{ true: "#000", false: "#666" }}
              />
              <View>
                <Text style={styles.optionTitle}>Add professional driver</Text>
                <Text style={styles.optionDescription}>
                  Include experienced driver for your entire trip
                </Text>
                <Text style={styles.optionPrice}>ETB 500/day</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip total</Text>
          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal ({days} days)</Text>
              <Text style={styles.totalValue}>ETB {formatPrice(parsedCar.price * days)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Protection Cost</Text>
              <Text style={styles.totalValue}>
                ETB {formatPrice(protectionCost)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>300 total miles</Text>
              <Text style={styles.totalValueFree}>FREE</Text>
            </View>
            <View style={[styles.totalRow, styles.totalRowBold]}>
              <Text style={styles.totalLabelBold}>Total</Text>
              <Text style={styles.totalValueBold}>
                ETB {formatPrice(totalPrice)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.cancellationBox}>
            <View style={styles.cancellationIcon}>
              <MaterialIcons name="calendar-today" size={16} color="#FFF" />
            </View>
            <Text style={styles.cancellationText}>
              Free cancellation before{" "}
              {formatDate(new Date(startDate.getTime() - 24 * 60 * 60 * 1000))}
              —if plans change, we've got your back.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.checkboxContainer}>
            <CustomCheckbox
              value={promotions}
              onValueChange={setPromotions}
              tintColors={{ true: "#000", false: "#666" }}
            />
            <Text style={styles.checkboxLabel}>
              Send me promotions and announcements via email
            </Text>
          </View>
          <View style={styles.checkboxContainer}>
            <CustomCheckbox
              value={terms}
              onValueChange={setTerms}
              tintColors={{ true: "#000", false: "#666" }}
            />
            <Text style={styles.checkboxLabel}>
              I agree to pay the total shown and to the{" "}
              <Text style={styles.linkText}>Terms of services</Text>,{" "}
              <Text style={styles.linkText}>cancellation policy</Text>, and I
              acknowledge the{" "}
              <Text style={styles.linkText}>privacy policy</Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomBarContent}>
          <View>
            <Text style={styles.totalText}>
              ETB {formatPrice(totalPrice)} total
            </Text>
            <Text style={styles.taxesText}>Taxes and fees included</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!terms || loading) && styles.disabledButton,
            ]}
            disabled={!terms || loading}
            onPress={handleBookTrip}
          >
            <Text style={styles.continueButtonText}>
              {loading ? "Booking..." : "Book Now"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  content: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  vehicleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  tripsText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  vehicleDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  vehicleImage: {
    width: 96,
    height: 64,
    borderRadius: 8,
  },
  loginContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    fontSize: 14,
    color: "#000",
    textDecorationLine: "underline",
  },
  inputContainer: {
    marginBottom: 16,
  },
  phoneInput: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  pickerContainer: {
    marginRight: 8,
  },
  picker: {
    width: 80,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    color: "#000",
  },
  pickerFull: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginTop: 4,
    color: "#000",
  },
  pickerItem: {
    color: "#000",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    color: "#000",
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoBoxText: {
    fontSize: 14,
    color: "#000",
    marginLeft: 12,
    flex: 1,
  },
  totalContainer: {
    marginTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRowBold: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#000",
    textDecorationLine: "underline",
  },
  totalLabelBold: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  totalValue: {
    fontSize: 16,
    color: "#000",
  },
  totalValueFree: {
    fontSize: 16,
    color: "#16A34A",
  },
  totalValueBold: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  cancellationBox: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  cancellationIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cancellationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#000",
    marginLeft: 8,
    flex: 1,
  },
  linkText: {
    color: "#000",
    textDecorationLine: "underline",
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    padding: 16,
    backgroundColor: "#FFF",
  },
  bottomBarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  taxesText: {
    fontSize: 12,
    color: "#666",
  },
  continueButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  disabledButton: {
    backgroundColor: "#CCC",
  },
  continueButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
  protectionContainer: {
    marginBottom: 16,
  },
  protectionOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#666",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#000",
  },
  optionText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  optionDetails: {
    marginTop: 8,
    marginLeft: 12,
  },
  optionDetail: {
    fontSize: 12,
    color: "#666",
  },
  optionPrice: {
    fontSize: 14,
    color: "#000",
    marginTop: 8,
    marginLeft: 12,
  },
});