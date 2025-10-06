import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setVehicleTypesFilter } from "../../../redux/filtersSlice";
import TypeButton from "../shared/ui/TypeButton";

export const vehicleTypes = [
  { label: "Sedan", value: "SEDAN", iconName: "car-sport-outline" },
  { label: "SUV", value: "SUV", iconName: "car-outline" },
  { label: "Van", value: "bus-outline" },
  { label: "Truck", value: "trail-sign-outline" },
  { label: "Coupe", value: "car-sport" },
  { label: "Convertible", value: "car-outline" },
  { label: "Hatchback", value: "car-outline" },
  { label: "Wagon", value: "car-outline" },
  { label: "Luxury", value: "diamond-outline" },
  { label: "Sports", value: "rocket-outline" },
  { label: "Other", value: "help-circle-outline" },
];

const VehicleTypeSheet = React.forwardRef((props, ref) => {
  const snapPoints = ["75%"];
  const dispatch = useDispatch();
  const selectedTypes = useSelector((state) => state.filters.vehicleTypes);

  const handleSelectType = (typeValue) => {
    let newSelection;
    if (selectedTypes.includes(typeValue)) {
      newSelection = selectedTypes.filter((value) => value !== typeValue);
    } else {
      newSelection = [...selectedTypes, typeValue];
    }
    dispatch(setVehicleTypesFilter(newSelection));
  };

  const handleReset = () => {
    dispatch(setVehicleTypesFilter([]));
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
          <Text style={styles.headerTitle}>Vehicle type</Text>
          <TouchableOpacity onPress={handleReset}>
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
          onPress={() => ref.current?.close()}
        >
          <Text style={styles.resultsButtonText}>View results</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

VehicleTypeSheet.displayName = "VehicleTypeSheet";
export default memo(VehicleTypeSheet);

const styles = StyleSheet.create({
  modalBackground: { backgroundColor: "white", borderRadius: 24 },
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
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
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
