import { Ionicons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AgePickerModal from "./modals/AgePickerModal";
import RNModal from "react-native-modal";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";
import {
  isoToDate,
  isoToDisplayWithOutYear,
  isoToTime,
  makeIso,
} from "../../utils/date";

const SearchHeader = ({ selectedLocation, startDate, endDate }) => {
  const theme = useSelector(selectTheme);

  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState("Addis Ababa");
  const [driverAge, setDriverAge] = useState("25");
  const [isAgePickerVisible, setAgePickerVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (selectedLocation) {
      setLocation(selectedLocation);
    }
  }, [selectedLocation]);
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
            <Text
              style={[styles.inputText, { fontSize: 13 }]}
            >{`${isoToDisplayWithOutYear(
              startDate
            )} - ${isoToDisplayWithOutYear(endDate)}`}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <RNModal
        isVisible={modalVisible}
        style={{
          margin: 0,
          justifyContent: "flex-start",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        backdropOpacity={0.2}
        statusBarTranslucent={true}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Where</Text>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              router.push({
                pathname: `/location-search`,
                params: {
                  start: isoToDate(startDate),
                  end: isoToDate(endDate),
                },
              });
            }}
          >
            <Text style={styles.input}>{location}</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>When</Text>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);

              router.push({
                pathname: "/DatePickerScreen",
                params: {
                  url: "/shop",
                  start: isoToDate(startDate),
                  end: isoToDate(endDate),
                  selectedLocation: selectedLocation,
                },
              });
            }}
          >
            <View style={styles.input}>
              <Text style={styles.inputText}>{`${isoToDisplayWithOutYear(
                startDate
              )} - ${isoToDisplayWithOutYear(endDate)}`}</Text>
            </View>
          </TouchableOpacity>

          {/* <Text style={styles.modalTitle}>Driver Age</Text>
            <TouchableOpacity
              style={styles.inputButton}
              onPress={() => setAgePickerVisible(true)}
            >
              <Text style={styles.inputText}>{driverAge}</Text>
              <Icon name="chevron-down-outline" size={20} color="#6b7280" />
            </TouchableOpacity> */}

          <TouchableOpacity
            style={[
              styles.searchModalButton,
              { backgroundColor: theme.secondary },
            ]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={[styles.searchModalButtonText]}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </RNModal>
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
    margin: 12,
    borderRadius: 14,
    marginTop: 60,
    // paddingTop: 30,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
  },
  modalTitle: { fontSize: 14, fontWeight: "500", color: "gray", marginTop: 15 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
    marginTop: 5,
    fontSize: 15,
    color: "#242424",
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
    fontSize: 15,
    color: "#242424",
  },
  searchModalButton: {
    backgroundColor: "#111827",
    padding: 10,
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
