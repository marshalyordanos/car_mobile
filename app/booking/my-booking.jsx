import { useRouter } from "expo-router"; // 🆕 ADD THIS
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BookingHistory from "../../components/Booking/BookingHistory";
import BookingList from "../../components/Booking/BookingList";

const MyBooking = () => {
  const [activeTab, setActiveTab] = useState("active");
  const router = useRouter();

  const handleOpenChat = (booking) => {
    console.log("Open chat:", booking);
  };

  const handleBookingPress = (booking) => {
    router.push({
      pathname: "/BookingDetail",
      params: {
        booking: JSON.stringify(booking),
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          backgroundColor: "#FFF",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: "row" }}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          <TouchableOpacity
            style={[
              {
                flex: 0,
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderBottomWidth: 3,
                borderBottomColor:
                  activeTab === "active" ? "#000" : "transparent",
                marginRight: 16,
              },
            ]}
            onPress={() => setActiveTab("active")}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: activeTab === "active" ? "700" : "500",
                color: activeTab === "active" ? "#000" : "#6B7280",
              }}
            >
              Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              {
                flex: 0,
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderBottomWidth: 3,
                borderBottomColor:
                  activeTab === "history" ? "#000" : "transparent",
              },
            ]}
            onPress={() => setActiveTab("history")}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: activeTab === "history" ? "700" : "500",
                color: activeTab === "history" ? "#000" : "#6B7280",
              }}
            >
              History
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={{ flex: 1 }}>
        {activeTab === "active" ? (
          <BookingList
            onOpenChat={handleOpenChat}
            onBookingPress={handleBookingPress}
          />
        ) : (
          <BookingHistory
            handleBookingPress={handleBookingPress}
            onOpenChat={handleOpenChat}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyBooking;
