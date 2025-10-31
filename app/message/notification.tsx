// app/tab/InboxTab.jsx
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

import api from "@/redux/api.js";
import { selectCurrentUser } from "@/redux/authReducer.js";
import { selectNotifications, setNotification, setNotificationCount } from "@/redux/chatSlice.js";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import NotificationList from "../../components/Inbox/Notification.jsx";
import { selectTheme } from "../../redux/themeSlice";

export default function InboxTab() {
  const [view, setView] = useState("chats"); // 'chats' | 'notifications'
  const theme = useSelector(selectTheme);
  const insets = useSafeAreaInsets();

  const [notificationLoading, setNotificationLoading] = useState(false);
  const userData = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);


  const fetchNotification = async () => {
    setNotificationLoading(true);

    console.log("======= one  =============");
    try {
      const res = await api.get("messages/notifications/" + userData?.user?.id);
      console.log("resssssssssss.",res.data)
      dispatch(setNotification(res.data.data));
      setNotificationLoading(false);
    } catch (err) {
      setNotificationLoading(false);
      (false);

      console.log("fetchChatList err:", err);
    }
  };
  useFocusEffect(
    useCallback(() => {
      console.log("abebe");
      fetchNotification();
    }, [])
  );

  const markasRead = async () => {
    try {
      dispatch(setNotificationCount(0))
      const res = await api.post("messages/notifications/mark-as-read/"+userData?.user?.id,{});
      
    } catch (err) {
      console.log("markasRead err:", err);
    }
  };
  useFocusEffect(
    useCallback(() => {
      markasRead();
    }, [])
  );
  // ---------- MAIN INBOX ----------
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        // borderWidth: 1,
      }}
    >
      <View
        style={{
          //   paddingTop: insets.top,
          flex: 1,
          backgroundColor: "white",
        }}
      >
      <NotificationList  data={notifications||[]}/>
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
