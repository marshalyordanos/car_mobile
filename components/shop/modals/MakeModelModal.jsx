import { Ionicons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "../../../redux/filterOptionsSlice";
import {
  resetMakeModelFilter,
  setBrandsFilter,
} from "../../../redux/filtersSlice";

const MakeModelModal = ({ isVisible, onClose }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const closeSignal = useSelector((state) => state.filters.closeSignal);
  const lastSignal = useRef(closeSignal);
  const selectedBrandIds = useSelector((state) => state.filters.brands);
  const { items: allBrands, status } = useSelector(
    (state) => state.filterOptions.brands
  );
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isVisible && status === "idle") {
      dispatch(fetchBrands());
    }
  }, [isVisible, status, dispatch]);

  useEffect(() => {
    if (closeSignal > lastSignal.current) {
      lastSignal.current = closeSignal;
      onClose();
    }
  }, [closeSignal, onClose]);

  const filteredBrands = useMemo(
    () =>
      allBrands.filter((brand) =>
        brand.name.toLowerCase().includes(searchText.toLowerCase())
      ),
    [allBrands, searchText]
  );

  const handleNavigateToModel = (brand) => {
    router.push({
      pathname: "/model-select",
      params: { brandId: brand._id, brandName: brand.name },
    });
  };

  const handleSelectBrand = (brandId) => {
    let newSelection;
    if (selectedBrandIds.includes(brandId)) {
      newSelection = selectedBrandIds.filter((id) => id !== brandId);
    } else {
      newSelection = [...selectedBrandIds, brandId];
    }
    dispatch(setBrandsFilter(newSelection));
  };

  const handleReset = () => {
    console.log("Resetting Make & Model filters...");
    dispatch(resetMakeModelFilter());
  };

  return (
    <Modal
      animationType="slide"
      // style={{ marginHorizontal: 10 }}
      // transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={28} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Make & model</Text>
            <TouchableOpacity onPress={handleReset}>
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
          {status === "loading" && (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          )}
          {status === "failed" && (
            <Text style={styles.errorText}>Error loading brands.</Text>
          )}
          {status === "succeeded" && (
            <FlatList
              data={filteredBrands}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => handleSelectBrand(item._id)}
                  >
                    <Icon
                      name={
                        selectedBrandIds.includes(item._id)
                          ? "checkbox"
                          : "square-outline"
                      }
                      size={24}
                      color={
                        selectedBrandIds.includes(item._id)
                          ? "#393381"
                          : "#111827"
                      }
                    />
                    <Text style={styles.rowText}>{item.name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleNavigateToModel(item)}>
                    <Icon name="chevron-forward" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

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

export default memo(MakeModelModal);

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
  checkboxContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
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
  errorText: { textAlign: "center", marginTop: 20, color: "red" },
});
