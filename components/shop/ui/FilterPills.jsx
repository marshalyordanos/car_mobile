import { Ionicons as Icon } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { shallowEqual, useSelector } from "react-redux";
import { vehicleTypes } from "../modals/VehicleTypeSheet";
const filterOptions = [
  "ICON_ONLY_FILTER",
  "Price",
  "Vehicle type",
  "Make & model",
  "Years",
  "Seats",
  "Electric",
  "Deliver to me",
  "All filters",
];

const FilterPills = ({ onPillPress }) => {
  const filters = useSelector((state) => state.filters, shallowEqual);
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.price.min !== 10 || filters.price.max !== 500) count++;
    if (filters.vehicleTypes.length > 0) count++;
    if (
      filters.years.min !== 1952 ||
      filters.years.max !== new Date().getFullYear()
    )
      count++;
    if (filters.seats !== "All seats") count++;
    if (filters.brands.length > 0) count++;
    if (filters.models.length > 0) count++;
    return count;
  }, [filters]);

  const getPriceLabel = () => {
    const { min, max } = filters.price;
    if (min === 10 && max === 500) {
      return "Price";
    }
    return `$${min} - $${max}${max >= 500 ? "+" : ""}`;
  };
  const isPriceActive = () => {
    return filters.price.min !== 10 || filters.price.max !== 500;
  };

  const getVehicleTypeLabel = () => {
    const selectedValues = filters.vehicleTypes;
    const count = selectedValues.length;
    if (count === 0) return "Vehicle type";
    if (count === 1) {
      const selectedType = vehicleTypes.find(
        (type) => type.value === selectedValues[0]
      );
      return selectedType ? selectedType.label : "Vehicle type";
    }
    return `Vehicle type (${count})`;
  };
  const isVehicleTypeActive = () => filters.vehicleTypes.length > 0;

  const getYearLabel = () => {
    const { min, max } = filters.years;
    const defaultMin = 1952;
    const defaultMax = new Date().getFullYear();

    if (min === defaultMin && max === defaultMax) {
      return "Years";
    }
    return `${min} - ${max}`;
  };

  const isYearActive = () => {
    return (
      filters.years.min !== 1952 ||
      filters.years.max !== new Date().getFullYear()
    );
  };

  const getMakeModelLabel = () => {
    const brandCount = filters.brands.length;
    const modelCount = filters.models.length;
    const totalCount = brandCount + modelCount;
    if (totalCount === 0) {
      return "Make & model";
    }
    return `Make & model (${totalCount})`;
  };

  const isMakeModelActive = () => {
    return filters.brands.length > 0 || filters.models.length > 0;
  };

  const getSeatsLabel = () => {
    const selected = filters.seats;
    if (selected === "All seats") {
      return "Seats";
    }
    const seatNumber = parseInt(selected);
    return `${seatNumber}+ seats`;
  };

  const isSeatsActive = () => {
    return filters.seats !== "All seats";
  };

  const renderItem = ({ item }) => {
    let isActive = false;
    let label = item;

    switch (item) {
      case "Price":
        label = getPriceLabel();
        isActive = isPriceActive();
        break;
      case "Vehicle type":
        label = getVehicleTypeLabel();
        isActive = isVehicleTypeActive();
        break;
      case "Make & model":
        label = getMakeModelLabel();
        isActive = isMakeModelActive();
        break;
      case "Years":
        label = getYearLabel();
        isActive = isYearActive();
        break;
      case "Seats":
        label = getSeatsLabel();
        isActive = isSeatsActive();
        break;
      // we will add more cases here for the other filters
    }

    const showBadge = activeFilterCount > 0;

    if (item === "ICON_ONLY_FILTER") {
      return (
        <TouchableOpacity
          style={styles.iconOnlyPill}
          onPress={() => onPillPress("All filters")}
        >
          <Icon name="options-outline" size={20} color="#111827" />
          {showBadge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.pill, isActive && styles.activePill]}
        onPress={() => onPillPress(item)}
      >
        {/* {item === "All filters" && (
          <Icon name="options-outline" size={16} color="#111827" />
        )} */}

        <Text style={[styles.pillText, isActive && styles.activePillText]}>
          {label}
        </Text>
        {item === "All filters" ? (
          showBadge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )
        ) : (
          <Icon
            name="chevron-down-outline"
            size={16}
            color={isActive ? "white" : "#6b7280"}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filterOptions}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        contentContainerStyle={{ paddingRight: 20 }}
      />
    </View>
  );
};

export default FilterPills;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  iconOnlyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 15,
    marginRight: 9,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f3f4f6",
  },
  badge: {
    backgroundColor: "#393381",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    gap: 6,
  },
  activePill: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  pillText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  activePillText: {
    color: "white",
    fontWeight: "600",
  },
});
