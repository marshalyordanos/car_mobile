import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Platform,
  Pressable,
  FlatList,
  ActivityIndicator,
  Linking,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import PhoneInput from "react-native-phone-number-input";

import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

import api from "../redux/api";
import { selectCurrentUser } from "../redux/authReducer";
import SelectDropdown from "react-native-select-dropdown";
import PaymentModal from "../components/PaymentModal";
import SimpleLocationDisplay from "../components/SimpleLocationDisplay"; // Make sure to create this file
import ChapaWebView from "../components/ChapaWebView";
import { useNavigation } from "expo-router";
// import * as Location from "expo-location";
import { clearCart } from "../redux/cartReducer";

const Checkout = ({ navigation }) => {
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("chapa");

  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [country, setCountry] = useState("Ethiopia");
  const [city, setCity] = useState("Addis Ababa");
  const [subcity, setSubcity] = useState("Kirkos");

  const [kebele, setKebele] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [woreda, setWoreda] = useState("");

  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const [selectedAddress, setSeelectedAddress] = useState(null);

  const { totalAmount } = useSelector((state) => state.cart);
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);

  const [isFormValid, setIsFormValid] = useState(false);
  const [phoneNumberFormatted, setPhoneNumberFormatted] = useState("");
  const [phoneInputValue, setPhoneInputValue] = useState("");

  const phoneInputRef = useRef(null);

  const dispatch = useDispatch();

  const [chapaCheckoutUrl, setChapaCheckoutUrl] = useState(null);

  const user = useSelector(selectCurrentUser);

  const [mapError, setMapError] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const nav = useNavigation();

  const validateForm = () => {
    let isValid = true;
    
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    const isValidEthiopianNumber = (
      (cleanPhoneNumber.startsWith('251') && cleanPhoneNumber.length === 12) ||
      (cleanPhoneNumber.startsWith('0') && cleanPhoneNumber.length === 10)
    );
    
    if (!isValidEthiopianNumber) {
      isValid = false;
    }
  
    setIsFormValid(isValid);
    return isValid;
  };

  useEffect(() => {
    if (!MapView) {
      console.error("MapView is not available");
      setMapError("Map component is not available");
    }
  }, []);

  useEffect(() => {
    validateForm();
  }, [
    phoneNumber,
    deliveryOption,
    paymentMethod,
  ]);


  
  const [storeLocation, setStoreLocation] = useState({
    latitude: 8.998196333519214,
    longitude: 38.78875560394846,
  });
  

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("api/v1/addresses/");
        setAddresses(res.data.results);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        setError(error.response?.data?.detail);
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (selectedAddress) {
      setCity(selectedAddress.city);
      setSubcity(selectedAddress.subcity);
      setWoreda(selectedAddress.woreda);
      setKebele(selectedAddress.kebele);
      setHouseNumber(selectedAddress.house_number);

      const rawPhoneNumber = selectedAddress.phone_number;
      console.log("Raw phone number from selected address:", rawPhoneNumber);

      // Remove any non-digit characters and ensure it starts with 251
      const cleanPhoneNumber = rawPhoneNumber.replace(/\D/g, "");
      const formattedNumber = cleanPhoneNumber.startsWith("251")
        ? cleanPhoneNumber
        : `251${
            cleanPhoneNumber.startsWith("0")
              ? cleanPhoneNumber.slice(1)
              : cleanPhoneNumber
          }`;

      console.log("Formatted phone number:", formattedNumber);
      setPhoneNumber(formattedNumber);

      // Update PhoneInput's internal state
      if (phoneInputRef.current) {
        phoneInputRef.current.setState({ number: formattedNumber });
      }

      setLocation({
        latitude: parseFloat(selectedAddress.latitude),
        longitude: parseFloat(selectedAddress.longitude),
      });
    }
  }, [selectedAddress]);

  const renderDeliveryDetails = React.useCallback(() => {
    if (deliveryOption === "pickup") {
      return (
        <View>
          <Text style={styles.sectionSubtitle}>Pick up location</Text>
          <Text style={styles.pickupAddress}>
            Bole Medhanialem, 1st floor, infront of Edna Mall Building
          </Text>

          <View style={styles.inputContainer}>
          <PhoneInput
  ref={phoneInputRef}
  defaultValue={phoneNumber}
  defaultCode="ET"
  layout="first"
  onChangeFormattedText={(text) => {
    const cleanedText = text.replace(/\D/g, '');
    
    // If number starts with 0, convert to 251 format
    if (cleanedText.startsWith('0')) {
      setPhoneNumber('251' + cleanedText.substring(1));
    } else {
      setPhoneNumber(cleanedText);
    }
  }}
  containerStyle={styles.phoneInputContainer}
  textContainerStyle={styles.phoneInputTextContainer}
/>

{!isFormValid && phoneNumber.length > 0 && (
  <Text style={styles.errorText}>
    Please enter a valid Ethiopian phone number (+251 followed by 9 digits)
  </Text>
)}
          </View>
          <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{
            latitude: storeLocation.latitude,
            longitude: storeLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={storeLocation} />
        </MapView>

        </View>
      );
    }

    return (
      <View style={{}}>
        <Text style={styles.inputLabels}>Country*</Text>

        <SelectDropdown
          data={["Ethiopia"]}
          defaultValue={"Ethiopia"}
          onSelect={(selectedItem, index) => {
            setCountry(selectedItem);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.field_con}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem) || "Select yor country"}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: "#D2D9DF" }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />

        <Text style={styles.inputLabels}>City</Text>

        <SelectDropdown
          data={["Addis Ababa", "Bahirdar"]}
          defaultValue={"Addis Ababa"}
          onSelect={(selectedItem, index) => {
            setCity(selectedItem);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.field_con}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem) || "Select yor country"}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: "#D2D9DF" }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />

        {/* <Text >Sybcity*</Text> */}
        <Text style={styles.inputLabels}>SubCity</Text>

        <SelectDropdown
          data={[
            "Addis Ketema",
            "Akaki Kaliti",
            "Arada",
            "Bole",
            "Gulele",
            "Kirkos",
            "Kolfe Keranyo",
            "Lemi Kura",
            "Lideta",
            "Nifas Silk",
            "Yeka",
            "other",
          ]}
          defaultValue={"Kirkos"}
          onSelect={(selectedItem, index) => {
            setSubcity(selectedItem);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.field_con}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem) || "Select yor country"}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: "#D2D9DF" }),
                }}
              >
                {/* <Icon
                      name={item.icon}
                      style={styles.dropdownItemIconStyle}
                    /> */}
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />

      <Text style={styles.inputLabel}>Woreda</Text>
      <TextInput
        style={styles.inputField}
        placeholder="Enter your woreda"
        value={woreda}
        onChangeText={setWoreda}
      />

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Kebele</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter your kebele"
            value={kebele}
            onChangeText={setKebele}
          />

          <Text style={styles.inputLabel}>House Number</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter your house number"
            value={houseNumber}
            onChangeText={setHouseNumber}
          />
        </View>

        <View style={{ marginTop: 20 }}></View>
        <PhoneInput
          defaultValue={phoneNumber}
          defaultCode="ET"
          layout="first"
          onChangeFormattedText={(text) => setPhoneNumber(text)}
          containerStyle={styles.phoneInputContainer}
          textContainerStyle={styles.phoneInputTextContainer}
        />
        {/* <TouchableOpacity
          style={styles.setLocationButton}
          onPress={handleSetLocation}
        >
          <Text style={styles.setLocationButtonText}>SET LOCATION</Text>
        </TouchableOpacity> */}

        {/* {isLoadingLocation ? (
          <ActivityIndicator style={styles.loader} size="small" color="#393381" />
        ) : location ? (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              Latitude: {location.latitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Longitude: {location.longitude.toFixed(6)}
            </Text>
            <TouchableOpacity style={styles.openMapsButton} onPress={openInMaps}>
              <Text style={styles.openMapsButtonText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noLocationText}>Location not set</Text> */}
        {/* )} */}
      </View>
    );
  }, [
    deliveryOption,
    phoneInputValue,
    phoneNumber,
    country,
    city,
    subcity,
    kebele,
    houseNumber,
    location,
    isLoadingLocation,
  ]);

  const mapDeliveryOption = (option) => {
    switch (option) {
      case "quick":
        return "QuickDelivery";
      case "standard":
        return "Standard";
      case "pickup":
        return "SelfPick";
      default:
        return "Standard";
    }
  };

  // Update this to match backend's expected values
  const mapPaymentMethod = (method) => {
    switch (method) {
      case "chapa":
        return "Chapa";
      case "cash":
        return "Cash on Delivery";
      case "telebirr":
        return "Telebirr";
      default:
        return "Cash on Delivery";
    }
  };

  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const calculateTotal = () => {
    let total = totalAmount;
    if (deliveryOption === "quick") {
      total += 300; // 300 ETB for quick delivery
    }
    return total;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;
    setShowConfirmation(true);
    setIsPlacingOrder(false); // Reset this state
  };

  // const handleCancelConfirmation = () => {
  //   setShowConfirmation(false);
  //   setIsPlacingOrder(false);
  //   setIsProcessingOrder(false);
  // };

  const resetAllStates = () => {
    setIsProcessing(false);
    setIsPlacingOrder(false);
    setIsProcessingOrder(false);
    setShowConfirmation(false);
    setShowPayment(false);
    setHasError(false);
  };

  useEffect(() => {
    const backupReset = setTimeout(resetAllStates, 30000);
    return () => clearTimeout(backupReset);
  }, [isProcessing]);

  const handleCancelConfirmation = () => {
    if (isProcessing) return;
    setTimeout(() => {
      setShowConfirmation(false);
      setIsPlacingOrder(false);
      setIsProcessingOrder(false);
    }, 100);
  };

  useEffect(() => {
    return () => {
      setIsProcessing(false);
      setIsPlacingOrder(false);
      setIsProcessingOrder(false);
      setShowConfirmation(false);
      setShowPayment(false);
    };
  }, []);

  const confirmOrder = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setIsProcessingOrder(true);
    setHasError(false);

    setIsPlacingOrder(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const formData = new FormData();

      formData.append("status", "Pending");
      formData.append("country", country);
      if (city.trim()){
        formData.append("city", city.trim());
      }
      if (subcity.trim()){
        formData.append("subCity", subcity.trim());
      }
      if (woreda.trim()){
        formData.append("woreda", woreda.trim());
      }
      if (kebele.trim()){
        formData.append("kebele", kebele.trim());
      }
      if (houseNumber.trim()){
        formData.append("houseNumber", houseNumber.trim());
      } 
     

      if (location && location.latitude) {
        formData.append("latitude", location.latitude.toString());
      }
      if (location && location.longitude) {
        formData.append("longitude", location.longitude.toString());
      }

      // Handle phone number
      if (phoneNumber) {
        // Remove any non-digit characters and the country code if present
        const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
        formData.append("phoneNumber", cleanPhoneNumber);
      } else {
        console.error("Phone number is undefined");
        Alert.alert("Error", "Please enter a valid phone number.");
        setIsPlacingOrder(false);
        setIsProcessingOrder(false);
        return;
      }

      formData.append("preciseLocation", "");
      formData.append("deliveryType", mapDeliveryOption(deliveryOption));
      formData.append("paymentMethod", mapPaymentMethod(paymentMethod));

      const productCombinations = cartItems.map((item) => ({
        id: item.combinationId,
        bagQuantity: item.quantity,
        discount: item.discount || 0,
      }));
      formData.append(
        "productCombinations",
        JSON.stringify(productCombinations)
      );

      const orderTotalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      formData.append("orderTotalPrice", orderTotalPrice.toString());

      const bagTotalPrice = cartItems.reduce(
        (total, item) => total + parseFloat(item.price),
        0
      );
      formData.append("bagTotalPrice", bagTotalPrice.toString());

      console.log("=======formData====", formData);

      const response = await api.post("api/v1/orders/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Order placed successfully:", response.data);

      if (paymentMethod === "chapa") {
        await new Promise((resolve) => setTimeout(resolve, 100));

        setChapaCheckoutUrl(response.data.data.checkout_url);
        setShowConfirmation(false);
        setShowPayment(true);
      } else if (paymentMethod === "cash") {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setShowConfirmation(false);
        dispatch(clearCart());
        Alert.alert(
          "Order Placed Successfully",
          `Your order has been placed. Track number: ${response.data.trackNumber}`,
          [
            {
              text: "OK",
              onPress: () =>
                nav.navigate("(setting)", {
                  screen: "track-order",
                  params: { type: "shop" },
                }),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setHasError(true);
      Alert.alert("Error", "Failed to place order. Please try again.");
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setIsPlacingOrder(false);
        setIsProcessingOrder(false);
        if (hasError) {
          setShowConfirmation(false);
        }
      }, 100);
    }
  };

  const handlePaymentComplete = async (success) => {
    setShowPayment(false);
    if (success) {
      dispatch(clearCart());
      navigation.navigate("TrackOrder"); // Replace 'TrackOrder' with your actual route name
    }
  };

  const ConfirmationModal = () => (
    <Modal
      visible={showConfirmation}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        if (!isProcessing) {
          handleCancelConfirmation();
        }
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {isProcessingOrder ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.loaderText}>Processing your order...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.modalTitle}>Confirm Order</Text>
              <Text>
                Your order will be placed and will be processed as soon as
                possible.
              </Text>
              <Text>
                Make sure you make your payment within 3 hours of placing your
                order to avoid cancellation.
              </Text>

              <View style={styles.orderSummary}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                <View style={styles.summaryRow}>
                  <Text>Subtotal ({cartItems.length} items)</Text>
                  <Text>{totalAmount} ETB</Text>
                </View>
                {deliveryOption === "quick" && (
                  <View style={styles.summaryRow}>
                    <Text>Delivery</Text>
                    <Text>+300 ETB</Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={styles.totalText}>Estimated total</Text>
                  <Text style={styles.totalText}>{calculateTotal()} ETB</Text>
                </View>
              </View>

              <Text style={styles.termsText}>
                By placing an order, you agree to Kelati's Terms & Conditions
                and Privacy Policy
              </Text>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmOrder}
                disabled={isProcessingOrder}
              >
                <Text style={styles.confirmButtonText}>CONFIRM</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelConfirmation}
                disabled={isProcessingOrder}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <PaymentModal
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          totalAmount={totalAmount}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup and Delivery Options</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.option,
                deliveryOption === "quick" && styles.selectedOption,
              ]}
              onPress={() => {
                setDeliveryOption("quick");
                setDeliveryCharge(300);
              }}
            >
              <Text style={styles.optionText}>Quick Delivery</Text>
              <Text style={styles.optionSubtext}>
                Within 2 hours (+300 ETB)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                deliveryOption === "standard" && styles.selectedOption,
              ]}
              onPress={() => setDeliveryOption("standard")}
            >
              <Text style={styles.optionText}>Standard Delivery</Text>
              <Text style={styles.optionSubtext}>Within 24 hours</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                deliveryOption === "pickup" && styles.selectedOption,
              ]}
              onPress={() => setDeliveryOption("pickup")}
            >
              <Text style={styles.optionText}>Pick at store</Text>
            </TouchableOpacity>
          </View>
        </View>

        {user && deliveryOption != "pickup" && (
          <View>
            <FlatList
              //   style={{ , flex: 1 }}
              data={addresses}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    width: 260,
                    borderWidth: 2,
                    padding: 10,
                    borderColor:
                      selectedAddress?.id === item?.id ? "black" : "lightgray",
                    borderRadius: 10,
                    margin: 15,
                  }}
                  key={item.id}
                  onPress={() => setSeelectedAddress(item)}
                >
                  <Text style={styles.add}>
                    Country{"  "}:{"  "}
                    {item?.country}
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>
                    City{"  "}:{"  "}
                    {item?.city}
                  </Text>

                  <Text style={styles.add}>
                    Subcity{"  "}:{"  "}
                    {item?.subcity}
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>
                    Woreda{"  "}:{"  "}
                    {item?.woreda}
                  </Text>

                  <Text style={styles.add}>
                    Kebele{"  "}:{"  "}
                    {item.kebele}
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>
                    House no{"  "}:{"  "}
                    {item.house_number}
                  </Text>

                  <Text style={styles.add}>
                    Phone Number{"  "}:{"  "}
                    {item.phone_number}
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>
                    Precise Location{"  "}:{"  "}
                    {item.precise_location}
                  </Text>

                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: "lightgray",
                      marginVertical: 10,
                    }}
                  ></View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          {renderDeliveryDetails()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.option,
                paymentMethod === "chapa" && styles.selectedOption,
              ]}
              onPress={() => setPaymentMethod("chapa")}
            >
              <Text style={styles.optionText}>Chapa (Automatic)</Text>
              <Text style={styles.optionSubtext}>
                Includes multiple types of automatic payment
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                paymentMethod === "cash" && styles.selectedOption,
              ]}
              onPress={() => setPaymentMethod("cash")}
            >
              <Text style={styles.optionText}>Cash on Delivery</Text>
              <Text style={styles.optionSubtext}>
                Payment will be made upon delivery
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handlePlaceOrder}
        style={[
          styles.placeOrderButton,
          (!isFormValid || isPlacingOrder) && styles.disabledButton,
        ]}
        disabled={!isFormValid || isPlacingOrder}
      >
        <Text style={styles.placeOrderButtonText}>Place Order</Text>
      </TouchableOpacity>

      <ConfirmationModal />

      {showPayment && (
        <ChapaWebView
          url={chapaCheckoutUrl}
          onClose={() => {
            setChapaCheckoutUrl(null);
            setShowPayment(false);
          }}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  add: {
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: "white",
    padding: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  selectedOption: {
    borderColor: "#393381",
    backgroundColor: "#f0f0ff",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  optionSubtext: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    marginTop: 16,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
    marginTop: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#393381",
  },
  placeOrderButton: {
    backgroundColor: "#393381",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  placeOrderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  setLocationButton: {
    backgroundColor: "#393381",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  setLocationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },

  inputContainer: {
    marginBottom: 15,
    width: "100%",
  },
  phoneInputContainer: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  phoneInputTextContainer: {
    paddingVertical: 12,
  },

  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  pickupAddress: {
    marginBottom: 16,
  },
  map: {
    width: "100%",
    height: 200,
    marginTop: 16,
    marginBottom: 16,
  },
  field_con: {
    // width: "100%",
    height: 50,
    paddingHorizontal: 16,
    backgroundColor: "whitesmoke",
    borderWidth: 1,
    marginRight: 0,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    shadowColor: "#000", // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },

  setLocationButton: {
    backgroundColor: "#393381",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  setLocationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
  locationContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  noLocationText: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
  },
  openMapsButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  openMapsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  placeOrderButton: {
    backgroundColor: "#393381",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A0A0A0", // A lighter color for disabled state
  },
  placeOrderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderSummary: {
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalText: {
    fontWeight: "bold",
  },
  termsText: {
    marginTop: 20,
    fontSize: 12,
    color: "gray",
  },
  confirmButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "gray",
  },
  inputSection: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 17,
    marginBottom: 5,
    color: "#393381", // Use a consistent theme color
    fontWeight: "600",
  },
  inputLabels: {
    fontSize: 17,
    marginTop: 10,
    marginBottom: 5,
    color: "#393381", // Use a consistent theme color
    fontWeight: "600",
  },
  inputField: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    shadowColor: "#000", // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Shadow on Android
  },
  dropdownButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    justifyContent: "center",
    shadowColor: "#000", // Adding shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Elevation for Android shadow
    marginBottom: 15, // Space between dropdowns
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    fontWeight: "500",
  },
  dropdownMenuStyle: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000", // Shadow for the dropdown menu
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownItemText: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    textAlign: "left",
    color: "#393381",
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderSummary: {
    marginTop: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalText: {
    fontWeight: "bold",
  },
  termsText: {
    marginBottom: 20,
    fontSize: 12,
    color: "gray",
  },
  confirmButton: {
    backgroundColor: "#393381",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#393381",
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default Checkout;
