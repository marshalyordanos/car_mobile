import { Ionicons as Icon } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CalendarModal from "./CalendarModal";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const ITEM_WIDTH = 120;

const MonthsView = ({
  selectedMonths,
  onMonthChange,
  monthOptions,
  onReset,
  onSearch,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const { width: screenWidth } = Dimensions.get("window");

  const [isCalendarModalVisible, setCalendarModalVisible] = useState(false);
  const [calendarMode, setCalendarMode] = useState("start");

  const openCalendarModal = (mode) => {
    setCalendarMode(mode);
    setCalendarModalVisible(true);
  };

  const handleDateSave = (date) => {
    console.log(`Saved ${calendarMode} date:`, date);
  };

  useEffect(() => {
    const initialIndex = monthOptions.findIndex((m) => m === selectedMonths);
    if (initialIndex !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 100);
    }
  }, [monthOptions, selectedMonths]);

  const renderMonthItem = ({ item, index }) => {
    const inputRange = [
      (index - 2) * ITEM_WIDTH,
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
      (index + 2) * ITEM_WIDTH,
    ];

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 20, 0, 20, 50],
      extrapolate: "clamp",
    });
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.35, 0.7, 1, 0.7, 0.35],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.monthItemContainer,
          { transform: [{ translateY }], opacity },
        ]}
      >
        <Text
          style={[
            styles.monthNumber,
            item === selectedMonths && styles.activeMonthNumber,
          ]}
        >
          {item}
        </Text>
      </Animated.View>
    );
  };
  const { startDate, endDate } = useMemo(() => {
    const start = new Date();
    const end = new Date(start);
    end.setMonth(start.getMonth() + selectedMonths);
    const options = { month: "short", day: "numeric" };
    return {
      startDate: start.toLocaleDateString("en-US", options),
      endDate: end.toLocaleDateString("en-US", options),
    };
  }, [selectedMonths]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>I want a car for</Text>
          <View style={styles.scrollerContainer}>
            <AnimatedFlatList
              ref={flatListRef}
              horizontal
              data={monthOptions}
              keyExtractor={(item) => item.toString()}
              renderItem={renderMonthItem}
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH}
              decelerationRate="fast"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
              onMomentumScrollEnd={(event) => {
                const scrollPosition = event.nativeEvent.contentOffset.x;
                const index = Math.round(scrollPosition / ITEM_WIDTH);
                if (monthOptions[index] !== undefined) {
                  onMonthChange(monthOptions[index]);
                }
              }}
              contentContainerStyle={{
                paddingHorizontal: (screenWidth - ITEM_WIDTH) / 2,
              }}
            />
            <Text style={styles.monthsLabel}>
              {selectedMonths === 1 ? "month" : "months"}
            </Text>
          </View>

          <View style={styles.dateRangeContainer}>
            <TouchableOpacity onPress={() => openCalendarModal("start")}>
              <Text style={styles.dateLink}>{startDate}</Text>
            </TouchableOpacity>
            <Text style={styles.dateRangeText}> to </Text>
            <TouchableOpacity onPress={() => openCalendarModal("end")}>
              <Text style={styles.dateLink}>{endDate}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.checkboxContainer}>
            <Icon name="checkbox-outline" size={24} color="#6b7280" />
            <Text style={styles.checkboxLabel}>
              Show cars with similar dates
            </Text>
            <Icon name="information-circle-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={onReset}>
            <Text style={styles.resetButton}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CalendarModal
        isVisible={isCalendarModalVisible}
        onClose={() => setCalendarModalVisible(false)}
        onSave={handleDateSave}
        mode={calendarMode}
      />
    </>
  );
};

export default MonthsView;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 30,
  },
  scrollerContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  monthItemContainer: { width: ITEM_WIDTH, alignItems: "center" },
  monthNumber: { fontSize: 80, fontWeight: "bold", color: "#d1d5db" },
  activeMonthNumber: {
    color: "#111827",
  },
  monthsLabel: {
    position: "absolute",
    bottom: 0,
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  dateRangeText: {
    fontSize: 16,
    color: "#6b7280",
    marginHorizontal: 8,
  },
  dateLink: { color: "#393381", textDecorationLine: "underline", fontSize: 16 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkboxLabel: { fontSize: 14, color: "#111827" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  resetButton: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  searchButton: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  searchButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
