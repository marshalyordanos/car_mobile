import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

const CheckItem = () => {
  const [sku, setSku] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const handleCheckItem = async () => {
    if (!sku) {
      setError("Please enter an item SKU.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.kelatibeauty.com/api/v1/product-combinations/${sku}/`
      );

      if (response.data) {
        // navigation.navigate("ItemDetails", {
        //   itemData: response.data,
        // });
        navigation.navigate("detail", { productId: response.data.product.id })

      } else {
        setError("Product not found. Please check the SKU and try again.");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Product not found. Please check the SKU and try again.");
      } else {
        setError(
          "An error occurred while checking the item. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t("check_item")}</Text>
        <Text style={styles.subtitle}>{t("check_item_desc")}</Text>

        <Text style={{ fontSize: 17, marginVertical: 10 }}>
          {t("insert_item_SKU")}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Insert Item SKU"
            value={sku}
            onChangeText={setSku}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={styles.checkButton}
          onPress={handleCheckItem}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#393381", "#554994"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkButtonGradient}
          >
            <Text style={styles.checkButtonText}>
              {isLoading ? "CHECKING..." : t("check")}
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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

export default CheckItem;