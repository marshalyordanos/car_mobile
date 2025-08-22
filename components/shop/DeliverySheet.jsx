import { Ionicons as Icon } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DeliverySheet = React.forwardRef((props, ref) => {
  const snapPoints = ["37%"];
  const [address, setAddress] = useState("");

  const handleReset = () => {
    setAddress("");
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={styles.modalBackground}
      handleIndicatorStyle={{ backgroundColor: "#d1d5db" }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => ref.current?.close()}>
            <Text style={styles.headerButton}>X</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pickup options</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.headerButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Host brings the car to me</Text>
        <Text style={styles.sectionSubtitle}>
          Show cars that can be delivered directly to an address
        </Text>

        <View style={styles.inputContainer}>
          <Icon name="search-outline" size={20} color="#6b7280" />
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            placeholderTextColor="#9ca3af"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <TouchableOpacity
          style={styles.resultsButton}
          onPress={() => ref.current?.close()}
        >
          <Text style={styles.resultsButtonText}>View results</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

DeliverySheet.displayName = "DeliverySheet";
export default DeliverySheet;

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: "white",
    borderRadius: 24,
  },
  contentContainer: { flex: 1, padding: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  headerButton: { fontSize: 16, fontWeight: "500", color: "#111827" },
  resultsButton: {
    backgroundColor: "#111827",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },
  resultsButtonText: { color: "white", fontSize: 14, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 18,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    color: "#111827",
  },
});
