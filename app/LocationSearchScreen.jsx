import { Ionicons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const locationSuggestions = [
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
  { type: "HEADER", label: "Airports" },
  {
    type: "ITEM",
    label: "Addis Ababa Airport",
    icon: "airplane-outline",
  },
  { type: "HEADER", label: "Cities" },
  { type: "ITEM", label: "Addis Ababa, A.A", icon: "business-outline" },
  { type: "ITEM", label: "Hawasa", icon: "business-outline" },
  { type: "HEADER", label: "Train stations" },
  { type: "ITEM", label: "Lideta Train Station", icon: "train-outline" },
  { type: "HEADER", label: "Hotels" },
  { type: "ITEM", label: "Sheraton Addis", icon: "bed-outline" },
];

const LocationSearchScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const handleCancel = () => {
    router.back();
  };
  const handleSelectLocation = (selected) => {
    router.setParams({ selectedLocation: selected });
    router.back();
  };

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
    </SafeAreaView>
  );
};

export default LocationSearchScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  container: { flex: 1, marginTop: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
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
    paddingTop: 16,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  rowTitle: { fontSize: 16, color: "#111827", fontWeight: "500" },
  rowSubtitle: { fontSize: 14, color: "#6b7280" },
  footerText: { color: "gray", padding: 16 },
});
