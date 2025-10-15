import { Ionicons as Icon } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

const todayStr = new Date().toISOString().slice(0, 10);

const CalendarModalBetween = ({
  isVisible,
  onClose,
  onSave,
  mode = "start",
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const [selectedDate, setSelectedDate] = React.useState(null);

  const handleSave = () => {
    if (!endDate && startDate) {
      const start = new Date(startDate);

      // Calculate next month with correct end-of-month handling
      const targetMonth = start.getMonth() + 1; // add 1 month
      const targetYear = start.getFullYear() + Math.floor(targetMonth / 12);
      const month = targetMonth % 12;

      // Get last day of target month
      const lastDay = new Date(targetYear, month + 1, 0).getDate();
      const day = Math.min(start.getDate(), lastDay);

      const newEndDate = new Date(targetYear, month, day)
        .toISOString()
        .slice(0, 10);
      setEndDate(newEndDate);
    }

    onClose();
  };

  // Helper function to get all dates between start and end
  const getDatesInRange = (start, end) => {
    const dateArray = {};
    let currentDate = new Date(start);
    const lastDate = new Date(end);

    while (currentDate <= lastDate) {
      const dateStr = currentDate.toISOString().slice(0, 10); // "YYYY-MM-DD"
      dateArray[dateStr] = { color: "#111827", textColor: "white" };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
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
  const onDayPress = (day) => {
    const selected = day.dateString;

    if (new Date(selected) < new Date(todayStr)) return; // prevent past selection

    if (mode === "start") {
      if (endDate && new Date(selected) > new Date(endDate)) {
        // start is after end → update start and clear end
        setStartDate(selected);
        setEndDate(null);
      } else {
        setStartDate(selected);
      }
    } else if (mode === "end") {
      if (startDate && new Date(selected) < new Date(startDate)) {
        // end is before start → ignore
        return;
      }
      setEndDate(selected);
    }
    setSelectedDate(selected);
  };

  return (
    <Modal animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={28} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              Select {mode === "start" ? "start" : "end"} date
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <Calendar
            current={
              mode === "start" ? startDate || todayStr : endDate || todayStr
            } // focus on start or end
            onDayPress={onDayPress}
            markingType={"period"}
            markedDates={getMarkedDates(startDate, endDate)}
            // markedDates={{
            //   [startDate]: {
            //     customStyles: {
            //       container: { backgroundColor: "#111827", borderRadius: 16 },
            //       text: { color: "white", fontWeight: "bold" },
            //     },
            //   },
            //   [endDate]: {
            //     customStyles: {
            //       container: { backgroundColor: "#111827", borderRadius: 16 },
            //       text: { color: "white", fontWeight: "bold" },
            //     },
            //   },
            // }}
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
              "stylesheet.calendar.header": {
                week: {
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              },
            }}
          />

          <View style={styles.footer}>
            <TouchableOpacity>
              <Text style={styles.resetButton}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default CalendarModalBetween;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerTitle: { color: "#111827", fontSize: 22, fontWeight: "bold" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  resetButton: { color: "#111827", fontSize: 20, fontWeight: "bold" },
  saveButton: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 8,
  },
  saveButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
