// app/tab/InboxTab.jsx
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import ChatList from "../../components/Inbox/ChatList";
import { Header } from "../../components/Inbox/ThemeProvider";
import { selectTheme } from "../../redux/themeSlice";

export default function InboxTab() {
<<<<<<< HEAD
  const [view, setView] = useState('chats'); 
  const [selectedChat, setSelectedChat] = useState(null);
  const { theme } = useTheme();

  if (selectedChat) {
    return <ChatView chat={selectedChat} onBack={() => setSelectedChat(null)} />;
  }
=======
  const [view, setView] = useState("chats"); // 'chats' | 'notifications'
  const theme = useSelector(selectTheme);
  const insets = useSafeAreaInsets();
  const router = useRouter();
>>>>>>> 0319186640acea037cf0e5054a5cb766d140ba76

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
<<<<<<< HEAD
       
      </Header>

      <View style={styles.toggleBar}>
        <TouchableOpacity
          onPress={() => setView(view === 'chats' ? 'notifications' : 'chats')}
          style={styles.toggleBtn}
=======
        <Header
          title={view === "chats" ? "Inbox" : "Notifications"}
          onBack={view === "notifications" ? () => setView("chats") : undefined}
          showToggle={true}
          onNotification={() => {
            router.push({
              pathname: `/message/notification`,
            });
          }}
>>>>>>> 0319186640acea037cf0e5054a5cb766d140ba76
        >
          <>
            <ActivityIndicator size={"small"} />
            <Text>Updating ...</Text>
          </>
        </Header>
        {/* ----- Custom toggle button (outside Header) ----- */}
        <View style={styles.toggleBar}>
          {/* <TouchableOpacity
            onPress={() =>
              setView(view === "chats" ? "notifications" : "chats")
            }
            style={styles.toggleBtn}
          >
            <Icon
              name={view === "chats" ? "bell-outline" : "message-outline"}
              size={24}
              color={theme.foreground}
            />
          </TouchableOpacity> */}
        </View>
        {/* {view === "chats" ?  */}
        <ChatList />
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
});
