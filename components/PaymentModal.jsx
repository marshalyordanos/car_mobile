import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
} from "react-native";

const PaymentModal = ({
  modalVisible,
  setModalVisible,
  onDelete,
  totalAmount,
}) => {
  //   const [modalVisible, setModalVisible] = useState(true);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.felxend}>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <AntDesign
                  style={{ marginTop: 10, marginHorizontal: 10 }}
                  name="close"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.title}>Confirm Order</Text>
              <Text style={styles.desc}>
                Your order will be placed and will be processed
              </Text>
              <Text style={styles.desc}>as soon as possible.</Text>
              <Text style={[styles.desc, { marginTop: 14 }]}>
                Make sure you make your payment within 3 hours
              </Text>
              <Text style={styles.desc}>
                {" "}
                of placing your order to avoid cancellation.
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                margin: 20,
                borderColor: "lightgray",
              }}
            ></View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 19 }}>Order Summary</Text>
            </View>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  {totalAmount?.toFixed(2)} {" ETB"}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Delivery</Text>
                <Text style={styles.summaryValue}>Free</Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  marginVertical: 20,
                  borderColor: "lightgray",
                }}
              ></View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalValue}>
                  ${totalAmount?.toFixed(2)}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "center",
                marginVertical: 20,
              }}
            >
              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: "#1b1b1b", paddingHorizontal: 20 },
                ]}
                onPress={() => {
                  // onDelete();
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    borderWidth: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  felxend: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
  },
  desc: {
    fontSize: 15,
    marginTop: 4,
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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 0,
    // alignItems: "center",
    shadowColor: "#000",
    width: "90%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: 200,
    borderRadius: 5,
    padding: 15,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 17,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default PaymentModal;
