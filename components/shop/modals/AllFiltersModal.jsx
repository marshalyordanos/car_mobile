import { Ionicons as Icon } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useRouter } from "expo-router";
import { memo, useEffect, useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  resetAllFilters,
  setEcoFriendlyFilter,
  setFeaturesFilter,
  setMileageFilter,
  setPriceFilter,
  setVehicleTypesFilter,
  setYearFilter,
} from "../../../redux/filtersSlice";
import TypeButton from "../shared/ui/TypeButton";
import FilterRow from "../ui/FilterRow";
import FilterToggle from "../ui/FilterToggle";
import SortByModal from "./SortByModal";
import TransmissionModal from "./TransmissionModal";
import { vehicleTypes } from "./VehicleTypeSheet";

const featureIconMap = {
  "AUX input": { name: "musical-notes-outline", set: "Ionicons" },
  "All-wheel drive": { name: "snow", set: "Ionicons" },
  "Android Auto": { name: "logo-android", set: "Ionicons" },
  "Apple CarPlay": { name: "logo-apple", set: "Ionicons" },
  "Backup camera": { name: "camera-reverse-outline", set: "Ionicons" },
  "Bike rack": { name: "bicycle-outline", set: "Ionicons" },
  "Blind spot warning": { name: "warning-outline", set: "Ionicons" },
  Bluetooth: { name: "bluetooth-outline", set: "Ionicons" },
  "Child seat": { name: "happy-outline", set: "Ionicons" },
  Convertible: { name: "car-sport-outline", set: "Ionicons" },
  GPS: { name: "navigate-outline", set: "Ionicons" },
  "Heated seats": { name: "flame-outline", set: "Ionicons" },
  "Keyless entry": { name: "key-outline", set: "Ionicons" },
  "Pet friendly": { name: "paw-outline", set: "Ionicons" },
  "Ski rack": { name: "analytics-outline", set: "Ionicons" },
  "Snow tires": { name: "snow-outline", set: "Ionicons" },
  Sunroof: { name: "sunny-outline", set: "Ionicons" },
  "Toll pass": { name: "cash-outline", set: "Ionicons" },
  "USB charger": { name: "battery-charging-outline", set: "Ionicons" },
  "USB input": { name: "hardware-chip-outline", set: "Ionicons" },
  "Wheelchair accessible": { name: "body-outline", set: "Ionicons" },
};
const features = Object.keys(featureIconMap).map((label) => ({ label }));

const ecoFriendlyOptions = [
  { label: "Electric", iconName: "bolt", iconSet: "FontAwesome" },
];

const MIN_YEAR = 1952;
const MAX_YEAR = new Date().getFullYear();

