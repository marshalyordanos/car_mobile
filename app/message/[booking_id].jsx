// components/inbox/ChatView.jsx
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
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
import { useSelector } from "react-redux";
import { Header } from "../../components/Inbox/ThemeProvider";
import { selectTheme } from "../../redux/themeSlice";

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

// ————————————————————————————————————————————
// 2. MAIN COMPONENT
// ————————————————————————————————————————————
export default function ChatView({ onBack }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const theme = useSelector(selectTheme);
  const { booking_id: chat } = useLocalSearchParams();
  const [messages, setMessages] = useState(mockMessages[chat] ?? []);
  const insets = useSafeAreaInsets();

  // ——— Auto-scroll to bottom (on load + new message) ———
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
  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOutgoing: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  // ——— Safety: if no chat ———
  if (!chat) {
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
          {" "}
          <Text>No chat selected</Text>
        </View>
      </View>
    );
  }

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
        <Header title={`${chat} ${chat}`} onBack={onBack} />

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
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  msg.isOutgoing ? styles.right : styles.left,
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    msg.isOutgoing ? styles.outgoing : styles.incoming,
                    {
                      backgroundColor: msg.isOutgoing
                        ? theme.messageOut
                        : theme.messageIn,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: msg.isOutgoing
                        ? theme.messageOutText
                        : theme.messageInText,
                      fontSize: 15,
                    }}
                  >
                    {msg.text}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      marginTop: 4,
                      color: msg.isOutgoing ? "#ccc" : "#999",
                      textAlign: msg.isOutgoing ? "right" : "left",
                    }}
                  >
                    {msg.timestamp}
                  </Text>
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
