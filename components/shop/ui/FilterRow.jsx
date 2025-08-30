import { Ionicons as Icon } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const FilterRow = ({ label, value, onPress }) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.value}>{value}</Text>
        <Icon name="chevron-forward" size={20} color="#6b7280" />
      </View>
    </TouchableOpacity>
  );
};

export default FilterRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  label: { fontSize: 16, fontWeight: "600", color: "#111827" },
  value: { fontSize: 16, color: "#63676dff", marginRight: 8 },
});
