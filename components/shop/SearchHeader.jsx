import { Ionicons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SearchHeader = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.searchText}>Addis Ababa, Ethiopia</Text>
          <Text style={styles.subText}>Add dates • Age: 25</Text>
        </TouchableOpacity>
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
            <TextInput
              style={styles.input}
              placeholder="Addis Ababa, Ethiopia"
            />

            <Text style={styles.modalTitle}>When</Text>
            <TextInput style={styles.input} placeholder="Add dates or months" />

            <Text style={styles.modalTitle}>Driver Age</Text>
            <TextInput style={styles.input} placeholder="25" />

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
    </>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  searchButton: { flex: 1, marginLeft: 15, backgroundColor: "#f3f4f6" },
  searchText: { fontSize: 16, fontWeight: "bold" },
  subText: { fontSize: 12, color: "gray" },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 60,
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
