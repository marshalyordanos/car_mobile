import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setPriceFilter } from "../../../redux/filtersSlice";

const PriceRangeSheet = React.forwardRef((props, ref) => {
  const snapPoints = ["35%"];
  const dispatch = useDispatch();
  const globalPrice = useSelector((state) => state.filters.price);
  const [localPriceRange, setLocalPriceRange] = useState([
    globalPrice.min,
    globalPrice.max,
  ]);

  useEffect(() => {
    setLocalPriceRange([globalPrice.min, globalPrice.max]);
  }, [globalPrice]);

  const handleViewResults = () => {
    dispatch(
      setPriceFilter({ min: localPriceRange[0], max: localPriceRange[1] })
    );
    ref.current?.close();
  };
  const handleReset = () => {
    const defaultPrice = { min: 10, max: 500 };
    setLocalPriceRange([defaultPrice.min, defaultPrice.max]);
    dispatch(setPriceFilter(defaultPrice));
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
          <Text style={styles.headerTitle}>Price range</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.headerButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.rangeText}>
          ${localPriceRange[0]} - ${localPriceRange[1]}
          {localPriceRange[1] >= 500 ? "+" : ""}/day
        </Text>

        <View style={styles.sliderContainer}>
          <MultiSlider
            values={localPriceRange}
            sliderLength={300}
            onValuesChange={setLocalPriceRange}
            min={10}
            max={500}
            step={5}
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
              borderWidth: 2,
              borderColor: "white",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
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

PriceRangeSheet.displayName = "PriceRangeSheet";
export default memo(PriceRangeSheet);

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
