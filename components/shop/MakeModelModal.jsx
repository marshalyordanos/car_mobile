import { Ionicons as Icon } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ALL_MAKES = [
  "AM General",
  "Acura",
  "Alfa-Romeo",
  "Amc",
  "Aston Martin",
  "Audi",
  "Austin-healy",
  "BMW",
  "Bentley",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Dodge",
  "Ferrari",
  "Ford",
  "GMC",
  "Honda",
  "Hyundai",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Maserati",
  "Mazda",
  "Mercedes-Benz",
  "Nissan",
  "Porsche",
  "Tesla",
  "Toyota",
  "Volkswagen",
];

const MakeModelModal = ({ isVisible, onClose }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedMakes, setSelectedMakes] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const filteredMakes = useMemo(
    () =>
      ALL_MAKES.filter((make) =>
        make.toLowerCase().includes(searchText.toLowerCase())
      ),
    [searchText]
  );

  const handleSelectMake = (make) => {
    if (selectedMakes.includes(make)) {
      setSelectedMakes(selectedMakes.filter((m) => m !== make));
    } else {
      setSelectedMakes([...selectedMakes, make]);
    }
  };

  return (
    <Modal animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={28} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Make & model</Text>
            <TouchableOpacity onPress={() => setSelectedMakes([])}>
              <Text style={styles.headerButton}>Reset</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchSection}>
            <View
              style={[
                styles.inputContainer,
                isFocused && styles.inputContainerFocused,
              ]}
            >
              <Icon name="search-outline" size={20} color="#71767eff" />
              <View style={styles.textInputWrapper}>
                {(isFocused || searchText.length > 0) && (
                  <Text style={styles.floatingLabel}>Search make</Text>
                )}
                <TextInput
                  style={[
                    styles.input,
                    (isFocused || searchText.length > 0) && { paddingTop: 16 },
                  ]}
                  placeholder={
                    isFocused || searchText.length > 0 ? "" : "Search make"
                  }
                  placeholderTextColor="#71767eff"
                  value={searchText}
                  onChangeText={setSearchText}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </View>
            </View>
            {isFocused && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsFocused(false);
                  setSearchText("");
                  require("react-native").Keyboard.dismiss();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredMakes}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => handleSelectMake(item)}
              >
                <Icon
                  name={
                    selectedMakes.includes(item) ? "checkbox" : "square-outline"
                  }
                  size={24}
                  color="#111827"
                />
                <Text style={styles.rowText}>{item}</Text>
                <Icon name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resultsButton} onPress={onClose}>
              <Text style={styles.resultsButtonText}>View results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default MakeModelModal;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: { flex: 1, backgroundColor: "white" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  headerButton: { fontSize: 16, color: "#111827" },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  inputContainerFocused: {
    borderColor: "black",
    backgroundColor: "white",
  },
  textInputWrapper: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    marginLeft: 8,
  },
  floatingLabel: {
    position: "absolute",
    top: 0,
    left: -4,
    fontSize: 14,
    color: "#6b7280",
    backgroundColor: "white",
    paddingHorizontal: 4,
    transform: [{ translateY: -12 }],
  },
  input: {
    fontSize: 16,
    color: "#111827",
  },
  cancelButton: {
    marginLeft: 12,
    padding: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    marginLeft: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    backgroundColor: "white",
  },
  resultsButton: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  resultsButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
