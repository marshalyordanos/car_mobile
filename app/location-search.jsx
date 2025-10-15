import { Ionicons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const locations = [
  {
    type: "ITEM",
    label: "Current location",
    subtitle: "Enable location services",
    icon: "navigate",
  },
  {
    type: "ITEM",
    label: "Anywhere",
    subtitle: "Browse all cars",
    icon: "globe-outline",
  },
  // { type: "HEADER", label: "Airports" },
  // {
  //   type: "ITEM",
  //   label: "Addis Ababa Airport",
  //   icon: "airplane-outline",
  // },
  { type: "HEADER", label: "Cities" },
  { type: "ITEM", label: "Adama", icon: "business-outline" },
  { type: "ITEM", label: "Addis Ababa", icon: "business-outline" },
  { type: "ITEM", label: "Bahirdar", icon: "business-outline" },
  { type: "ITEM", label: "Bishoftu", icon: "business-outline" },
  { type: "ITEM", label: "Diredawa", icon: "business-outline" },
  { type: "ITEM", label: "Gimma", icon: "business-outline" },
  { type: "ITEM", label: "Gondar", icon: "business-outline" },
  { type: "ITEM", label: "Harar", icon: "business-outline" },
  { type: "ITEM", label: "Hawasa", icon: "business-outline" },
  { type: "ITEM", label: "Mekele", icon: "business-outline" },

  // { type: "HEADER", label: "Train stations" },
  // { type: "ITEM", label: "Lideta Train Station", icon: "train-outline" },

  // { type: "HEADER", label: "Hotels" },
  // { type: "ITEM", label: "Sheraton Addis", icon: "bed-outline" },
];
const LocationSearchScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([
    {
      type: "ITEM",
      label: "Current location",
      subtitle: "Enable location services",
      icon: "navigate",
    },
    {
      type: "ITEM",
      label: "Anywhere",
      subtitle: "Browse all cars",
      icon: "globe-outline",
    },
    // { type: "HEADER", label: "Airports" },
    // {
    //   type: "ITEM",
    //   label: "Addis Ababa Airport",
    //   icon: "airplane-outline",
    // },
    { type: "HEADER", label: "Cities" },
    { type: "ITEM", label: "Adama", icon: "business-outline" },
    { type: "ITEM", label: "Addis Ababa", icon: "business-outline" },
    { type: "ITEM", label: "Bahirdar", icon: "business-outline" },
    { type: "ITEM", label: "Bishoftu", icon: "business-outline" },
    { type: "ITEM", label: "Diredawa", icon: "business-outline" },
    { type: "ITEM", label: "Gimma", icon: "business-outline" },
    { type: "ITEM", label: "Gondar", icon: "business-outline" },
    { type: "ITEM", label: "Harar", icon: "business-outline" },
    { type: "ITEM", label: "Hawasa", icon: "business-outline" },
    { type: "ITEM", label: "Mekele", icon: "business-outline" },

    // { type: "HEADER", label: "Train stations" },
    // { type: "ITEM", label: "Lideta Train Station", icon: "train-outline" },

    // { type: "HEADER", label: "Hotels" },
    // { type: "ITEM", label: "Sheraton Addis", icon: "bed-outline" },
  ]);

  const handleCancel = () => {
    router.back();
  };
  const handleSelectLocation = (selected) => {
    // router.setParams({ selectedLocation: selected });
    // router.replace("/(tab)/shop");
    router.replace({
      pathname: "/(tab)/shop",
      params: { selectedLocation: selected },
    });
  };

  useEffect(() => {
    const filteredLocations = locations.filter((data) => {
      if (data.type == "HEADER") return true;
      if (data.label == "Current location" || data.label == "Anywhere")
        return true;
      if (data.label.includes(searchText)) return true;
    });
    setLocationSuggestions(filteredLocations);
  }, [searchText]);

  const renderItem = ({ item }) => {
    if (item.type === "HEADER") {
      return <Text style={styles.headerText}>{item.label}</Text>;
    }
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => handleSelectLocation(item.label)}
      >
        <View style={styles.iconContainer}>
          <Icon name={item.icon} size={24} color="#374151" />
        </View>
        <View>
          <Text style={styles.rowTitle}>{item.label}</Text>
          {item.subtitle && (
            <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flex: 1,
          // borderWidth: 1,
          backgroundColor: "white",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <View style={styles.header}>
          <View style={styles.inputContainer}>
            <Icon name="search-outline" size={20} color="#75787cff" />
            <TextInput
              style={styles.input}
              placeholder="City, airport, address, or train station"
              placeholderTextColor="#75787cff"
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={true}
            />
          </View>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={locationSuggestions}
          keyExtractor={(item, index) => `${item.label}-${index}`}
          renderItem={renderItem}
        />
        <Text style={styles.footerText}>Powered by Google</Text>
      </View>
    </View>
  );
};

export default LocationSearchScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: "#f3f4f6",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 18,
    marginLeft: 8,
  },
  cancelButton: {
    fontSize: 16,
    color: "#393381",
    fontWeight: "500",
    marginLeft: 16,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6b7280",
    paddingHorizontal: 24,
    // paddingTop: 16,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  rowTitle: { fontSize: 14, color: "#111827", fontWeight: "500" },
  rowSubtitle: { fontSize: 12, color: "#6b7280" },
  footerText: { color: "gray", padding: 16 },
});
