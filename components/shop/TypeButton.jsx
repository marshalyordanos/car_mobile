import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

const TypeButton = ({ icon, label, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
    >
      <Image
        source={icon}
        style={[styles.icon, isSelected && styles.selectedIcon]}
        resizeMode="contain"
      />
      <Text style={[styles.label, isSelected && styles.selectedLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default TypeButton;

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  selectedContainer: {
    borderColor: "#111827",
    borderWidth: 2,
  },
  icon: {
    width: 25,
    height: 25,
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  selectedLabel: {
    color: "#111827",
  },
});
