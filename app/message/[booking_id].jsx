// components/inbox/ChatView.jsx
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "../../components/Inbox/ThemeProvider";
import { selectTheme } from "../../redux/themeSlice";
import api from "../../redux/api";
import { isoToTime } from "../../utils/date";
import { selectCurrentUser } from "../../redux/authReducer";
import { reOrderChatList } from "../../redux/chatSlice";
import SocketService from "../../socket";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Feather } from "lucide-react-native";

// ————————————————————————————————————————————
// 1. FULL MOCK MESSAGES (copy-paste this)
// ————————————————————————————————————————————
const mockMessages = {
  1: [
    {
      id: "m1",
      text: "Hello! Thank you for booking with us.",
      timestamp: "10:30 AM",
      isOutgoing: false,
    },
    {
      id: "m2",
      text: "Hi! When can I pick up the car?",
      timestamp: "10:32 AM",
      isOutgoing: true,
    },
    {
      id: "m3",
      text: "Your Tesla Model 3 will be ready tomorrow at 9:00 AM.",
      timestamp: "10:33 AM",
      isOutgoing: false,
    },
    {
      id: "m4",
      text: "Perfect! What documents do I need?",
      timestamp: "10:35 AM",
      isOutgoing: true,
    },
    {
      id: "m5",
      text: "Please bring your driver's license and booking confirmation.",
      timestamp: "10:36 AM",
      isOutgoing: false,
    },
    {
      id: "m6",
      text: "Your vehicle is ready for pickup at Location A.",
      timestamp: "10:45 AM",
      isOutgoing: false,
    },
  ],
  2: [
    {
      id: "m7",
      text: "Hi, is the BMW X5 available?",
      timestamp: "11:00 AM",
      isOutgoing: true,
    },
    {
      id: "m8",
      text: "Yes, it’s ready for immediate pickup.",
      timestamp: "11:02 AM",
      isOutgoing: false,
    },
  ],
  3: [
    {
      id: "m9",
      text: "Can I extend my rental?",
      timestamp: "02:15 PM",
      isOutgoing: true,
    },
    {
      id: "m10",
      text: "Sure, let me check availability.",
      timestamp: "02:16 PM",
      isOutgoing: false,
    },
  ],
  4: [
    {
      id: "m11",
      text: "Thank you! Great service.",
      timestamp: "Yesterday",
      isOutgoing: true,
    },
  ],
};

