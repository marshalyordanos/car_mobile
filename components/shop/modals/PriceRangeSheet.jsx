import RNModal from "react-native-modal";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React, { memo, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setPriceFilter } from "../../../redux/filtersSlice";
import Slider from "@react-native-community/slider";
import { AntDesign } from "@expo/vector-icons";

export default function PriceRangeSheet({
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
  console.log("9999999999999:");
  const tempValuesRef = useRef(localPriceRange);

  const snapPoints = ["35%"];
  const dispatch = useDispatch();

  const [localPriceRange, setLocalPriceRange] = useState([min, max]);

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
          <Text style={styles.headerTitle}>Price range</Text>
          <TouchableOpacity
            onPress={() => {
              setLocalPriceRange([0, 10000]);
              handleReset();
            }}
          >
            <Text style={styles.headerButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.rangeText}>
          {localPriceRange[0]} ETB - {localPriceRange[1]} ETB
          {localPriceRange[1] >= 10000 ? "+" : ""} / day
        </Text>

        <View style={styles.sliderContainer}>
          <MultiSlider
            values={localPriceRange}
            sliderLength={300}
            onValuesChange={setLocalPriceRange} // updates continuously
            min={0}
            max={10000}
            step={1} // integer step for smooth sliding
            allowOverlap={false}
            snapped={false} // ✨ remove this
            minMarkerOverlapDistance={40}
            trackStyle={{ height: 3, backgroundColor: "#e5e7eb" }}
            selectedStyle={{ backgroundColor: "#111827" }}
            markerStyle={{
              height: 24,
              width: 24,
              borderRadius: 12,
              backgroundColor: "#111827",
              borderWidth: 2,
              borderColor: "white",
            }}
          />

          {/* <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={10000}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#d3d3d3"
            onValueChange={(x) => {
              console.log(x);
            }}
          /> */}
        </View>
        <TouchableOpacity
          style={styles.resultsButton}
          onPress={() => handleViewResults(localPriceRange)}
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
    borderWidth: 1,
    borderColor: "#b1b1b1",
    // elevation: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  header: {
    // flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    // borderWidth: 1,
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
    width: "100%",
  },
  resultsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
