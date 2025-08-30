import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MIN_YEAR = 1952;
const MAX_YEAR = new Date().getFullYear();

const YearRangeSheet = React.forwardRef((props, ref) => {
  const snapPoints = ["35%"];
  const [yearRange, setYearRange] = useState([MIN_YEAR, MAX_YEAR]);

  const handleValuesChange = (values) => {
    setYearRange(values);
  };

  const rangeText =
    yearRange[0] === MIN_YEAR && yearRange[1] === MAX_YEAR
      ? "All years"
      : `${yearRange[0]} - ${yearRange[1]}`;

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
          <Text style={styles.headerTitle}>Years</Text>
          <TouchableOpacity onPress={() => setYearRange([MIN_YEAR, MAX_YEAR])}>
            <Text style={styles.headerButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.rangeText}>{rangeText}</Text>

        <View style={styles.sliderContainer}>
          <MultiSlider
            values={[yearRange[0], yearRange[1]]}
            sliderLength={300}
            onValuesChange={handleValuesChange}
            min={MIN_YEAR}
            max={MAX_YEAR}
            step={1}
            allowOverlap={false}
            snapped
            minMarkerOverlapDistance={40}
            trackStyle={{
              height: 3,
              backgroundColor: "#e5e7eb",
            }}
            selectedStyle={{
              backgroundColor: "#111827",
            }}
            markerStyle={{
              height: 24,
              width: 24,
              borderRadius: 12,
              backgroundColor: "#111827",
              borderWidth: 1,
              borderColor: "white",
              elevation: 2,
            }}
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

YearRangeSheet.displayName = "YearRangeSheet";
export default YearRangeSheet;

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: "white",
    borderRadius: 24,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  headerButton: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  rangeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  sliderContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  resultsButton: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  resultsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