export default function ChatView({ onBack }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const theme = useSelector(selectTheme);
  const {
    booking_id: chat,
    profilePhoto,
    id,
    name,
    receiverId,
  } = useLocalSearchParams();
  const [messages, setMessages] = useState(mockMessages[chat] ?? []);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const userData = useSelector(selectCurrentUser);

  const [chats, setChats] = useState([]);
  const [chatLoading, setChatLoading] = useState();
  const [chatLoading2, setChatLoading2] = useState();
  const dispatch = useDispatch();
  const { connected } = useSelector((state) => state.socket);

  const fetchChats = async () => {
    setChatLoading(true);
    setChatLoading2(true);

    console.log("======= one  =============", chat);
    try {
      const res = await api.get(
        "messages/booking/" + chat + "?page=1&pageSize=1000"
      );
      console.log("chatsssss:", res.data);
      setChats(res.data.data);
      setChatLoading(false);
      setChatLoading2(false);
    } catch (err) {
      setChatLoading(false);
      console.log("fetchChatList err:", err);
      setChatLoading2(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      console.log("abebe");
      fetchChats();
    }, [])
  );

  const markasRead = async () => {
    try {
      const res = await api.post("/messages/mark-as-read", {
        bookingId: chat,
        userId: userData?.user?.id,
      });
    } catch (err) {
      console.log("markasRead err:", err);
    }
  };
  useFocusEffect(
    useCallback(() => {
      markasRead();
    }, [])
  );
  const scrollToBottom = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    // Scroll on first load
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ——— Send message ———
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      content: input.trim(),
      createdAt: new Date().toISOString(),
      senderId: userData?.user?.id,
    };

    const payload = {
      bookingId: chat,
      senderId: userData?.user?.id,
      receiverId: receiverId,
      content: input.trim(),
    };

    setChats((prev) => [...prev, newMsg]);
    setInput("");

    try {
      const chatPreview = {
        bookingId: chat,
        lastMessage: {
          id: `${new Date()}`,
          content: input.trim(),
          createdAt: new Date().toISOString(),
        },
        withUser: {
          id: id,
          fullName: name,
          profilePhoto: profilePhoto,
        },
        unreadCount: 0, // client can recalc if necessary
      };
      dispatch(reOrderChatList(chatPreview));

      const res = await api.post("messages", payload);
      console.log("sen chat::", res.data);
      // setChats(res.data.data);
      // setChatLoading(false);
    } catch (err) {
      setChatLoading(false);
      console.log("fetchChatList err:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!connected) return;

      SocketService.joinBooking(chat);

      SocketService.on("new_message", (msg) => {
        console.log(
          "====================11111111111111111111111111111111111111111111111111:",
          JSON.stringify(msg, null, 2)
        );
        if (msg.bookingId === chat) {
          setChats((prev) => [...prev, msg]);
        }
      });

      return () => {
        console.log("marshalllllllllllllllllll");
        SocketService.off("new_message");
        // SocketService.off("update_chat_list");
      };
    }, [connected])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,

          flex: 1,
          backgroundColor: "white",
        }}
      >
        {/* Header */}

        <Header
          // title={name}
          onBack={() => {
            router.back();
          }}
        >
          {chatLoading ? (
            <>
              <ActivityIndicator size={"small"} />
              <Text>Updating ...</Text>
            </>
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 17 }}>{name}</Text>
            </View>
          )}
        </Header>

        {/* Messages */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={[
              styles.messages,
              { backgroundColor: theme.muted },
            ]}
            onContentSizeChange={scrollToBottom} // ← BEST auto-scroll
          >
            {chats.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  msg.senderId == userData?.user?.id
                    ? styles.right
                    : styles.left,
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    msg.senderId == userData?.user?.id
                      ? styles.outgoing
                      : styles.incoming,
                    {
                      backgroundColor:
                        msg.senderId == userData?.user?.id
                          ? theme.messageOut
                          : theme.messageIn,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        msg.senderId == userData?.user?.id
                          ? theme.messageOutText
                          : theme.messageInText,
                      fontSize: 15,
                    }}
                  >
                    {msg.content}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        marginTop: 4,
                        color:
                          msg.senderId == userData?.user?.id ? "#ccc" : "#999",
                        textAlign:
                          msg.senderId == userData?.user?.id ? "right" : "left",
                      }}
                    >
                      {isoToTime(msg.createdAt)}
                    </Text>
                    <Ionicons
                      name="sync"
                      size={15}
                      color={
                        msg.senderId == userData?.user?.id ? "white" : "black"
                      }
                    />
                    <AntDesign name="check" size={14} color="black" />{" "}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Input Bar */}
          <View
            style={[
              styles.inputBar,
              { borderTopColor: theme.border, backgroundColor: theme.card },
            ]}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              style={[
                styles.input,
                { backgroundColor: theme.inputBg, color: theme.foreground },
              ]}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={sendMessage} disabled={!input.trim()}>
              <Icon
                name="send"
                size={24}
                color={input.trim() ? theme.primary : "#aaa"}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

// ————————————————————————————————————————————
// 3. STYLES
// ————————————————————————————————————————————
const styles = StyleSheet.create({
  container: { flex: 1 },
  messages: { padding: 16, paddingBottom: 20, flexGrow: 1 },
  messageWrapper: { marginVertical: 6, paddingHorizontal: 12 },
  left: { alignItems: "flex-start" },
  right: { alignItems: "flex-end" },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  incoming: { borderBottomLeftRadius: 4 },
  outgoing: { borderBottomRightRadius: 4 },
  inputBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 16,
  },
});