const AllFiltersModal = ({
  isVisible,
  onClose,
  onNavigateToFilter,
  filters: globalFilters,
  setFilters,
}) => {
  const insets = useSafeAreaInsets();

  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedTypes, setSelectedTypes] = useState(
    globalFilters.vehicleTypes
  );
  const [priceRange, setPriceRange] = useState([
    globalFilters.price.min,
    globalFilters.price.max,
  ]);

  const [address, setAddress] = useState("");
  const [yearRange, setYearRange] = useState([
    globalFilters.years.min,
    globalFilters.years.max,
  ]);
  const [mileageRange, setMileageRange] = useState([
    globalFilters.mileage.min,
    globalFilters.mileage.max,
  ]);
  const [selectedFeatures, setSelectedFeatures] = useState(
    globalFilters.features
  );
  const [ecoFriendly, setEcoFriendly] = useState(globalFilters.ecoFriendly);
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [isTransmissionModalVisible, setTransmissionModalVisible] =
    useState(false);

  const [transmission, setTransmission] = useState(globalFilters?.transmission);
  const [isDeluxe, setIsDeluxe] = useState(false);
  const [isSuperDeluxe, setIsSuperDeluxe] = useState(false);
  const [isAllStar, setIsAllStar] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setPriceRange([globalFilters.price.min, globalFilters.price.max]);
      setYearRange([globalFilters.years.min, globalFilters.years.max]);
      setMileageRange([globalFilters.mileage.min, globalFilters.mileage.max]);
      setSelectedTypes(globalFilters.vehicleTypes);
      // setSelectedFeatures(globalFilters.features);
      setEcoFriendly(globalFilters.ecoFriendly);
    }
  }, [isVisible, globalFilters]);

  const rangeText =
    yearRange[0] === MIN_YEAR && yearRange[1] === MAX_YEAR
      ? "All years"
      : `${yearRange[0]} - ${yearRange[1]}`;

  const displayedFeatures = useMemo(() => {
    return showAllFeatures ? features : features.slice(0, 6);
  }, [showAllFeatures]);

  const handleToggleSelection = (item, selectedArray, setFunction) => {
    if (selectedArray.includes(item)) {
      setFunction(selectedArray.filter((i) => i !== item));
    } else {
      setFunction([...selectedArray, item]);
    }
  };

  const handleViewResults = () => {
    setFilters({
      ...globalFilters,
      price: { min: priceRange[0], max: priceRange[1] },
      vehicleTypes: selectedTypes,
      years: { min: yearRange[0], max: yearRange[1] },
      ecoFriendly: ecoFriendly,
      mileage: { min: mileageRange[0], max: mileageRange[1] },
      transmission: transmission,
    });
    // dispatch(setVehicleTypesFilter(selectedTypes));
    // dispatch(setYearFilter());
    // dispatch(setFeaturesFilter(selectedFeatures));
    // dispatch(setEcoFriendlyFilter(ecoFriendly));
    // dispatch(setMileageFilter({ min: mileageRange[0], max: mileageRange[1] }));
    onClose();
  };

  const handleReset = () => {
    setFilters({
      price: {
        min: 0,
        max: 10000,
      },
      vehicleTypes: [],
      years: {
        min: 1952,
        max: new Date().getFullYear(),
      },
      mileage: {
        min: 0,
        max: 1000,
      },
      seats: "All",
      brands: [],
      models: [],
      transmission: "All",
      ecoFriendly: false,
      features: [],
      sortBy: "Relevance",
      closeSignal: 0,
    });
  };
  return (
    <Modal animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={28} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.headerButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Sort by Section */}
          <FilterRow
            label="Sort by"
            value={globalFilters.sortBy}
            onPress={() => setSortModalVisible(true)}
          />
          <View style={styles.divider} />
          {/* Daily Price Section */}
          <Text style={styles.sectionTitle}>Daily Price</Text>
          <Text style={styles.rangeText}>
            {priceRange[0]} ETB - {priceRange[1]} ETB
            {Number(priceRange[1]) >= 10000 ? "+" : ""}/day{" "}
          </Text>

          <View style={styles.sliderContainer}>
            <MultiSlider
              values={priceRange}
              sliderLength={330}
              onValuesChange={setPriceRange}
              min={0}
              max={10000}
              step={5}
              allowOverlap={false}
              snapped
              minMarkerOverlapDistance={40}
              trackStyle={{
                height: 3,
                backgroundColor: "#e5e7eb",
              }}
              selectedStyle={{
                backgroundColor: "#111827",
              }}
              markerStyle={{
                height: 24,
                width: 24,
                borderRadius: 12,
                backgroundColor: "#111827",
                borderWidth: 1,
                borderColor: "white",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            />
          </View>
          {/* Vehicle Type Section */}
          <Text style={styles.sectionTitle}>Vehicle type</Text>
          <View style={styles.gridContainer}>
            {vehicleTypes.map((type) => (
              <View key={type.label} style={styles.buttonWrapper}>
                <TypeButton
                  label={type.label}
                  iconName={type.iconName}
                  iconSet="Ionicons"
                  isSelected={selectedTypes.includes(type.value)}
                  onPress={() =>
                    handleToggleSelection(
                      type.value,
                      selectedTypes,
                      setSelectedTypes
                    )
                  }
                  iconSize={40}
                />
              </View>
            ))}
          </View>
          <View style={styles.divider} />

          {/* Vehicle Attributes Section */}
          <Text style={styles.sectionTitle}>Vehicle attributes</Text>
          <FilterRow
            label="Make & model"
            value="All makes and models"
            onPress={() => onNavigateToFilter("Make & model")}
          />
          <Text style={styles.rangeText}>{rangeText}</Text>

          <View style={styles.sliderContainer}>
            <MultiSlider
              values={[yearRange[0], yearRange[1]]}
              sliderLength={330}
              onValuesChange={setYearRange}
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={1}
              allowOverlap={false}
              snapped
              minMarkerOverlapDistance={40}
              trackStyle={{
                height: 3,
                backgroundColor: "#e5e7eb",
              }}
              selectedStyle={{
                backgroundColor: "#111827",
              }}
              markerStyle={{
                height: 24,
                width: 24,
                borderRadius: 12,
                backgroundColor: "#111827",
                borderWidth: 1,
                borderColor: "white",
                elevation: 2,
              }}
            />
          </View>
          <FilterRow
            label="Number of seats"
            value={globalFilters.seats}
            onPress={() => onNavigateToFilter("Seats")}
          />
          <FilterRow
            label="Transmission"
            value={transmission}
            onPress={() => setTransmissionModalVisible(true)}
          />

          {/* Eco-friendly Section */}
          <Text style={styles.sectionTitle}>Eco-friendly</Text>
          <View style={styles.ecoFriendlyContainer}>
            {ecoFriendlyOptions.map((type) => (
              <TypeButton
                key={type.label}
                label={type.label}
                iconName={type.iconName}
                iconSet={type.iconSet}
                isSelected={ecoFriendly}
                onPress={() => setEcoFriendly(!ecoFriendly)}
              />
            ))}
          </View>
          <View style={styles.divider} />
          {/* ********************************** uncomment 1***************************************** */}

          {/* Features Section */}
          {/* <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.gridContainer}>
              {displayedFeatures.map((feature) => (
                <View key={feature.label} style={styles.buttonWrapper}>
                  <TypeButton
                    label={feature.label}
                    iconName={feature.iconName}
                    iconSet={feature.iconSet}
                    isSelected={selectedFeatures.includes(feature.label)}
                    onPress={() =>
                      handleToggleSelection(
                        feature.label,
                        selectedFeatures,
                        setSelectedFeatures
                      )
                    }
                  />
                </View>
              ))}
            </View> */}

          {/* {features.length > 6 && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setShowAllFeatures(!showAllFeatures)}
              >
                <Icon
                  name={showAllFeatures ? "remove" : "add"}
                  size={20}
                  color="#111827"
                />
                <Text style={styles.showMoreText}>
                  {showAllFeatures ? "Show less" : "Show more"}
                </Text>
              </TouchableOpacity>
            )} */}

          {/* <View style={styles.divider} /> */}

          {/* ********************************** uncomment 1***************************************** */}

          {/*  Mileage section */}
          <Text style={styles.sectionTitle}>Mileage included</Text>
          <Text style={styles.rangeText}>
            {mileageRange[0]} - {mileageRange[1]}
            {mileageRange[1] >= 1000 ? "+" : ""} mi/day
          </Text>

          <View style={styles.sliderContainer}>
            <MultiSlider
              values={mileageRange}
              sliderLength={330}
              onValuesChange={setMileageRange}
              min={0}
              max={1000}
              step={25}
              allowOverlap={false}
              snapped
              minMarkerOverlapDistance={40}
              trackStyle={{
                height: 3,
                backgroundColor: "#e5e7eb",
              }}
              selectedStyle={{
                backgroundColor: "#111827",
              }}
              markerStyle={{
                height: 24,
                width: 24,
                borderRadius: 12,
                backgroundColor: "#111827",
                borderWidth: 1,
                borderColor: "white",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            />
          </View>

          {/* <View style={styles.divider} /> */}

          {/* ********************************** uncomment 2***************************************** */}
          {/* Pickup Options Section
            <Text style={styles.sectionTitle}>Pickup options</Text>

            <Text style={styles.pickupTitle}>Host brings the car to me</Text>
            <Text style={styles.pickupSubtitle}>
              Show cars that can be delivered directly to an address or specific
              location.
            </Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => router.push("/location-search")}
            >
              <Icon name="search-outline" size={20} color="#6b7280" />
              <Text style={[styles.input, !address && styles.placeholderText]}>
                {address || "Enter address"}
              </Text>
            </TouchableOpacity> */}

          {/* Elevate Your Experience Section */}
          {/* <Text style={styles.sectionTitle}>Elevate your experience</Text>
            <FilterToggle
              label="Deluxe Class"
              description="Exclusive cars for guests ages 25+"
              value={isDeluxe}
              onValueChange={setIsDeluxe}
            />
            <FilterToggle
              label="Super Deluxe Class"
              description="Super exclusive cars for guests ages 30+"
              value={isSuperDeluxe}
              onValueChange={setIsSuperDeluxe}
            />
            <FilterToggle
              label="All-Star Host"
              description="Top-rated, experienced hosts"
              value={isAllStar}
              onValueChange={setIsAllStar}
            />
            <View style={styles.divider} />
            <FilterRow
              label="Collections"
              value="Select"
              onPress={() => console.log("Open Collections")}
            /> */}
          {/* ********************************** uncomment 2***************************************** */}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resultsButton}
            onPress={handleViewResults}
          >
            <Text style={styles.resultsButtonText}>View results </Text>
          </TouchableOpacity>
        </View>
      </View>
      <SortByModal
        isVisible={isSortModalVisible}
        onClose={() => setSortModalVisible(false)}
      />
      <TransmissionModal
        transmission={transmission}
        setTransmission={setTransmission}
        isVisible={isTransmissionModalVisible}
        onClose={() => setTransmissionModalVisible(false)}
      />
    </Modal>
  );
};
export default memo(AllFiltersModal);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6ff",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  headerButton: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  scrollContainer: { paddingHorizontal: 24, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 20,
    marginBottom: 16,
  },
  rangeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 14,
    marginBottom: 14,
  },
  sliderContainer: { alignItems: "center" },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  buttonWrapper: { width: "33.33%", padding: 8 },
  pickupTitle: { color: "#111827", fontWeight: "bold", marginBottom: 4 },
  pickupSubtitle: { color: "#6b7280", marginBottom: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    color: "#111827",
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
  divider: {
    height: 1,
    backgroundColor: "#b8b8b8ff",
    marginVertical: 12,
    marginHorizontal: -24,
  },
  ecoFriendlyContainer: {
    flexDirection: "row",
    gap: 16,
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 16,
  },
  showMoreText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
