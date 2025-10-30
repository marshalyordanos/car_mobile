import RNModal from "react-native-modal";
import React, { memo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setVehicleTypesFilter } from "../../../redux/filtersSlice";
import TypeButton from "../shared/ui/TypeButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

export const vehicleTypes = [
  { label: "Sedan", value: "SEDAN", iconName: "car-sport-outline" },
  { label: "SUV", value: "SUV", iconName: "car-outline" },
  { label: "Van", value: "VAN" },
  { label: "Truck", value: "TRUCK" },
  { label: "Coupe", value: "COUPE" },
  { label: "Convertible", value: "CONVERTIBLE" },
  { label: "Hatchback", value: "HATCHBACK" },
  { label: "Wagon", value: "WAGON" },
  { label: "Luxury", value: "LUXURY" },
  { label: "Sports", value: "SPORTS" },
  { label: "Other", value: "OTHER" },
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
  types = [],
}) {
  const colorMap = {
    success: "#2ecc71",
    error: "#e74c3c",
    warning: "#f39c12",
    info: "#3498db",
  };
  const insets = useSafeAreaInsets();
  const [selectedTypes, setSelectedTypes] = useState(types);

  const handleSelectType = (typeValue) => {
    let newSelection;
    if (selectedTypes.includes(typeValue)) {
      newSelection = selectedTypes.filter((value) => value !== typeValue);
    } else {
      newSelection = [...selectedTypes, typeValue];
    }
    setSelectedTypes(newSelection);
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
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vehicle type</Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedTypes([]);
              handleReset();
            }}
          >
            <Text style={styles.headerButton}>Reset</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gridContainer}>
          {vehicleTypes.map((type) => (
            <View key={type.label} style={styles.buttonWrapper}>
              <TypeButton
                label={type.label}
                iconName={type.iconName}
                iconSet="Ionicons"
                isSelected={selectedTypes.includes(type.value)}
                onPress={() => handleSelectType(type.value)}
                iconSize={40}
              />
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.resultsButton}
          onPress={() => handleViewResults(selectedTypes)}
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
    marginBottom: 24,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  headerButton: { fontSize: 16, fontWeight: "500", color: "#111827" },
  resultsButton: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  resultsButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  buttonWrapper: {
    width: "33.33%",
    padding: 8,
  },
});
