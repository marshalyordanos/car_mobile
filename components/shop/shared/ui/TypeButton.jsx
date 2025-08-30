import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";

const iconComponents = {
  Ionicons,
  FontAwesome,
  MaterialIcons,
};

const TypeButton = ({
  icon,
  iconName,
  iconSet,
  iconSize = 32,
  label,
  isSelected,
  onPress,
}) => {
  const IconComponent = iconComponents[iconSet] || Ionicons;
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
    >
      {icon && (
        <Image
          source={icon}
          style={[
            styles.iconImage,
            { width: iconSize, height: iconSize },
            isSelected && styles.selectedIconImage,
          ]}
          resizeMode="contain"
        />
      )}
      {iconName && (
        <IconComponent
          name={iconName}
          size={iconSize}
          color={isSelected ? "#111827" : "#6b7280"}
        />
      )}

      <Text style={[styles.label, isSelected && styles.selectedLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default TypeButton;

const styles = StyleSheet.create({
  container: {
    height: 90,
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
  selectedIconImage: {},
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
