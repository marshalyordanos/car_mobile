import RNModal from "react-native-modal";
import React, { memo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setSeatsFilter } from "../../../redux/filtersSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const seatOptions = [
  { value: "All", label: "All seats" },
  { value: "4", label: "4 or more" },
  { value: "5", label: "5 or more" },
  { value: "6", label: "6 or more" },
  { value: "7", label: "7 or more" },
  { value: "8", label: "8 or more" },
];

export default function VehicleRangeSheet({
  visible,
  onClose,
  icon,
  title,
  message,
  primaryLabel,
  onPrimaryPress,
  handleViewResults,
  handleReset,
  type = "info",
  seats = [],
}) {
  const colorMap = {
    success: "#2ecc71",
    error: "#e74c3c",
    warning: "#f39c12",
    info: "#3498db",
  };
  const insets = useSafeAreaInsets();
  const [selectedOption, setSelectedOption] = useState(seats);
  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  return (
    <RNModal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropTransitionOutTiming={0}
      useNativeDriver
      style={{
        margin: 0,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
      backdropOpacity={0}
      statusBarTranslucent={true}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 22,
          paddingBottom: insets.bottom,
          alignItems: "center",
        }}
        // style={[styles.contentContainer, { paddingBottom: insets.bottom }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerButton}>X</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Number of seats</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.headerButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: "100%",
          }}
        >
          {seatOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.optionRow}
              onPress={() => handleSelectOption(option.value)}
            >
              <View style={styles.radioCircle}>
                {selectedOption === option.value && (
                  <View style={styles.selectedRb} />
                )}
              </View>
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.resultsButton}
          onPress={() => handleViewResults(selectedOption)}
        >
          <Text style={styles.resultsButtonText}>View results</Text>
        </TouchableOpacity>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  modalBackground: { backgroundColor: "white", borderRadius: 24 },
  contentContainer: { flex: 1, padding: 24 },
  header: {
    width: "100%",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  headerButton: { fontSize: 16, fontWeight: "500", color: "#111827" },
  resultsButton: {
    width: "100%",

    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  resultsButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },

  optionRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#171718ff",
  },
  optionText: {
    fontSize: 15,
    marginLeft: 16,
    color: "#111827",
  },
});
