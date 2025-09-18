import { Ionicons as Icon } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { fetchModels } from "../redux/filterOptionsSlice";
import { setModelsFilter, triggerCloseSignal } from "../redux/filtersSlice";

const ModelSelectScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const { items: allModels, status } = useSelector(
    (state) => state.filterOptions.models
  );
  const selectedModelIds = useSelector((state) => state.filters.models);

  const [searchText, setSearchText] = useState("");
  const { brandId, brandName } = params;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchModels());
    }
  }, [dispatch, status]);

  const filteredModels = useMemo(() => {
    if (!allModels || allModels.length === 0) return [];
    return allModels
      .filter((model) => model.brand === brandId)
      .filter((model) =>
        model.name.toLowerCase().includes(searchText.toLowerCase())
      );
  }, [allModels, brandId, searchText]);

  const handleSelectModel = (modelId) => {
    let newSelection;
    if (selectedModelIds.includes(modelId)) {
      newSelection = selectedModelIds.filter((id) => id !== modelId);
    } else {
      newSelection = [...selectedModelIds, modelId];
    }
    dispatch(setModelsFilter(newSelection));
  };

  const handleSelectAll = () => {
    const allVisibleModelIds = filteredModels.map((m) => m._id);
    const newSelection = [
      ...new Set([...selectedModelIds, ...allVisibleModelIds]),
    ];
    dispatch(setModelsFilter(newSelection));
  };
  const handleClearAll = () => {
    const allVisibleModelIds = filteredModels.map((m) => m._id);
    const newSelection = selectedModelIds.filter(
      (id) => !allVisibleModelIds.includes(id)
    );
    dispatch(setModelsFilter(newSelection));
  };
  const hasSelection = useMemo(
    () => filteredModels.some((model) => selectedModelIds.includes(model._id)),
    [filteredModels, selectedModelIds]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{brandName}</Text>
          {hasSelection ? (
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.headerButton}>Clear all</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSelectAll}>
              <Text style={styles.headerButton}>Select all</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            style={styles.input}
            placeholder="Search model"
            placeholderTextColor="#9ca3af"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {status === "loading" && (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}
        {status === "succeeded" && (
          <FlatList
            data={filteredModels}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => handleSelectModel(item._id)}
              >
                <Icon
                  name={
                    selectedModelIds.includes(item._id)
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={24}
                  color={
                    selectedModelIds.includes(item._id) ? "#393381" : "#111827"
                  }
                />
                <Text style={styles.rowText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resultsButton}
            onPress={() => {
              dispatch(triggerCloseSignal());
              router.back();
            }}
          >
            <Text style={styles.resultsButtonText}>View results</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default ModelSelectScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  headerButton: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 12,
    margin: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 12,
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  rowText: { flex: 1, fontSize: 16, color: "#111827", marginLeft: 16 },
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
