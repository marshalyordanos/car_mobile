// app/tab/InboxTab.jsx
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ChatList from '../../components/Inbox/ChatList';
import ChatView from '../../components/Inbox/ChatView';
import NotificationList from '../../components/Inbox/Notification';
import { Header, useTheme } from '../../components/Inbox/ThemeProvider';

export default function InboxTab() {
  const [view, setView] = useState('chats'); // 'chats' | 'notifications'
  const [selectedChat, setSelectedChat] = useState(null);
  const { theme } = useTheme();

  if (selectedChat) {
    return <ChatView chat={selectedChat} onBack={() => setSelectedChat(null)} />;
  }

  // ---------- MAIN INBOX ----------
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header
        title={view === 'chats' ? 'Inbox' : 'Notifications'}
        onBack={view === 'notifications' ? () => setView('chats') : undefined}
        showToggle={true}
      >
        {/* <-- Header children are ignored by our Header component.
             We replace the default right-slot with a custom toggle button. */}
      </Header>

      {/* ----- Custom toggle button (outside Header) ----- */}
      <View style={styles.toggleBar}>
        <TouchableOpacity
          onPress={() => setView(view === 'chats' ? 'notifications' : 'chats')}
          style={styles.toggleBtn}
        >
          <Icon
            name={view === 'chats' ? 'bell-outline' : 'message-outline'}
            size={24}
            color={theme.foreground}
          />
        </TouchableOpacity>
      </View>

      {view === 'chats' ? (
        <ChatList onChatSelect={setSelectedChat} />
      ) : (
        <NotificationList />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  toggleBar: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  toggleBtn: { padding: 8 },
});