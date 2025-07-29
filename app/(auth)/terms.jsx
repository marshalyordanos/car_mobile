import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Terms = () => {
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <ScrollView style={{ marginHorizontal: 15 }}>
        <Text style={styles.title}>Terms and Conditions</Text>
        <Text style={styles.updatedDate}>Last Updated: 14-10-2024</Text>

        <View style={styles.section}>
          <Text style={styles.subtitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By using the App, you affirm that you are at least 15 years old or
            have the consent of a parent or guardian. You agree to comply with
            all applicable laws and regulations.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>2. User Accounts</Text>
          <Text style={styles.text}>
            To access certain features, you may need to create an account. You
            are responsible for maintaining the confidentiality of your account
            information and for all activities that occur under your account.
            Please notify us immediately of any unauthorized use of your
            account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>3. Product Information</Text>
          <Text style={styles.text}>
            We strive to provide accurate product descriptions and pricing.
            However, we do not warrant that product information is error-free.
            Prices and availability are subject to change without notice.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>4. Orders and Payment</Text>
          <Text style={styles.text}>
            By placing an order through the App, you agree to pay the total
            amount due, including taxes and shipping fees. We accept various
            payment methods, and you agree to provide accurate payment
            information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>5. Shipping and Delivery</Text>
          <Text style={styles.text}>
            We will make every effort to deliver your order within the estimated
            timeframe. However, we are not liable for any delays caused by
            unforeseen circumstances.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>6. Returns and Refunds</Text>
          <Text style={styles.text}>
            Please refer to our Return Policy for information on how to return
            items and request refunds.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>7. Intellectual Property</Text>
          <Text style={styles.text}>
            All content, trademarks, and other intellectual property on the App
            are owned by Kelati Mobile or its licensors. You may not use,
            reproduce, or distribute any content without our express written
            consent.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>8. Limitation of Liability</Text>
          <Text style={styles.text}>
            To the fullest extent permitted by law, Kelati Mobile shall not be
            liable for any direct, indirect, incidental, or consequential
            damages arising from your use of the App or any products purchased
            through it.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>9. Governing Law</Text>
          <Text style={styles.text}>
            These Terms shall be governed by the laws of Ethiopia, without
            regard to its conflict of law principles.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>10. Changes to Terms</Text>
          <Text style={styles.text}>
            We reserve the right to modify these Terms at any time. We will
            notify you of significant changes. Your continued use of the App
            after any changes constitutes your acceptance of the new Terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>11. Contact Us</Text>
          <Text style={styles.text}>
            If you have any questions or concerns about these Terms, please
            contact us at kelatirobel063@gmail.com.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  updatedDate: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
});

export default Terms;
