// components/inbox/NotificationList.jsx
import { selectTheme } from "@/redux/themeSlice";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { isoToDisplay } from "../../utils/date.js";
// ————————————————————————————————————————————
// 1. FULL MOCK NOTIFICATIONS
// ————————————————————————————————————————————

// ————————————————————————————————————————————
// 2. ICON MAPPING
// ————————————————————————————————————————————
const getIcon = (type) => {
  const map = {
    BOOKING: "check-circle",
    DISPUTE: "clock-outline",
    SYSTEM: "information-outline",
    PAYMENT: "alert-circle",
  };
  return map[type] ?? "bell";
};

// ————————————————————————————————————————————
// 3. MAIN COMPONENT
// ————————————————————————————————————————————
export default function NotificationList({ data }) {
  const theme = useSelector(selectTheme);

  // ——— Empty State ———
  if (data?.length === 0) {
    return (
      <View style={styles.empty}>
        <Icon name="bell-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No notifications yet</Text>
      </View>
    );
  }

  // ——— List ———
  return (
    <FlatList
      style={
        {
          // borderWidth: 2,
        }
      }
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.item,
            !item.isRead && styles.unread,
            { borderBottomColor: theme.border },
          ]}
        >
          {/* ——— ICON ——— */}
          <View
            style={[
              styles.icon,
              {
                backgroundColor: item.isRead ? theme.muted : theme.unreadBg,
              },
            ]}
          >
            <Icon
              name={getIcon(item.type)}
              size={20}
              color={item.isRead ? theme.iconRead : theme.iconUnread}
            />
          </View>

          {/* ——— CONTENT ——— */}
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.foreground }]}>
                {item.title}
              </Text>
              <Text style={styles.time}>{isoToDisplay(item?.createdAt)}</Text>
            </View>
            <Text style={[styles.message, { color: theme.mutedForeground }]}>
              {item.message}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

// ————————————————————————————————————————————
// 4. STYLES (cleaned & merged)
// ————————————————————————————————————————————
const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
  },
  item: {
    flexDirection: "row",
    padding: 16,

    borderBottomWidth: 1,
  },
  unread: {
    backgroundColor: "#f9f9f9",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    color: "#666",
  },
});
