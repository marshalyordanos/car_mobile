import { Ionicons as Icon } from "@expo/vector-icons";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  return (
    <View style={styles.container}>
      <FlatList
        data={filterOptions}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item === "ICON_ONLY_FILTER") {
            return (
              <TouchableOpacity
                style={styles.iconOnlyPill}
                onPress={() => onPillPress("All filters")}
              >
                <Icon name="options-outline" size={20} color="#111827" />
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              style={styles.pill}
              onPress={() => onPillPress(item)}
            >
              {item === "All filters" && (
                <Icon name="options-outline" size={16} color="#111827" />
              )}
              <Text style={styles.pillText}>{item}</Text>
              {item !== "All filters" && (
                <Icon name="chevron-down-outline" size={16} color="#6b7280" />
              )}
            </TouchableOpacity>
          );
        }}
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
    padding: 10,
    borderRadius: 15,
    marginRight: 9,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f3f4f6",
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
  pillText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
});
