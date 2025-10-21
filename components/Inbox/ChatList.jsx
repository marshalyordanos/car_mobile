// components/inbox/ChatList.jsx
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar, Badge, useTheme } from './ThemeProvider';

console.log('ChatList loaded'); // DEBUG

const mockChats = [
  {
    id: '1',
    carName: 'Tesla Model 3',
    carModel: '2024',
    renterName: 'Premium Auto Rentals',
    lastMessage: 'Your vehicle is ready for pickup at Location A.',
    timestamp: '2m ago',
    unread: 2,
  },
  {
    id: '2',
    carName: 'BMW X5',
    carModel: '2023',
    renterName: 'Elite Car Hire',
    lastMessage: 'Thank you for choosing our service!',
    timestamp: '1h ago',
    unread: 0,
  },
  {
    id: '3',
    carName: 'Mercedes C-Class',
    carModel: '2024',
    renterName: 'Luxury Drives',
    lastMessage: 'Please confirm your return date.',
    timestamp: '3h ago',
    unread: 1,
  },
  {
    id: '4',
    carName: 'Audi A4',
    carModel: '2023',
    renterName: 'City Car Rentals',
    lastMessage: 'We hope you enjoyed your ride!',
    timestamp: 'Yesterday',
    unread: 0,
  },
];

export default function ChatList({ onChatSelect }) {
  const { theme } = useTheme();

  console.log('mockChats length:', mockChats.length); // DEBUG

  if (mockChats.length === 0) {
    return (
      <View style={styles.empty}>
        <Icon name="message-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No chats yet</Text>
        <Text style={styles.emptySub}>Chats will appear here when you book a car</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={mockChats}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onChatSelect(item)}
          style={[styles.chatItem, { borderBottomColor: theme.border }]}
        >
          <Avatar name={item.renterName} />
          <View style={styles.chatContent}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle} numberOfLines={1}>
                {item.carName} {item.carModel}
              </Text>
              <View style={styles.chatRight}>
                <Text style={styles.chatTime}>{item.timestamp}</Text>
                {item.unread > 0 && <Badge value={item.unread} />}
              </View>
            </View>
            <Text style={styles.chatRenter} numberOfLines={1}>
              {item.renterName}
            </Text>
            <Text style={styles.chatMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { marginTop: 16, fontSize: 16, color: '#999' },
  emptySub: { marginTop: 4, fontSize: 14, color: '#aaa', textAlign: 'center' },
  chatItem: { flexDirection: 'row', padding: 16, borderBottomWidth: 1 },
  chatContent: { flex: 1, marginLeft: 12 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  chatTitle: { fontWeight: '600', fontSize: 15, flex: 1 },
  chatRight: { flexDirection: 'row', alignItems: 'center' },
  chatTime: { fontSize: 12, color: '#999', marginRight: 6 },
  chatRenter: { fontSize: 13, color: '#666', marginBottom: 2 },
  chatMessage: { fontSize: 13, color: '#777' },
});