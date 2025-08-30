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
const CalendarModal = ({ isVisible, onClose, onSave, mode = "start" }) => {
  const [selectedDate, setSelectedDate] = React.useState(null);

  const handleSave = () => {
    onSave(selectedDate);
    onClose();
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
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markingType={"custom"}
            markedDates={{
              [selectedDate]: {
                customStyles: {
                  container: { backgroundColor: "#111827", borderRadius: 16 },
                  text: { color: "white", fontWeight: "bold" },
                },
              },
            }}
            theme={{
              backgroundColor: "white",
              calendarBackground: "white",
              textDayFontSize: 16,
              textMonthFontSize: 20,
              textDayHeaderFontSize: 14,
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "bold",
              textSectionTitleColor: "#111827",
              dayHeaderTextColor: "#111827",
              dayTextColor: "#111827",
              todayTextColor: "#111827",
              textDisabledColor: "#d1d5db",
              selectedDayTextColor: "white",
              monthTextColor: "#111827",
              arrowColor: "#111827",
              arrowStyle: { padding: 8 },
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
export default CalendarModal;

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
