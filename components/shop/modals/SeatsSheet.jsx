import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const seatOptions = [
  "All seats",
  "4 or more",
  "5 or more",
  "6 or more",
  "7 or more",
  "8 or more",
];

const SeatsSheet = React.forwardRef((props, ref) => {
  const snapPoints = ["59%"];
  const [selectedOption, setSelectedOption] = useState("All seats");

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
          <Text style={styles.headerTitle}>Number of seats</Text>
          <TouchableOpacity onPress={() => setSelectedOption("All seats")}>
            <Text style={styles.headerButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View>
          {seatOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              onPress={() => setSelectedOption(option)}
            >
              <View style={styles.radioCircle}>
                {selectedOption === option && (
                  <View style={styles.selectedRb} />
                )}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
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

SeatsSheet.displayName = "SeatsSheet";
export default SeatsSheet;

const styles = StyleSheet.create({
  modalBackground: { backgroundColor: "white", borderRadius: 24 },
  contentContainer: { flex: 1, padding: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  headerButton: { fontSize: 16, fontWeight: "500", color: "#111827" },
  resultsButton: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
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
