import { StyleSheet, Switch, Text, View } from "react-native";

const FilterToggle = ({ label, description, value, onValueChange }) => {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1, marginRight: 16 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch
        trackColor={{ false: "#767577", true: "#111827" }}
        thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};

export default FilterToggle;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  label: { fontSize: 16, fontWeight: "500", color: "#111827" },
  description: { fontSize: 14, color: "#6b7280", marginTop: 4 },
});
