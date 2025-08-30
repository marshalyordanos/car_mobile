import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import icons from "../../constants/icons";
const SearchInput = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={icons.search} style={styles.icon} resizeMode="contain" />
      <Text style={styles.placeholderText}>City, airport, address...</Text>
    </TouchableOpacity>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: "100%",
    backgroundColor: "#f8f8f8",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 15,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "black",
    marginRight: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: "#6b7280",
  },
});
