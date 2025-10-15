import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CalendarModalBetween from "./CalendarModalBetween";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = 120;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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
const MonthsView = ({
  selectedMonths,
  onMonthChange,
  monthOptions,
  onReset,
  onSearch,
}) => {
  const insets = useSafeAreaInsets();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [isCalendarModalVisible, setCalendarModalVisible] = useState(false);
  const [calendarMode, setCalendarMode] = useState("start");
  const [activeIndex, setActiveIndex] = useState(0);

  const openCalendarModal = (mode) => {
    setCalendarMode(mode);
    setCalendarModalVisible(true);
  };

  const handleDateSave = (date) => {
    console.log(`Saved ${calendarMode} date:`, date);
  };

  // Scroll to selected month when selectedMonths changes
  useEffect(() => {
    const index = monthOptions.findIndex((m) => m === selectedMonths);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
      });
      setActiveIndex(index);
    }
  }, [selectedMonths, monthOptions]);

  // Track active index during scroll
  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const index = Math.round(value / ITEM_WIDTH);
      setActiveIndex(index);
    });
    return () => scrollX.removeListener(listener);
  }, []);

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
      outputRange: [40, 20, 0, 20, 40],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 0.6, 1, 0.6, 0.3],
      extrapolate: "clamp",
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 0.9, 1.2, 0.9, 0.8],
      extrapolate: "clamp",
    });

    const isActive = index === activeIndex;

    return (
      <Animated.View
        style={[
          styles.monthItemContainer,
          {
            transform: [{ translateY }, { scale }],
            opacity,
          },
        ]}
      >
        <Text
          style={[styles.monthNumber, isActive && styles.activeMonthNumber]}
        >
          {item}
        </Text>
      </Animated.View>
    );
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Update dates whenever selectedMonths changes
  useEffect(() => {
    const start = new Date();
    const end = new Date(start);

    const targetMonth = start.getMonth() + selectedMonths;
    const targetYear = start.getFullYear() + Math.floor(targetMonth / 12);
    const month = targetMonth % 12;

    const lastDay = new Date(targetYear, month + 1, 0).getDate();
    const day = Math.min(start.getDate(), lastDay);
    end.setFullYear(targetYear, month, day);

    const formatDate = (date) => date.toISOString().slice(0, 10);

    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  }, [selectedMonths]);
  // Correctly calculate end date handling month ends
  // const { startDate, endDate } = useMemo(() => {
  //   const start = new Date();
  //   const end = new Date(start);

  //   // Add months manually to handle end-of-month correctly
  //   const targetMonth = start.getMonth() + selectedMonths;
  //   const targetYear = start.getFullYear() + Math.floor(targetMonth / 12);
  //   const month = targetMonth % 12;

  //   // Get last day of the target month
  //   const lastDay = new Date(targetYear, month + 1, 0).getDate();
  //   const day = Math.min(start.getDate(), lastDay);

  //   end.setFullYear(targetYear, month, day);

  //   // Format as YYYY-MM-DD
  //   const formatDate = (date) => date.toISOString().slice(0, 10);

  //   return {
  //     startDate: formatDate(start),
  //     endDate: formatDate(end),
  //   };
  // }, [selectedMonths]);

  return (
    <>
      <View
        style={[
          styles.container,
          { height: SCREEN_HEIGHT - insets.bottom - insets.top },
        ]}
      >
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
              getItemLayout={(data, index) => ({
                length: ITEM_WIDTH,
                offset: ITEM_WIDTH * index,
                index,
              })}
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
                paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2,
              }}
            />

            <Text style={styles.monthsLabel}>
              {selectedMonths === 1 ? "month" : "months"}
            </Text>
          </View>

          <View style={styles.dateRangeContainer}>
            <TouchableOpacity onPress={() => openCalendarModal("start")}>
              <Text style={styles.dateLink}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
            <Text style={styles.dateRangeText}> to </Text>
            <TouchableOpacity onPress={() => openCalendarModal("end")}>
              <Text style={styles.dateLink}>{formatDate(endDate)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onReset}>
            <Text style={styles.resetButton}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
            <Text style={styles.searchButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CalendarModalBetween
        isVisible={isCalendarModalVisible}
        onClose={() => setCalendarModalVisible(false)}
        onSave={handleDateSave}
        mode={calendarMode}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      {/* <CalendarModal
        isVisible={isCalendarModalVisible}
        onClose={() => setCalendarModalVisible(false)}
        onSave={handleDateSave}
        mode={calendarMode}
      /> */}
    </>
  );
};

export default MonthsView;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: {
    fontSize: 18,
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
  monthNumber: { fontSize: 70, fontWeight: "bold", color: "#d1d5db" },
  activeMonthNumber: { color: "#111827", fontSize: 90 },
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
    marginTop: 30,
  },
  dateRangeText: { fontSize: 16, color: "#6b7280", marginHorizontal: 8 },
  dateLink: {
    color: "#000000",
    textDecorationLine: "underline",
    fontSize: 15,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  resetButton: { fontSize: 15, fontWeight: "bold", color: "#111827" },
  searchButton: {
    backgroundColor: "#111827",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  searchButtonText: { color: "white", fontSize: 15, fontWeight: "bold" },
});
