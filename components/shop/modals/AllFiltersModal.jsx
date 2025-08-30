import { Ionicons as Icon } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useMemo, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import icons from "../../../constants/icons";
import TypeButton from "../shared/ui/TypeButton";
import FilterRow from "../ui/FilterRow";
import FilterToggle from "../ui/FilterToggle";

const vehicleTypes = [
  { label: "Cars", icon: icons.car },
  { label: "SUVs", icon: icons.suv },
  { label: "Minivans", icon: icons.minivan },
  { label: "Trucks", icon: icons.truck },
  { label: "Vans", icon: icons.van },
  { label: "Cargo vans", icon: icons.cargovan },
  { label: "Box trucks", icon: icons.boxtruck },
];

const features = [
  {
    label: "Wheelchair accessible",
    iconName: "wheelchair",
    iconSet: "FontAwesome",
  },
  { label: "All-wheel drive", iconName: "drive-eta", iconSet: "MaterialIcons" },
  { label: "Android Auto", iconName: "android", iconSet: "FontAwesome" },
  { label: "Apple CarPlay", iconName: "apple", iconSet: "FontAwesome" },
  { label: "AUX input", iconName: "volume-up", iconSet: "FontAwesome" },
  { label: "Backup camera", iconName: "camera-rear", iconSet: "MaterialIcons" },
  { label: "GPS", iconName: "location-on", iconSet: "MaterialIcons" },
  { label: "Sunroof", iconName: "wb-sunny", iconSet: "MaterialIcons" },
];

const ecoFriendlyTypes = [
  { label: "Electric", iconName: "bolt", iconSet: "FontAwesome" },
  { label: "Hybrid", iconName: "leaf", iconSet: "FontAwesome" },
];

const MIN_YEAR = 1952;
const MAX_YEAR = new Date().getFullYear();

const AllFiltersModal = ({ isVisible, onClose }) => {
  const [priceRange, setPriceRange] = useState([10, 500]);
  const [address, setAddress] = useState("");
  const [yearRange, setYearRange] = useState([MIN_YEAR, MAX_YEAR]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [ecoFriendly, setEcoFriendly] = useState([]);
  const [isDeluxe, setIsDeluxe] = useState(false);
  const [isSuperDeluxe, setIsSuperDeluxe] = useState(false);
  const [isAllStar, setIsAllStar] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

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

  const handleReset = () => {
    setPriceRange([10, 500]);
    setAddress("");
    setYearRange([1952, new Date().getFullYear()]);
    setEcoFriendly([]);
    setSelectedFeatures([]);
    setSelectedTypes([]);
    setIsDeluxe(false);
    setIsSuperDeluxe(false);
    setIsAllStar(false);
  };
  return (
    <Modal animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
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
              value="Relevance"
              onPress={() => console.log("Open Sort by")}
            />
            <View style={styles.divider} />
            {/* Daily Price Section */}
            <Text style={styles.sectionTitle}>Daily Price</Text>
            <Text style={styles.rangeText}>
              {" "}
              ${priceRange[0]} - ${priceRange[1]}
              {priceRange[1] >= 500 ? "+" : ""}/day{" "}
            </Text>

            <View style={styles.sliderContainer}>
              <MultiSlider
                values={[priceRange[0], priceRange[1]]}
                sliderLength={330}
                onValuesChange={setPriceRange}
                min={10}
                max={500}
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
                    icon={type.icon}
                    isSelected={selectedTypes.includes(type.label)}
                    onPress={() =>
                      handleToggleSelection(
                        type.label,
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
              onPress={() => console.log("Open Make & Model")}
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
              value="All Seats"
              onPress={() => console.log("Open Seats")}
            />
            <FilterRow
              label="Transmission"
              value="All transmissions"
              onPress={() => console.log("Open Transmissions")}
            />

            {/* Eco-friendly Section */}
            <Text style={styles.sectionTitle}>Eco-friendly</Text>
            <View style={styles.ecoFriendlyContainer}>
              {ecoFriendlyTypes.map((type) => (
                <TypeButton
                  key={type.label}
                  label={type.label}
                  iconName={type.iconName}
                  iconSet={type.iconSet}
                  isSelected={ecoFriendly.includes(type.label)}
                  onPress={() =>
                    handleToggleSelection(
                      type.label,
                      ecoFriendly,
                      setEcoFriendly
                    )
                  }
                />
              ))}
            </View>
            <View style={styles.divider} />

            {/* Features Section */}
            <Text style={styles.sectionTitle}>Features</Text>
            <>
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
              </View>
              {features.length > 6 && (
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
              )}
              <View style={styles.divider} />
            </>

            {/* Pickup Options Section */}
            <Text style={styles.sectionTitle}>Pickup options</Text>

            <Text style={styles.pickupTitle}>Host brings the car to me</Text>
            <Text style={styles.pickupSubtitle}>
              Show cars that can be delivered directly to an address or specific
              location.
            </Text>
            <View style={styles.inputContainer}>
              <Icon name="search-outline" size={20} color="#6b7280" />
              <TextInput
                style={styles.input}
                placeholder="Enter address"
                placeholderTextColor="#9ca3af"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            {/* Elevate Your Experience Section */}
            <Text style={styles.sectionTitle}>Elevate your experience</Text>
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
            />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resultsButton} onPress={onClose}>
              <Text style={styles.resultsButtonText}>View 200+ results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default AllFiltersModal;

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
  headerButton: { fontSize: 16, color: "#111827" },
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
    paddingVertical: 5,
  },
  input: {
    fontSize: 14,
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
