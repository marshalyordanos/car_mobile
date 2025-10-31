// app/tab/InboxTab.jsx
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Header, Avatar, Badge } from "../../components/Inbox/ThemeProvider";
import { selectTheme } from "../../redux/themeSlice";
import { TouchableOpacity } from "react-native";
import { selectCurrentUser } from "../../redux/authReducer";
import {
  appendChatList,
  reOrderChatList,
  selectChatList,
  setChatList,
} from "../../redux/chatSlice";

import api from "../../redux/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SocketService from "../../socket";

export default function InboxTab() {
  const [view, setView] = useState("chats"); // 'chats' | 'notifications'
  const theme = useSelector(selectTheme);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const userData = useSelector(selectCurrentUser);

  const chatList = useSelector(selectChatList);
  const [chatListLoading, setChatListLoading] = useState(false);
  const [chatListLoading2, setChatListLoading2] = useState(false);

  const { connected } = useSelector((state) => state.socket);
  const [messages, setMessages] = useState([]);

  const dispatch = useDispatch();

  const fetchChatList = async () => {
    setChatListLoading(true);
    setChatListLoading2(true);

    console.log("======= one  =============");
    try {
      const res = await api.get("messages/chats/user/" + userData?.user?.id);
      // console.log("fetchChatList:", res.data);
      dispatch(setChatList(res.data.data));
      setChatListLoading(false);
      setChatListLoading2(false);
    } catch (err) {
      setChatListLoading(false);
      setChatListLoading2(false);

      console.log("fetchChatList err:", err);
    }
  };
  useFocusEffect(
    useCallback(() => {
      console.log("abebe");
      fetchChatList();
    }, [])
  );
  const onRefresh = () => {
    fetchChatList();
  };
  // ---------- MAIN INBOX ----------
  useFocusEffect(
    useCallback(() => {
      if (!connected) return;

      // SocketService.joinBooking(bookingId);

      // SocketService.on("new_message", (msg) => {
      //   console.log(
      //     "====================11111111111111111111111111111111111111111111111111:",
      //     JSON.stringify(msg, null, 2)
      //   );
      //   if (msg.bookingId === bookingId) {
      //     setMessages((prev) => [...prev, msg]);
      //   }
      // });

      SocketService.on("update_chat_list", (preview) => {
        {
          console.log(
            "====================11111111111111111111111111111111111111111111111111:",
            JSON.stringify(preview, null, 2)
          );
          dispatch(reOrderChatList(preview));
          console.log("🕓 Chat list updated:", typeof preview);
          let x;
        }
      });

      return () => {
        console.log("marshalllllllllllllllllll");
        // SocketService.off("new_message");
        SocketService.off("update_chat_list");
      };
    }, [connected])
  );

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
        <Header
          title={view === "chats" ? "Inbox" : "Notifications"}
          onBack={view === "notifications" ? () => setView("chats") : undefined}
          showToggle={true}
          onNotification={() => {
            router.push({
              pathname: `/message/notification`,
            });
          }}
        >
          {chatListLoading ? (
            <>
              <ActivityIndicator size={"small"} />
              <Text>Updating ...</Text>
            </>
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="car-connected"
                size={20}
                color="black"
              />
              <Text>Connected</Text>
            </View>
          )}
        </Header>
        <View style={styles.toggleBar}></View>
        <FlatList
          data={chatList}
          keyExtractor={(item, i) => item.bookingId + i.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: `/message/${item.bookingId}`,
                  params: {
                    name: item?.withUser?.fullName,
                    id: item?.withUser?.id,
                    profilePhoto: item?.withUser?.profilePhoto,

                    receiverId: item?.withUser?.id,
                  },
                });
              }}
              style={[styles.chatItem, { borderBottomColor: theme.border }]}
            >
              <Avatar name={item?.withUser?.fullName} />
              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatTitle} numberOfLines={1}>
                    {/* {item.carName} {item.carModel} */}
                    {item?.withUser?.fullName}
                  </Text>
                  <View style={styles.chatRight}>
                    <Text style={styles.chatTime}>{item.timestamp}</Text>
                    {item?.unreadCount > 0 && (
                      <Badge value={item.unreadCount} />
                    )}
                  </View>
                </View>
                <Text style={styles.chatRenter} numberOfLines={1}>
                  {item?.withUser?.fullName}
                </Text>
                <Text style={styles.chatMessage} numberOfLines={1}>
                  {item.lastMessage?.content}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          // refreshControl={
          //   <RefreshControl
          //     colors={["transparent"]} // hide android spinner
          //     tintColor="transparent" // hide iOS spinner

          //     refreshing={chatListLoading2}
          //     onRefresh={onRefresh}
          //   />
          // }
          // onRefresh={}
        />
        {/* //  : <NotificationList />} */}
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
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: { marginTop: 16, fontSize: 16, color: "#999" },
  emptySub: { marginTop: 4, fontSize: 14, color: "#aaa", textAlign: "center" },
  chatItem: { flexDirection: "row", padding: 16, borderBottomWidth: 1 },
  chatContent: { flex: 1, marginLeft: 12 },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  chatTitle: { fontWeight: "600", fontSize: 15, flex: 1 },
  chatRight: { flexDirection: "row", alignItems: "center" },
  chatTime: { fontSize: 12, color: "#999", marginRight: 6 },
  chatRenter: { fontSize: 13, color: "#666", marginBottom: 2 },
  chatMessage: { fontSize: 13, color: "#777" },
});
