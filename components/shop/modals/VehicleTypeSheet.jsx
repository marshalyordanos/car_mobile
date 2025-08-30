import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import icons from "../../../constants/icons";
import TypeButton from "../shared/ui/TypeButton";

const vehicleTypes = [
  { label: "Cars", icon: icons.car },
  { label: "SUVs", icon: icons.suv },
  { label: "Minivans", icon: icons.minivan },
  { label: "Trucks", icon: icons.truck },
  { label: "Vans", icon: icons.van },
  { label: "Cargo vans", icon: icons.cargovan },
  { label: "Box trucks", icon: icons.boxtruck },
];

const VehicleTypeSheet = React.forwardRef((props, ref) => {
  const snapPoints = ["67%"];
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleSelectType = (typeLabel) => {
    if (selectedTypes.includes(typeLabel)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== typeLabel));
    } else {
      setSelectedTypes([...selectedTypes, typeLabel]);
    }
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
          <TouchableOpacity onPress={() => setSelectedTypes([])}>
            <Text style={styles.headerButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          {vehicleTypes.map((type) => (
            <View key={type.label} style={styles.buttonWrapper}>
              <TypeButton
                label={type.label}
                icon={type.icon}
                isSelected={selectedTypes.includes(type.label)}
                onPress={() => handleSelectType(type.label)}
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
export default VehicleTypeSheet;

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
