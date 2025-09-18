import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { memo, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import icons from "../../../constants/icons";
import { fetchVehicleTypes } from "../../../redux/filterOptionsSlice";
import { setVehicleTypesFilter } from "../../../redux/filtersSlice";
import TypeButton from "../shared/ui/TypeButton";

const iconMap = {
  Cars: icons.car,
  SUVs: icons.suv,
  Minivans: icons.minivan,
  Trucks: icons.truck,
  Vans: icons.van,
  "Cargo vans": icons.cargovan,
  "Box trucks": icons.boxtruck,
};

const VehicleTypeSheet = React.forwardRef((props, ref) => {
  const snapPoints = ["60%"];
  const dispatch = useDispatch();
  const { items: availableTypes, status } = useSelector(
    (state) => state.filterOptions.vehicleTypes
  );
  const selectedTypes = useSelector((state) => state.filters.vehicleTypes);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchVehicleTypes());
    }
  }, [status, dispatch]);

  const handleSelectType = (typeId) => {
    let newSelection;
    if (selectedTypes.includes(typeId)) {
      newSelection = selectedTypes.filter((id) => id !== typeId);
    } else {
      newSelection = [...selectedTypes, typeId];
    }
    dispatch(setVehicleTypesFilter(newSelection));
  };

  const handleReset = () => {
    dispatch(setVehicleTypesFilter([]));
  };

  const renderContent = () => {
    if (status === "loading") {
      return <ActivityIndicator size="large" />;
    }
    if (status === "failed") {
      return <Text>Error loading vehicle types.</Text>;
    }
    return (
      <View style={styles.gridContainer}>
        {availableTypes.map((type) => (
          <View key={type._id} style={styles.buttonWrapper}>
            <TypeButton
              label={type.name}
              icon={iconMap[type.name] || icons.car}
              isSelected={selectedTypes.includes(type._id)}
              onPress={() => handleSelectType(type._id)}
              iconSize={40}
            />
          </View>
        ))}
      </View>
    );
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
        {renderContent()}
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
