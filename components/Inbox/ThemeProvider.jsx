// components/inbox/ui/ThemeProvider.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  Appearance,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ThemeContext = createContext();

/* ────────────────────── LIGHT THEME ────────────────────── */
const lightTheme = {
  background: '#ffffff',
  foreground: '#000000',
  card: '#ffffff',
  muted: '#f3f3f5',
  border: '#e5e5e5',
  inputBg: '#f3f3f5',
  messageIn: '#ffffff',
  messageOut: '#000000',
  messageInText: '#000000',
  messageOutText: '#ffffff',
  unreadBg: '#000000',
  unreadText: '#ffffff',
  iconRead: '#999999',
  iconUnread: '#ffffff',
  headerBg: '#ffffff',
  primary: '#000000',
  mutedForeground: '#777777',
};

/* ────────────────────── DARK THEME (COOL & READABLE) ────────────────────── */
const darkTheme = {
  background: '#0d1117',        // GitHub dark
  card: '#161b22',
  headerBg: '#161b22',

  // MAIN TEXT – ALWAYS LIGHT
  foreground: '#e6edf3',        // bright blue-gray
  mutedForeground: '#8b949e',   // secondary text

  border: '#30363d',
  muted: '#21262d',
  inputBg: '#0d1117',

  // CHAT BUBBLES
  messageIn: '#21262d',
  messageInText: '#e6edf3',
  messageOut: '#238636',        // teal-green accent
  messageOutText: '#ffffff',

  // BADGES / UNREAD
  unreadBg: '#238636',
  unreadText: '#ffffff',
  iconRead: '#8b949e',
  iconUnread: '#ffffff',

  // ACCENT
  primary: '#238636',
};

export const ThemeProvider = ({ children }) => {
  const system = useColorScheme();
  const [mode, setMode] = useState(system || 'light');

  // Auto-sync with system theme
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setMode(colorScheme || 'light');
    });
    return () => sub.remove();
  }, []);

  const theme = mode === 'dark' ? darkTheme : lightTheme;
  const toggle = () => setMode(m => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

/* ────────────────────── REUSABLE UI ────────────────────── */

export const Avatar = ({ name, size = 48 }) => {
  const { theme } = useTheme();
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
      <Text style={[styles.avatarText, { color: '#fff' }]}>
        {name?.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
};

export const Badge = ({ value }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: theme.unreadBg }]}>
      <Text style={[styles.badgeText, { color: theme.unreadText }]}>
        {value}
      </Text>
    </View>
  );
};

export const ThemeToggle = () => {
  const { mode, toggle } = useTheme();
  return (
    <TouchableOpacity onPress={toggle} style={styles.toggleBtn}>
      <Icon
        name={mode === 'dark' ? 'weather-sunny' : 'weather-night'}
        size={24}
        color={mode === 'dark' ? '#e6edf3' : '#000000'}
      />
    </TouchableOpacity>
  );
};

export const Header = ({ title, onBack, showToggle = true }) => {
  const { theme } = useTheme();
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
      <Text style={[styles.headerTitle, { color: theme.foreground }]}>
        {title}
      </Text>
      {showToggle && <ThemeToggle />}
    </View>
  );
};

/* ────────────────────── STYLES ────────────────────── */
const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  avatarText: {
    fontWeight: '600',
    fontSize: 18,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  toggleBtn: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
});