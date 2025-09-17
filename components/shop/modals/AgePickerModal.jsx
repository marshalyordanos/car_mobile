import { Ionicons as Icon } from "@expo/vector-icons";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ageOptions = Array.from({ length: 54 - 18 + 1 }, (_, i) =>
  (18 + i).toString()
);
ageOptions.push("55+");

const AgePickerModal = ({ isVisible, onClose, onSelectAge, currentAge }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.optionRow}
      onPress={() => onSelectAge(item)}
    >
      <View style={styles.radioCircle}>
        {currentAge === item && <View style={styles.selectedRb} />}
      </View>
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={28} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Driver Age</Text>
            <View style={{ width: 28 }} />
          </View>

          <FlatList
            data={ageOptions}
            keyExtractor={(item) => item}
            renderItem={renderItem}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default AgePickerModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    height: "70%",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#111827",
  },
  optionText: {
    fontSize: 18,
    marginLeft: 16,
    color: "#111827",
  },
});
