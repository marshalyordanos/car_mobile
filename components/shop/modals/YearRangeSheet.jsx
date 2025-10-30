import RNModal from "react-native-modal";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setYearFilter } from "../../../redux/filtersSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
const MIN_YEAR = 1952;
const MAX_YEAR = new Date().getFullYear();

export default function YearRangeSheet({
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
  min,
  max,
}) {
  const colorMap = {
    success: "#2ecc71",
    error: "#e74c3c",
    warning: "#f39c12",
    info: "#3498db",
  };
  const insets = useSafeAreaInsets();

  const [localYearRange, setLocalYearRange] = useState([min, max]);

  // const handleViewResults = () => {
  //   dispatch(setYearFilter({ min: localYearRange[0], max: localYearRange[1] }));
  //   // ref.current?.close();
  // };

  // const handleReset = () => {
  //   setLocalYearRange([MIN_YEAR, MAX_YEAR]);
  //   dispatch(setYearFilter({ min: MIN_YEAR, max: MAX_YEAR }));
  // };

  const rangeText =
    localYearRange[0] === MIN_YEAR && localYearRange[1] === MAX_YEAR
      ? "All years"
      : `${localYearRange[0]} - ${localYearRange[1]}`;

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
          <Text style={styles.headerTitle}>Years</Text>
          <TouchableOpacity
            onPress={() => {
              setLocalYearRange([1952, new Date().getFullYear()]);
              handleReset();
            }}
          >
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
          onPress={() => handleViewResults(localYearRange)}
        >
          <Text style={styles.resultsButtonText}>View results</Text>
        </TouchableOpacity>
      </View>
    </RNModal>
  );
}

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
    width: "100%",

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
    width: "100%",

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
