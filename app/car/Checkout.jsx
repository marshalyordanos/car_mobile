import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";

import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import api from "../../redux/api";
import { selectCurrentUser } from "../../redux/authReducer";
import FormField from "../../components/Auth/FormField";
import PhoneInput from "react-native-phone-number-input";
import { useTranslation } from "react-i18next";
import StatusModal from "../../components/utils/StatusModal";
import { Toast } from "toastify-react-native";

export default function Checkout() {
  const {
    car,
    pickupLocation,
    pickupLat,
    pickupLng,
    returnLocation,
    dropoffLat,
    dropoffLng,
    tripStartDate,
    tripEndDate,
    totalPrice,
    basePrice,
    days,
  } = useLocalSearchParams();

  const user = useSelector(selectCurrentUser);
  //
  let parsedCar;

  parsedCar = JSON.parse(car);
  parsedCar.images = parsedCar.photos?.map((url) => ({ uri: url })) || [
    { uri: "https://via.placeholder.com/96x64" },
  ];

  console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee:", parsedCar);

  const isValidDate = (date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  };

  const startDate = new Date(tripStartDate);
  const endDate = new Date(tripEndDate);

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+251");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [promotions, setPromotions] = useState(true);
  const [terms, setTerms] = useState(false);
  const [declineProtection, setDeclineProtection] = useState(true);
  const [enhancedRoadside, setEnhancedRoadside] = useState(false);
  const [supplementalLiability, setSupplementalLiability] = useState(false);
  const [driverOption, setDriverOption] = useState(false); // Default to false instead of JSON.parse(withDriver)
  const [isLoadding, setLoding] = useState(false);
  const [idFile, setIdFile] = useState(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState(null);
  const { t, i18n } = useTranslation();
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [bookingLoading, setBokkingLaoding] = useState(false);

  const [errorOpen, setErrorOpen] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    self_created: true,
  });

  const [fullnameEror, setFullnameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termError, setTermError] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // const [errors, setError] = useState([]);
  const [errors, setErrors] = useState({
    phoneNumber: "",
    email: "",
    firstName: "",
    lastName: "",
    ageRange: "",
    terms: "",
  });

  const formatPrice = (value) => {
    if (!value || isNaN(value)) return "0.00";
    return parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const insets = useSafeAreaInsets();

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

  const validatePhone = (phone) => {
    let isvalid = true;

    if (type == "all" || type == "phone") {
      if (phone == "" || !phone.startsWith("+251") || phone.length != 13) {
        isvalid = false;
        setPhoneError("Pleas provide a valid phone number.");
        return isvalid;
      } else {
        isvalid = true;
        setPhoneError("");
      }
    }

    return isvalid;
  };

  const pickFile = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        const fileObj = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/octet-stream",
        };

        if (type === "id") {
          setIdFile(fileObj);
        } else if (type === "driverLicense") {
          setDriverLicenseFile(fileObj);
        }

        console.log("Selected file:", fileObj); // optional, for debugging
      }
    } catch (err) {
      console.log("File picking error:", err);
    }
  };
  const handleBookTrip = async () => {
    try {
      console.log(
        "backendBookingData:",
        !formattedValue,
        formattedValue.length !== 13,
        formattedValue.startsWith("+251"),
        formattedValue.length,
        formattedValue
      );

      if (
        !formattedValue ||
        formattedValue.length !== 13 ||
        !formattedValue.startsWith("+251")
      ) {
        Toast.show({
          type: "error",
          text1: "Please provid valid phone numebr",
          text2: "",
          props: {
            style: { fontSize: 20 },
            textStyle: { flexWrap: "wrap" },
          },
        });
        return;
      }

      setBokkingLaoding(true);

      const backendBookingData = {
        carId: parsedCar.id,
        guestId: user?.user?.id,
        hostId: parsedCar.hostId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        withDriver: driverOption,
        pickupLat: isNaN(parseFloat(pickupLat)) ? 0 : parseFloat(pickupLat),
        pickupLng: isNaN(parseFloat(pickupLng)) ? 0 : parseFloat(pickupLng),
        pickupName: "Addis Ababa" || pickupLocation,
        dropoffLat: isNaN(parseFloat(dropoffLat)) ? 0 : parseFloat(dropoffLat),
        dropoffLng: isNaN(parseFloat(dropoffLng)) ? 0 : parseFloat(dropoffLng),
        dropoffName: "Addis Ababa" || returnLocation,
      };

      const response = await api.post("/bookings", backendBookingData);
      setSuccessOpen(true);
      setBokkingLaoding(false);
    } catch (err) {
      console.log("=====================:", err);
      setEmailError(true);
      setBokkingLaoding(false);
    } finally {
      setBokkingLaoding(false);
      // setSuccessOpen(false);
      // setErrorOpen(false);
    }
    // if (!validateForm()) return;

    // if (!user) {
    //   Alert.alert("Login Required", "Please login to book", [
    //     { text: "Cancel" },
    //     { text: "Login", onPress: () => router.push("/sign-in") },
    //   ]);
    //   return;
    // }

    // setLoading(true);
    // try {
    // Alert.alert(
    //   "Booking Confirmed!",
    //   `Your trip is booked successfully!\nBooking ID: ${"12345"}`,
    //   [
    //     {
    //       text: "View My Bookings",
    //       onPress: () => router.replace("/my-bookings"),
    //     },
    //     { text: <Text>kl</Text>, onPress: () => router.push("/profile") },
    //   ]
    // );
    // const backendBookingData = {
    //   carId: parsedCar.id,
    //   guestId: user?.user?.id || "default-guest-id", // Use user.id from Redux
    //   hostId: parsedCar.hostId,
    //   startDate: startDate.toISOString(),
    //   endDate: endDate.toISOString(),
    //   withDriver: driverOption,
    //   pickupLat: isNaN(parseFloat(pickupLat)) ? 0 : parseFloat(pickupLat),
    //   pickupLng: isNaN(parseFloat(pickupLng)) ? 0 : parseFloat(pickupLng),
    //   pickupName: pickupLocation,
    //   dropoffLat: isNaN(parseFloat(dropoffLat)) ? 0 : parseFloat(dropoffLat),
    //   dropoffLng: isNaN(parseFloat(dropoffLng)) ? 0 : parseFloat(dropoffLng),
    //   dropoffName: returnLocation,
    // };

    // console.log(
    //   "SENDING TO BACKEND:",
    //   JSON.stringify(backendBookingData, null, 2)
    // );

    // const response = await api.post("/bookings", backendBookingData);

    // console.log("Booking success:", response.data);

    // Alert.alert(
    //   "Booking Confirmed!",
    //   `Your trip is booked successfully!\nBooking ID: ${
    //     response.data.id || "12345"
    //   }`,
    //   [
    //     {
    //       text: "View My Bookings",
    //       onPress: () => router.replace("/my-bookings"),
    //     },
    //     { text: "Done", onPress: () => router.push("/profile") },
    //   ]
    // );
    // } catch (error) {
    //   console.error("Booking error:", error.response?.data);
    //   Alert.alert(
    //     "Booking Failed",
    //     error.response?.data?.message ||
    //       "Something went wrong. Please try again."
    //   );
    // } finally {
    //   setLoading(false);
    // }
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

  return (
    <View style={[styles.container]}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.vehicleContainer}>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleTitle}>
                {parsedCar?.make?.name + " " + parsedCar?.model?.name}{" "}
                {parsedCar.year}
              </Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>
                  {parsedCar.average_rating}
                </Text>
                <MaterialIcons name="star" size={24} color="#FFD700" />
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
                uri: parsedCar.images[0]?.uri,
              }}
              style={styles.vehicleImage}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary driver</Text>
          {/* <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/sign-in")}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View> */}
          <View style={{ marginTop: 0 }}>
            <Text style={{ fontSize: 16, paddingBottom: 5 }}>{t("phone")}</Text>
            <PhoneInput
              containerStyle={{
                // borderWidth: 1,
                backgroundColor: "#e7ebf0",
                borderRadius: 8,
                width: "100%",
                height: 52, // reduced height
              }}
              textContainerStyle={{
                backgroundColor: "#e7ebf0",
                borderRadius: 8,

                paddingVertical: 0,
                paddingHorizontal: 0,
                height: 50, // match container height
              }}
              flagButtonStyle={{
                width: 60,
                height: 60, // match height so it’s aligned
              }}
              defaultValue={value}
              defaultCode="ET"
              layout="first"
              onChangeText={setValue}
              onChangeFormattedText={setFormattedValue}
              withDarkTheme
              withShadow
            />
          </View>
          <Text style={{ color: "red" }}>{phoneError}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.infoText}>
              By providing a phone number, you consent to receive automated text
              messages with trip or account updates.
            </Text>
            {!user && (
              <>
                <FormField
                  title={t("fullname")}
                  value={form.fullname}
                  handleChangeText={(e) => {
                    // validate(
                    //   e,
                    //   form.phone,
                    //   form.email,
                    //   form.password,
                    //   form.confirmPassword,
                    //   "fullname"
                    // );
                    setForm({ ...form, fullname: e });
                  }}
                  otherStyles={{ marginTop: 28 }}
                  keyboardType="email-address"
                  placeholder={"fullname"}
                />
                <Text style={{ color: "red" }}>{fullnameEror}</Text>

                <View>
                  {/* files */}
                  <FilePickerField
                    label="ID"
                    file={idFile}
                    setFile={setIdFile}
                    pickFile={() => pickFile("id")}
                  />

                  <FilePickerField
                    label="Driver License"
                    file={driverLicenseFile}
                    setFile={setDriverLicenseFile}
                    pickFile={() => pickFile("driverLicense")}
                  />
                </View>
                <FormField
                  title={t("email")}
                  value={form.email}
                  handleChangeText={(e) => {
                    // validate(
                    //   form.fullname,
                    //   form.phone,
                    //   e,
                    //   form.password,
                    //   form.confirmPassword,
                    //   "email"
                    // );

                    setForm({ ...form, email: e });
                  }}
                  otherStyles={{ marginTop: 3 }}
                  keyboardType="email-address"
                  placeholder={"email"}
                />
                <Text style={{ color: "red" }}>{emailError}</Text>
              </>
            )}
            {/* <View style={styles.infoBox}>
              <MaterialIcons name="info" size={20} color="#000" />
              <Text style={styles.infoBoxText}>
                After booking, you'll need to submit more information to avoid
                cancellation and fees.
              </Text>
            </View>
            <Text style={styles.infoText}>
              You can add additional drivers to your trip for free after
              booking.
            </Text> */}
          </View>
        </View>

        {/* <View style={styles.section}> */}
        {/* <Text style={styles.sectionTitle}>Protection options*</Text> */}
        {/* <View style={styles.protectionContainer}>
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
          </View> */}

        {/* driver uncomment */}
        {/* <View style={styles.protectionContainer}>
            <View style={styles.protectionOption}>
              <CustomCheckbox
                value={driverOption}
                onValueChange={setDriverOption}
                tintColors={{ true: "#000", false: "#666" }}
              />
              <View>
                <Text style={styles.optionTitle}>Add professional driver</Text>
                <Text style={styles.optionDescription}>
                  Include an experienced driver for your entire trip
                </Text>
                <Text style={styles.optionPrice}>ETB 500/day</Text>
              </View>
            </View>
          </View> */}
        {/* </View> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip total</Text>
          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Before Tax ({parsedCar?.days} days)
              </Text>
              <Text style={styles.totalValue}>
                {formatPrice(parsedCar?.baseTotal)} ETB
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax(15%)</Text>
              <Text style={styles.totalValue}>
                {formatPrice(parsedCar?.tax)} ETB
              </Text>
            </View>
            {/* <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>300 total miles</Text>
              <Text style={styles.totalValueFree}>FREE</Text>
            </View> */}
            <View style={[styles.totalRow, styles.totalRowBold]}>
              <Text style={styles.totalLabelBold}>Total</Text>
              <Text style={styles.totalValueBold}>
                {formatPrice(parsedCar?.totalPrice)} ETB
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
          {/* <View style={styles.checkboxContainer}>
            <CustomCheckbox
              value={promotions}
              onValueChange={setPromotions}
              tintColors={{ true: "#000", false: "#666" }}
            />
            <Text style={styles.checkboxLabel}>
              Send me promotions and announcements via email
            </Text>
          </View> */}
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
            {errors.terms && (
              <Text style={styles.errorText}>{errors.terms}</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
        <View style={styles.bottomBarContent}>
          <View>
            <Text style={styles.totalText}>
              {formatPrice(parsedCar?.totalPrice)} ETB
            </Text>
            <Text style={styles.taxesText}>Taxes and fees included</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!terms || loading) && styles.disabledButton,
              { justifyContent: "center", alignItems: "center", minWidth: 130 },
            ]}
            disabled={!terms || loading}
            onPress={handleBookTrip}
          >
            {bookingLoading ? (
              <ActivityIndicator size={"small"} color={"white"} />
            ) : (
              <Text style={styles.continueButtonText}>
                {loading ? "Booking..." : "Book Now"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <StatusModal
        visible={errorOpen}
        onClose={() => setErrorOpen(false)}
        type="error"
        icon={<MaterialIcons name="error-outline" size={44} color="#e74c3c" />}
        title="Booking Failed"
        message="This car is already booked for those dates."
        primaryLabel="Close"
        onPrimaryPress={() => setErrorOpen(false)}
      />

      <StatusModal
        visible={successOpen}
        onClose={() => setSuccessOpen(true)}
        type="success"
        icon={<MaterialIcons name="check-circle" size={44} color="#2ecc71" />}
        title="Booking Confirmed"
        message="Your booking has been successfully created."
        primaryLabel="OK"
        onPrimaryPress={() => {
          router.replace("/booking/my-booking");
        }}
      />
    </View>
  );
}

const FilePickerField = ({ label, file, setFile, pickFile }) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 16, marginBottom: 5 }}>{label}</Text>

      {file ? (
        <View
          style={{
            position: "relative",
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: "#e0e0e0",
          }}
        >
          {file.type.startsWith("image/") ? (
            <Image
              source={{ uri: file.uri }}
              style={{ width: "100%", height: 150 }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                backgroundColor: "black",
              }}
            >
              <MaterialIcons name="insert-drive-file" size={24} color="white" />
              <Text
                style={{
                  color: "white",
                  marginLeft: 10,
                  flexShrink: 1,
                }}
                numberOfLines={1}
              >
                {file.name}
              </Text>
            </View>
          )}

          {/* Cancel button */}
          <TouchableOpacity
            onPress={() => setFile(null)}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 15,
              padding: 3,
            }}
          >
            <Entypo name="cross" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
          }}
          onPress={pickFile}
        >
          <Entypo name="plus" size={37} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};
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
    gap: 8,
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
  inputError: {
    borderColor: "#DC2626",
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
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 4,
  },
});
