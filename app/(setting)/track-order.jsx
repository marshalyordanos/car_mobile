import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PhoneInput from "react-native-phone-number-input";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useTranslation } from "react-i18next";

const TrackOrder = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const handleTrackOrder = async () => {
    if (!phoneNumber || !orderNumber) {
      Alert.alert(
        "Missing Information",
        "Please enter both phone number and order number."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formattedPhoneNumber = phoneNumber.replace("+", "");
      const response = await axios.get(
        `https://api.kelatibeauty.com/api/v1/orders/track/?trackNumber=${orderNumber}&phoneNumber=${formattedPhoneNumber}`
      );

      if (response.data && !response.data.error) {
        // Handle successful response
        navigation.navigate("OrderDetails", {
          orderData: response.data,
        });
      } else {
        // Handle API error response
        setError(
          response.data.error || "An error occurred while tracking the order."
        );
      }
    } catch (err) {
      // Handle network or other errors
      setError("An error occurred while tracking the order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const leftIcon = ({ navigation }) => (
    <TouchableOpacity
      style={styles.menuButton}
      onPress={() => navigation.goBack()}
    >
      <Ionicons
        name="arrow-back"
        size={24}
        color="#fff"
        style={styles.iconStyle}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>{t("track_order_desc")}</Text>

        <TouchableOpacity
          style={styles.trackButton}
          onPress={handleTrackOrder}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#1c1c1c", "#282828"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.trackButtonGradient, { marginVertical: 15 }]}
          >
            <Text style={styles.trackButtonText}>See Order history</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <PhoneInput
            defaultValue={phoneNumber}
            defaultCode="ET"
            layout="first"
            withShadow
            autoFocus
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.phoneInputTextContainer}
            onChangeFormattedText={setPhoneNumber}
          />
        </View>

        <Text style={{ fontSize: 17, marginVertical: 5 }}>
          {t("order_number")}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Order #"
            value={orderNumber}
            onChangeText={setOrderNumber}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={styles.trackButton}
          onPress={handleTrackOrder}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#393381", "#554994"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.trackButtonGradient}
          >
            <Text style={styles.trackButtonText}>
              {isLoading ? "CHECKING..." : t("check_order")}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  trackButton: {
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 20,
  },
  trackButtonGradient: {
    padding: 15,
    alignItems: "center",
  },
  trackButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  menuButton: {
    padding: 8,
  },
  iconStyle: {
    padding: 1,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default TrackOrder;
