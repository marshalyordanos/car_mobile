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
import { useDispatch, useSelector } from "react-redux";
import { setTransmissionFilter } from "../../../redux/filtersSlice";

const transmissionOptions = [
  { label: "All transmissions", value: "All" },
  { label: "Manual", value: "Manual" },
  { label: "Automatic", value: "Automatic" },
];

const TransmissionModal = ({ isVisible, onClose }) => {
  const dispatch = useDispatch();
  const currentTransmission = useSelector(
    (state) => state.filters.transmission
  );

  const handleSelectOption = (option) => {
    dispatch(setTransmissionFilter(option.value));
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <SafeAreaView>
          <View
            onStartShouldSetResponder={() => true}
            style={styles.modalContent}
          >
            <Text style={styles.headerTitle}>Transmission</Text>

            <FlatList
              data={transmissionOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => handleSelectOption(item)}
                >
                  <Icon
                    name={
                      currentTransmission === item.value
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={24}
                    color={
                      currentTransmission === item.value ? "#393381" : "#111827"
                    }
                  />
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  );
};

export default TransmissionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#111827",
    marginLeft: 12,
  },
});
