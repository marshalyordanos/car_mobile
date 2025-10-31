import { Ionicons as Icon } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useMemo, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InteractionManager } from "react-native";
import MonthsView from "../components/date/MonthsView";
import { makeIso } from "../utils/date";

const DatePickerScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dates");
  const [selectedDates, setSelectedDates] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);
  const [returnTime, setReturnTime] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState(3);
  const [showCalendar, setShowCalendar] = useState(false);
  const monthOptions = useMemo(
    () => Array.from({ length: 11 }, (_, i) => i + 1),
    []
  );
  const { url, par, start, end, selectedLocation } = useLocalSearchParams();

  console.log("url,par: ", url, par, end, start);
  // Generate time slots only once
  const timeSlots = useMemo(() => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour12 = h % 12 || 12;
        const minute = m.toString().padStart(2, "0");
        const period = h < 12 ? "AM" : "PM";
        times.push(`${hour12}:${minute} ${period}`);
      }
    }
    return times;
  }, []);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setShowCalendar(true);
    });
  }, []);

  useEffect(() => {
    if (start && end) {
      setStartDate(start);
      setEndDate(end);
    }
  }, [start, end]);

  const formatDate = (dateString, timeString) => {
    if (!dateString) return null;
    const date = new Date(`${dateString}T00:00:00`);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return timeString ? `${formattedDate}, ${timeString}` : formattedDate;
  };

  console.log("sattrDATE:", startDate, endDate, pickupTime, returnTime);

  const handleReset = () => {
    setSelectedDates({});
    setStartDate(null);
    setEndDate(null);
    setPickupTime(null);
    setReturnTime(null);
  };

  const handleSearch = () => {
    console.log("Searching...", startDate, pickupTime, endDate, returnTime, {
      startDate: makeIso(startDate, pickupTime),
      endDate: makeIso(endDate, pickupTime),
      ...JSON.parse(par || "{}"),
    });
    router.push({
      pathname: url,
      params: {
        selectedLocation: selectedLocation,
        startDate: makeIso(startDate, pickupTime),
        endDate: makeIso(endDate, returnTime),
        ...JSON.parse(par || "{}"),
      },
    });
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
      const newSelected = {};
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
      setEndDate(dateString);
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

  const getMarkedDates = (start, end) => {
    const marked = {};
    let current = new Date(start);
    const last = new Date(end);

    while (current <= last) {
      const dateStr = current.toISOString().slice(0, 10);

      marked[dateStr] = {
        color: "#E0E7FF", // light purple for range
        textColor: "#2140a7", // dark blue text
      };

      current.setDate(current.getDate() + 1);
    }

    // Customize start and end with rounded style
    marked[start] = {
      startingDay: true,
      color: "#000000", // stronger purple for start
      textColor: "white",
    };
    marked[end] = {
      endingDay: true,
      color: "#000000", // stronger purple for end
      textColor: "white",
    };

    return marked;
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Icon name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <View style={styles.tabsContainer}>
              {["Dates", "Months"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.activeTabText,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ width: 24 }} />
          </View>

          {activeTab === "Dates" && showCalendar && (
            <>
              <View style={styles.dateHeader}>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={
                      startDate
                        ? styles.dateHeaderText
                        : styles.dateHeaderPlaceholder
                    }
                  >
                    {formatDate(startDate) || "Start date"}
                  </Text>
                  <Text style={{}}>{pickupTime || ""}</Text>
                </View>
                <View>
                  <Icon name="arrow-forward" size={22} color="#9ca3af" />
                  <Text></Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={
                      endDate
                        ? styles.dateHeaderText
                        : styles.dateHeaderPlaceholder
                    }
                  >
                    {formatDate(endDate) || "End date"}
                  </Text>
                  <Text style={{}}>{returnTime || ""}</Text>
                </View>
              </View>

              <Calendar
                current={startDate || endDate || todayStr}
                markingType="period"
                markedDates={getMarkedDates(startDate, endDate)}
                onDayPress={onDayPress}
                minDate={new Date().toISOString().split("T")[0]} // <-- disables past dates
                theme={{
                  backgroundColor: "white",
                  calendarBackground: "white",
                  textDayFontSize: 14,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 12,
                  textMonthFontWeight: "bold",
                  textDayHeaderFontWeight: "bold",
                  textSectionTitleColor: "#111827",
                  dayHeaderTextColor: "#111827",
                  dayTextColor: "#111827",
                  todayTextColor: "#111827",
                  selectedDayTextColor: "white",
                  monthTextColor: "#111827",
                  arrowColor: "#111827",
                }}
              />

              {startDate && endDate && (
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
                      onPress={handleSearch}
                    >
                      <Text style={styles.searchButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          )}

          {activeTab === "Months" && (
            <MonthsView
              selectedMonths={selectedMonths}
              onMonthChange={setSelectedMonths}
              monthOptions={monthOptions}
              onReset={() => setSelectedMonths(3)}
              onSearch={handleSearch}
            />
          )}
        </ScrollView>
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
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 4,
  },
  tab: { paddingVertical: 4, paddingHorizontal: 20, borderRadius: 6 },
  activeTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  tabText: { color: "#6b7280", fontWeight: "500", fontSize: 11 },
  activeTabText: { color: "#111827" },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 5,
  },
  dateHeaderText: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  dateHeaderPlaceholder: { fontSize: 18, fontWeight: "bold", color: "#9ca3af" },
  footer: { padding: 16, backgroundColor: "white" },
  timeLabel: {
    marginTop: 16,
    color: "#000000",
    fontWeight: "bold",
    marginBottom: 13,
    fontSize: 11,
  },
  timeSlot: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 7,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginRight: 16,
  },
  activeTimeSlot: { backgroundColor: "#111827", borderColor: "#111827" },
  timeText: { color: "#111827", fontWeight: "500", fontSize: 11 },
  activeTimeText: { color: "white" },
  footerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 35,
  },
  resetButton: {
    marginLeft: 12,
    color: "#111827",
    fontSize: 15,
    fontWeight: "bold",
  },
  searchButton: {
    backgroundColor: "#111827",
    marginRight: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  searchButtonText: { color: "white", fontSize: 15, fontWeight: "bold" },
});
