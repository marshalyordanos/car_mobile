import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { selectMode, selectTheme, toggleTheme } from "../../redux/themeSlice";

/* ────────────────────── AVATAR ────────────────────── */
export const Avatar = ({ name, size = 48 }) => {
  const theme = useSelector(selectTheme);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.primary,
          borderColor: theme.border,
        },
      ]}
    >
      <Text style={[styles.avatarText, { color: "#fff" }]}>
        {name?.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
};

/* ────────────────────── BADGE ────────────────────── */
export const Badge = ({ value }) => {
  const theme = useSelector(selectTheme);

  return (
    <View style={[styles.badge, { backgroundColor: theme.unreadBg }]}>
      <Text style={[styles.badgeText, { color: theme.unreadText }]}>
        {value}
      </Text>
    </View>
  );
};

/* ────────────────────── THEME TOGGLE ────────────────────── */
export const ThemeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector(selectMode);

  return (
    <TouchableOpacity
      onPress={() => dispatch(toggleTheme())}
      style={styles.toggleBtn}
    >
      <Icon
        name={mode === "dark" ? "weather-sunny" : "weather-night"}
        size={24}
        color={mode === "dark" ? "#e6edf3" : "#000000"}
      />
    </TouchableOpacity>
  );
};

/* ────────────────────── HEADER ────────────────────── */
export const Header = ({
  title,
  onBack,
  showToggle = true,
  children,
  onNotification,
}) => {
  const theme = useSelector(selectTheme);

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.headerBg,
          borderBottomColor: theme.border,
        },
      ]}
    >
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={theme.foreground} />
        </TouchableOpacity>
      )}
      {title && (
        <Text style={[styles.headerTitle, { color: theme.foreground }]}>
          {title}
        </Text>
      )}
      {children && <View style={styles.headerChildren}>{children}</View>}

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={onNotification} style={styles.toggleBtn}>
          <Icon name={"bell-outline"} size={24} color={theme.foreground} />
        </TouchableOpacity>

        {/* {showToggle && <ThemeToggle />} */}
      </View>
    </View>
  );
};

/* ────────────────────── STYLES ────────────────────── */
const styles = StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  avatarText: {
    fontWeight: "600",
    fontSize: 18,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  toggleBtn: {
    padding: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  backBtn: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    // flex: 1,
  },
});
