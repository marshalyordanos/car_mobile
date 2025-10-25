// app/tab/InboxTab.jsx
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import NotificationList from "../../components/Inbox/Notification.jsx";
import { selectTheme } from "../../redux/themeSlice";

export default function InboxTab() {
  const [view, setView] = useState("chats"); // 'chats' | 'notifications'
  const theme = useSelector(selectTheme);
  const insets = useSafeAreaInsets();

  // ---------- MAIN INBOX ----------
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          paddingTop: insets.top,
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <NotificationList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleBar: {
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  toggleBtn: { padding: 8 },
  // lottie: {
  //   width: 50,
  //   height: 50,
  //   borderWidth: 1,
  // },
});
