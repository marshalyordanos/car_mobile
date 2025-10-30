import React, { memo, useEffect, useMemo, useState } from "react";
import { Ionicons as Icon } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  LayoutAnimation,
  UIManager,
  Platform,
  Keyboard,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "../../../redux/filterOptionsSlice";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function toggleBrandSelection({ brandId, filter, modelsByBrand }) {
  const brandSelected = filter.brands.includes(brandId);
  if (brandSelected) {
    const modelsToRemove = modelsByBrand[brandId] || [];
    return {
      ...filter,
      brands: filter?.brands.filter((id) => id !== brandId),
      models: filter?.models.filter((id) => !modelsToRemove.includes(id)),
    };
  } else {
    const modelsToAdd = modelsByBrand[brandId] || [];
    return {
      ...filter,
      brands: [...filter.brands, brandId],
      models: Array.from(new Set([...filter.models, ...modelsToAdd])),
    };
  }
}

function toggleModelSelection({ modelId, makeId, filter, modelsByBrand }) {
  const modelSelected = filter.models.includes(modelId);
  let newModels = modelSelected
    ? filter.models.filter((id) => id !== modelId)
    : [...filter.models, modelId];

  const remainingModels = (modelsByBrand[makeId] || []).filter((id) =>
    newModels.includes(id)
  );
  const newBrands =
    remainingModels.length === 0
      ? filter.brands.filter((id) => id !== makeId)
      : filter.brands.includes(makeId)
      ? filter.brands
      : [...filter.brands, makeId];

  return { ...filter, brands: newBrands, models: newModels };
}

function brandSelectionState({ brandId, filter, modelsByBrand }) {
  const models = modelsByBrand[brandId] || [];
  if (!models.length) return filter?.brands.includes(brandId) ? "all" : "none";
  const selectedCount = models.filter((id) =>
    filter?.models.includes(id)
  ).length;
  if (selectedCount === 0) return "none";
  if (selectedCount === models.length) return "all";
  return "partial";
}

const MakeModelModal = ({ isVisible, onClose, filter, setFilter }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState("");
  const [expandedBrands, setExpandedBrands] = useState({});
  const [isFocused, setIsFocused] = useState(false);

  const { brands: allBrands, status } = useSelector(
    (s) => s.filterOptions.brandsWithModels || { brands: [], status: "idle" }
  );

  useEffect(() => {
    if (isVisible && status === "idle") {
      dispatch(fetchBrands());
    }
  }, [isVisible, status]);

  const modelsByBrand = useMemo(() => {
    const map = {};
    allBrands?.forEach((b) => {
      map[b.id] = (b?.models || []).map((m) => m.id);
    });
    return map;
  }, [allBrands]);

  const filteredBrands = useMemo(() => {
    const q = searchText.toLowerCase().trim();
    if (!q) return allBrands;
    return allBrands
      .map((b) => ({
        ...b,
        models: (b?.models || []).filter((m) =>
          m.name.toLowerCase().includes(q)
        ),
      }))
      .filter(
        (b) => b.name.toLowerCase().includes(q) || (b?.models || []).length > 0
      );
  }, [allBrands, searchText]);

  const handleToggleBrand = (brandId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilter(toggleBrandSelection({ brandId, filter, modelsByBrand }));
  };

  const handleToggleModel = (model, makeId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilter(
      toggleModelSelection({ modelId: model.id, makeId, filter, modelsByBrand })
    );
  };

  const handleReset = () => {
    setFilter({ ...filter, brands: [], models: [] });
  };

  const toggleExpand = (brandId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedBrands((prev) => ({ ...prev, [brandId]: !prev[brandId] }));
  };

  return (
    <Modal animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={28} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Make & Model</Text>
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
                <Text style={styles.floatingLabel}>Search make or model</Text>
              )}
              <TextInput
                style={[
                  styles.input,
                  (isFocused || searchText.length > 0) && { paddingTop: 16 },
                ]}
                placeholder={
                  isFocused || searchText.length > 0
                    ? ""
                    : "Search make or model"
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
                Keyboard.dismiss();
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
          <Text style={styles.errorText}>Error loading brands</Text>
        )}

        {status === "succeeded" && (
          <FlatList
            data={filteredBrands}
            keyExtractor={(item) => item.id}
            renderItem={({ item: brand }) => {
              const checkboxState = brandSelectionState({
                brandId: brand.id,
                filter,
                modelsByBrand,
              });
              const isExpanded = !!expandedBrands[brand.id];
              const brandHasModels = (brand.models || []).length > 0;

              return (
                <View>
                  <View style={styles.row}>
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={() => handleToggleBrand(brand.id)}
                    >
                      <Icon
                        name={
                          checkboxState === "all"
                            ? "checkbox"
                            : checkboxState === "partial"
                            ? "remove-circle"
                            : "square-outline"
                        }
                        size={24}
                        color={checkboxState === "none" ? "#111827" : "#393381"}
                      />
                      <Text style={styles.rowText}>{brand.name}</Text>
                    </TouchableOpacity>

                    {brandHasModels && (
                      <TouchableOpacity
                        onPress={() => toggleExpand(brand.id)}
                        style={{ paddingHorizontal: 8 }}
                      >
                        <Icon
                          name={isExpanded ? "chevron-down" : "chevron-forward"}
                          size={20}
                          color="#6b7280"
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {isExpanded && brandHasModels && (
                    <View style={styles.modelsContainer}>
                      {brand.models.map((model) => (
                        <View key={model.id} style={styles.modelRow}>
                          <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => handleToggleModel(model, brand.id)}
                          >
                            <Icon
                              name={
                                filter.models.includes(model.id)
                                  ? "checkbox"
                                  : "square-outline"
                              }
                              size={20}
                              color={
                                filter.models.includes(model.id)
                                  ? "#393381"
                                  : "#111827"
                              }
                            />
                            <Text style={styles.modelText}>{model.name}</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            }}
          />
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resultsButton} onPress={onClose}>
            <Text style={styles.resultsButtonText}>
              View results{" "}
              {filter?.models?.length > 0 && `(${filter?.models?.length})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default memo(MakeModelModal);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  container: { flex: 1, backgroundColor: "white" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  headerButton: { fontSize: 16, color: "#111827" },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
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
  inputContainerFocused: { borderColor: "#111827", backgroundColor: "white" },
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
  input: { fontSize: 16, color: "#111827" },
  cancelButton: { marginLeft: 12, padding: 8 },
  cancelButtonText: { fontSize: 16, color: "#111827", fontWeight: "500" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  checkboxContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  rowText: { flex: 1, fontSize: 16, color: "#111827", marginLeft: 16 },
  modelsContainer: { paddingLeft: 40, backgroundColor: "#f9fafb" },
  modelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modelText: { fontSize: 15, color: "#111827", marginLeft: 12 },
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
