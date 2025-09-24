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
import { setSortByFilter } from "../../../redux/filtersSlice";

const sortOptions = [
  { label: "Relevance", value: "Relevance" },
  { label: "Price: low to high", value: "price_asc" },
  { label: "Price: high to low", value: "price_desc" },
  { label: "Distance away", value: "distance_asc" },
];

const SortByModal = ({ isVisible, onClose }) => {
  const dispatch = useDispatch();
  const currentSortBy = useSelector((state) => state.filters.sortBy);

  const handleSelectOption = (option) => {
    dispatch(setSortByFilter(option.value));
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
            <Text style={styles.headerTitle}>Sort by</Text>

            <FlatList
              data={sortOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => handleSelectOption(item)}
                >
                  <Icon
                    name={
                      currentSortBy === item.value
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={24}
                    color={currentSortBy === item.value ? "#393381" : "#111827"}
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

export default SortByModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: 250,
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
