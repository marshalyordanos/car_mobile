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
import { LinearGradient } from "expo-linear-gradient";
import PhoneInput from "react-native-phone-number-input";
import axios from "axios";
import { useTranslation } from "react-i18next";

const OrderConfirmation = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  const handleCheckOrder = async () => {
    if (!phoneNumber || !orderNumber) {
      setError("Please enter both phone number and order number.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.patch(
        "https://api.kelatibeauty.com/api/v1/orders/confirm/",
        {
          phoneNumber: phoneNumber.replace("+", ""),
          trackNumber: orderNumber,
        }
      );

      // Handle successful response
      Alert.alert("Success", "Order confirmed successfully!");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred while confirming the order."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t("order_confirmation")}</Text>
        <Text style={styles.subtitle}>{t("order_confirmation_desc")}</Text>

        <View style={styles.inputContainer}>
          <PhoneInput
            defaultValue={phoneNumber}
            defaultCode="ET"
            layout="first"
            withShadow
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.phoneInputTextContainer}
            onChangeFormattedText={setPhoneNumber}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("order_number")}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter order number"
            value={orderNumber}
            onChangeText={setOrderNumber}
          />
        </View>

        <Text style={styles.infoText}>{t("order_confirmation_desc2")}</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={styles.checkButton}
          onPress={handleCheckOrder}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#393381", "#554994"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkButtonGradient}
          >
            <Text style={styles.checkButtonText}>
              {isLoading ? "CHECKING..." : t("check_order2")}
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
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  phoneInputContainer: {
    width: "100%",
    borderRadius: 5,
  },
  phoneInputTextContainer: {
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
  },
  checkButton: {
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 20,
  },
  checkButtonGradient: {
    padding: 15,
    alignItems: "center",
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default OrderConfirmation;
