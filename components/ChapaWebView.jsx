import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Modal } from "react-native";
import { WebView } from "react-native-webview";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cartReducer";
const ChapaWebView = ({ url, onClose, onPaymentComplete }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const webViewRef = useRef(null);
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const handleClose = () => {
    setModalVisible(false);
    onClose();
  };

  const handleNavigationStateChange = (newNavState) => {
    dispatch(clearCart());

    if (newNavState.url.includes("track-order")) {
      handlePaymentSuccess(newNavState.url);
    } else if (newNavState.url.includes("cancel")) {
      handlePaymentFailure();
    }
  };

  const handlePaymentSuccess = () => {
    Toast.show({
      type: "success",
      text1: "Payment Successful",
      text2: "Your payment has been processed successfully.",
    });
    onPaymentComplete(true);
    handleClose();
    navigation.navigate("(setting)", { screen: "track-order" });
  };

  const handlePaymentFailure = () => {
    Toast.show({
      type: "error",
      text1: "Payment Failed",
      text2: "Your payment could not be processed. Please try again.",
    });
    onPaymentComplete(false);
    handleClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.webViewContainer}>
          <WebView
            ref={webViewRef}
            source={{ uri: url }}
            onNavigationStateChange={handleNavigationStateChange}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn("WebView error: ", nativeEvent);
            }}
            onLoadProgress={({ nativeEvent }) => {
              console.log("Loading progress: ", nativeEvent.progress);
            }}
            onLoadEnd={() => {
              console.log("Load ended");
            }}
          />
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  webViewContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ChapaWebView;
