import { Ionicons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DatePickerScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dates");
  const [selectedDates, setSelectedDates] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);
  const [returnTime, setReturnTime] = useState(null);

  const formatDate = (dateString, timeString) => {
    if (!dateString) return null;
    const date = new Date(`${dateString}T00:00:00`);
    const dateOptions = { weekday: "short", month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    if (timeString) {
      return `${formattedDate}, ${timeString}`;
    }
    return formattedDate;
  };

  const handleReset = () => {
    setSelectedDates({});
    setStartDate(null);
    setEndDate(null);
    setPickupTime(null);
    setReturnTime(null);
  };

  const onDayPress = (day) => {
    const dateString = day.dateString;
    if (startDate && !endDate) {
      const start = new Date(startDate);
      const end = new Date(dateString);

      if (end < start) {
        setStartDate(dateString);
        setSelectedDates({
          [dateString]: { selected: true, startingDay: true, color: "#111827" },
        });
        return;
      }

      setEndDate(dateString);
      let newSelected = {};
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const isoDate = d.toISOString().split("T")[0];
        newSelected[isoDate] = {
          color:
            isoDate === startDate || isoDate === dateString
              ? "#111827"
              : "#e0e7ff",
          textColor:
            isoDate === startDate || isoDate === dateString
              ? "white"
              : "#111827",
          startingDay: isoDate === startDate,
          endingDay: isoDate === dateString,
        };
      }
      setSelectedDates(newSelected);
    } else {
      setStartDate(dateString);
      setEndDate(null);
      setSelectedDates({
        [dateString]: { selected: true, startingDay: true, color: "#111827" },
      });
      setPickupTime(null);
      setReturnTime(null);
    }
  };

  const generateTimeSlots = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        times.push(
          `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
        );
      }
    }
    return times;
  };
  const timeSlots = generateTimeSlots();

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingTop: insets.top }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Dates" && styles.activeTab]}
            onPress={() => setActiveTab("Dates")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Dates" && styles.activeTabText,
              ]}
            >
              Dates
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Months" && styles.activeTab]}
            onPress={() => setActiveTab("Months")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Months" && styles.activeTabText,
              ]}
            >
              Months
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.dateHeader}>
        <Text
          style={
            startDate ? styles.dateHeaderText : styles.dateHeaderPlaceholder
          }
        >
          {formatDate(startDate, pickupTime) || "Start date"}
        </Text>
        <Icon name="arrow-forward" size={22} color="#9ca3af" />
        <Text
          style={endDate ? styles.dateHeaderText : styles.dateHeaderPlaceholder}
        >
          {formatDate(endDate, returnTime) || "End date"}
        </Text>
      </View>

      <Calendar
        markingType={"period"}
        markedDates={selectedDates}
        onDayPress={onDayPress}
        heme={{
          backgroundColor: "white",
          calendarBackground: "white",
          textSectionTitleColor: "#111827",
          dayHeaderTextColor: "#111827",
          dayTextColor: "#111827",
          todayTextColor: "#111827",
          selectedDayTextColor: "white",
          monthTextColor: "#111827",
          arrowColor: "#111827",
          "stylesheet.calendar.header": {
            week: {
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            },
          },
        }}
      />
      <View style={styles.divider} />
      <View style={styles.footer}>
        <Text style={styles.timeLabel}>PICKUP</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={`p-${time}`}
              style={[
                styles.timeSlot,
                pickupTime === time && styles.activeTimeSlot,
              ]}
              onPress={() => setPickupTime(time)}
            >
              <Text
                style={[
                  styles.timeText,
                  pickupTime === time && styles.activeTimeText,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.timeLabel}>RETURN</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={`r-${time}`}
              style={[
                styles.timeSlot,
                returnTime === time && styles.activeTimeSlot,
              ]}
              onPress={() => setReturnTime(time)}
            >
              <Text
                style={[
                  styles.timeText,
                  returnTime === time && styles.activeTimeText,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footerActions}>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetButton}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => router.back()}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default DatePickerScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#c3c6ceff",
    borderRadius: 8,
    padding: 4,
  },
  tab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 6 },
  activeTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  tabText: { color: "#6b7280", fontWeight: "600" },
  activeTabText: { color: "#111827" },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dateHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  dateHeaderPlaceholder: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9ca3af",
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
  },
  footer: {
    padding: 16,
    backgroundColor: "white",
  },
  timeLabel: {
    marginTop: 16,
    color: "#6b7280",
    fontWeight: "bold",
    marginBottom: 13,
    fontSize: 12,
  },
  timeSlot: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeTimeSlot: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  timeText: {
    color: "#111827",
    fontWeight: "500",
  },
  activeTimeText: {
    color: "white",
  },
  footerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 60,
  },
  resetButton: {
    marginLeft: 12,
    color: "#111827",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchButton: {
    backgroundColor: "#111827",
    marginRight: 5,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
