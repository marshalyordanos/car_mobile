import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setYearFilter } from "../../../redux/filtersSlice";
const MIN_YEAR = 1952;
const MAX_YEAR = new Date().getFullYear();

const YearRangeSheet = React.forwardRef((props, ref) => {
  const snapPoints = ["35%"];
  const dispatch = useDispatch();
  const globalYears = useSelector((state) => state.filters.years);
  const [localYearRange, setLocalYearRange] = useState([
    globalYears.min,
    globalYears.max,
  ]);

  useEffect(() => {
    setLocalYearRange([globalYears.min, globalYears.max]);
  }, [globalYears]);
  const handleViewResults = () => {
    dispatch(setYearFilter({ min: localYearRange[0], max: localYearRange[1] }));
    ref.current?.close();
  };

  const handleReset = () => {
    setLocalYearRange([MIN_YEAR, MAX_YEAR]);
    dispatch(setYearFilter({ min: MIN_YEAR, max: MAX_YEAR }));
  };

  const rangeText =
    localYearRange[0] === MIN_YEAR && localYearRange[1] === MAX_YEAR
      ? "All years"
      : `${localYearRange[0]} - ${localYearRange[1]}`;

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
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.headerButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.rangeText}>{rangeText}</Text>

        <View style={styles.sliderContainer}>
          <MultiSlider
            values={localYearRange}
            sliderLength={300}
            onValuesChange={setLocalYearRange}
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
          onPress={handleViewResults}
        >
          <Text style={styles.resultsButtonText}>View 200+ results</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

YearRangeSheet.displayName = "YearRangeSheet";
export default memo(YearRangeSheet);

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
