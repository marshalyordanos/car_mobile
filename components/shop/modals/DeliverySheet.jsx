import { Ionicons as Icon } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { memo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DeliverySheet = React.forwardRef((props, ref) => {
  const snapPoints = ["43%"];
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleReset = () => {
    setAddress("");
  };

  const handleNavigateToSearch = () => {
    router.push("/location-search");
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
          Show cars that can be delivered directly to an address or specific
          location.
        </Text>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={handleNavigateToSearch}
        >
          <Icon name="search-outline" size={20} color="#6b7280" />
          <Text style={[styles.input, !address && styles.placeholderText]}>
            {address || "Enter address"}
          </Text>
        </TouchableOpacity>

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
export default memo(DeliverySheet);

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
    paddingVertical: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    color: "#111827",
  },
  placeholderText: {
    color: "#9ca3af",
  },
});
