import { Ionicons as Icon } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AgePickerModal from "./modals/AgePickerModal";

const SearchHeader = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState("Addis Ababa, Ethiopia");
  const [driverAge, setDriverAge] = useState("25");
  const [isAgePickerVisible, setAgePickerVisible] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.selectedLocation) {
      setLocation(params.selectedLocation);
    }
  }, [params.selectedLocation]);
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleSelectAge = (age) => {
    setDriverAge(age);
    setAgePickerVisible(false);
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.searchBarContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Icon name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.searchText}>{location}</Text>
            <Text style={styles.subText}>Add dates • Age: 25</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Where</Text>
            <TouchableOpacity
              onPress={() => {
                router.push(`/LocationSearchScreen`);
              }}
            >
              <Text style={styles.input}>{location}</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>When</Text>
            <TouchableOpacity onPress={() => router.push("/DatePickerScreen")}>
              <View style={styles.input}>
                <Text style={styles.inputText}>Add dates or months</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Driver Age</Text>
            <TouchableOpacity
              style={styles.inputButton}
              onPress={() => setAgePickerVisible(true)}
            >
              <Text style={styles.inputText}>{driverAge}</Text>
              <Icon name="chevron-down-outline" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.searchModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.searchModalButtonText}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <AgePickerModal
        isVisible={isAgePickerVisible}
        onClose={() => setAgePickerVisible(false)}
        onSelectAge={handleSelectAge}
        currentAge={driverAge}
      />
    </>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 30,
    height: 60,
  },
  backButton: {
    paddingHorizontal: 16,
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#d1d5db",
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  searchText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  subText: {
    fontSize: 12,
    color: "gray",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  modalTitle: { fontSize: 16, fontWeight: "500", color: "gray", marginTop: 15 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    fontSize: 18,
    paddingVertical: 8,
    marginTop: 5,
    color: "#9ca3af",
  },
  inputButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
    marginTop: 5,
  },
  inputText: {
    fontSize: 18,
    color: "#9ca3af",
  },
  searchModalButton: {
    backgroundColor: "#111827",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  searchModalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    alignItems: "center",
  },
  closeButtonText: {
    color: "gray",
  },
});
