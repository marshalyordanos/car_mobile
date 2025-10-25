import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/authReducer";
import { styles } from "../utils";

export function CustomCheckbox({ value, onValueChange, tintColors }) {
  return (
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
}

export function VehicleInfo({
  parsedCar,
  pickupLocation,
  returnLocation,
  startDate,
  endDate,
  formatDate,
}) {
  return (
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
  );
}

export function PrimaryDriver({
  countryCode,
  setCountryCode,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  ageRange,
  setAgeRange,
}) {
  // Access user from Redux for auto-fill
  const user = useSelector(selectCurrentUser);

  // Auto-fill effect
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhoneNumber(user.phone?.replace(/^\+\d{1,3}/, '') || '');
    }
  }, [user, setEmail, setFirstName, setLastName, setPhoneNumber]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Primary driver</Text>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/Sign-in")}>
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
          {!email && <Text style={styles.errorText}>Email is required</Text>}
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
          {!firstName && <Text style={styles.errorText}>First name is required</Text>}
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
          {!lastName && <Text style={styles.errorText}>Last name is required</Text>}
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
          {!ageRange && <Text style={styles.errorText}>Age range is required</Text>}
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
  );
}

export function ProtectionOptions({
  declineProtection,
  setDeclineProtection,
  enhancedRoadside,
  setEnhancedRoadside,
  supplementalLiability,
  setSupplementalLiability,
  withDriver,
  setWithDriver,
  protectionPrices,
}) {
  return (
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
  );
}

export function TripTotal({
  days,
  parsedCar,
  protectionCost,
  totalPrice,
  formatPrice,
}) {
  return (
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
  );
}

export function CancellationInfo({ startDate, formatDate }) {
  return (
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
  );
}

export function CheckboxSection({
  promotions,
  setPromotions,
  terms,
  setTerms,
}) {
  return (
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
        {!terms && <Text style={styles.errorText}>Terms must be accepted</Text>}
      </View>
    </View>
  );
}