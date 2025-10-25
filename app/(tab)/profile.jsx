import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import SignIn from "../(auth)/sign-in";
import AppLoader from "../../components/AppLoader";
import Colors from "../../constants/Colors";
import { logout, selectCurrentUser } from "../../redux/authReducer";

const Profile = () => {
  const [isLoading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const user = useSelector(selectCurrentUser);
  const { t } = useTranslation();
  const { success } = useLocalSearchParams();
  const language = useSelector((state) => state.auth.lan);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setShowLogin(false);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {showLogin || success ? (
            <SignIn
              onBackPress={() => {
                setShowLogin(false);
                router.push("/profile");
              }}
            />
          ) : (
            <ProfileHome
              t={t}
              setLoading={setLoading}
              lan={language}
              user={user}
              setShowLogin={setShowLogin}
            />
          )}
        </ScrollView>
        {isLoading && <AppLoader />}
      </View>
    </SafeAreaView>
  );
};

const ProfileHome = ({ user, t, setShowLogin, setLoading, lan }) => {
  const dispatch = useDispatch();

  const menuSections = [
    {
      id: "account",
      visible: !!user,
      items: [
        {
          Icon: MaterialCommunityIcons,
          iconName: "account-details-outline",
          name: t("detail"),
          link: "/profile-detail",
        },
        {
          Icon: MaterialCommunityIcons,
          iconName: "history",
          name: t("booking_history") || "Booking History",
          link: "/Booking/Mybooking",
        },
        {
          Icon: MaterialCommunityIcons,
          iconName: "history",
          name: t("purchase_history"),
          link: "/purchase-history",
        },
      ],
    },
    {
      id: "orders",
      items: [
        {
          Icon: SimpleLineIcons,
          iconName: "question",
          name: t("check_item"),
          link: "/check-item",
        },
      ],
    },
    {
      id: "info",
      items: [
        {
          Icon: AntDesign,
          iconName: "message1",
          name: t("about_us"),
          link: "/about",
        },
        {
          Icon: AntDesign,
          iconName: "phone",
          name: t("contact_us"),
          link: "/contact",
        },
      ],
    },
  ];

  const handleDeleteAccount = async () => {
    Alert.alert(
      t("delete_account"),
      t("delete_account_confirm"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await api.post("api/v1/auth/users/delete/");
              await AsyncStorage.removeItem("data");
              dispatch(logout());
            } catch (error) {
              console.error(error);
              Alert.alert(t("error"), t("delete_account_error"));
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.headerTitle}>{t("profile")}</Text>

      {user && (
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <FontAwesome6
                name="user-tie"
                size={40}
                color="white"
                accessible
                accessibilityLabel={t("user_avatar")}
              />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.user?.firstName + " " + user?.user?.lastName}
              </Text>
            </View>
          </View>
        </View>
      )}

      {menuSections.map(
        (section, index) =>
          section.visible !== false && (
            <View
              key={section.id}
              style={[
                styles.menuSection,
                index > 0 && styles.menuSectionMargin,
              ]}
            >
              {section.items.map((item, idx) => (
                <React.Fragment key={item.link}>
                  <MenuButton {...item} />
                  {idx < section.items.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          )
      )}

      {user && (
        <View style={[styles.menuSection, styles.menuSectionMargin]}>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={async () => {
              await AsyncStorage.removeItem("data");
              dispatch(logout());
            }}
            accessible
            accessibilityLabel={t("logout_button")}
          >
            <Text style={styles.dangerButtonText}>{t("logout")}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
            accessible
            accessibilityLabel={t("delete_account_button")}
          >
            <Text style={styles.dangerButtonText}>{t("delete_account")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!user && (
        <TouchableOpacity
          onPress={() => setShowLogin(true)}
          style={styles.continueShopping}
          accessible
          accessibilityLabel={t("login_button")}
        >
          <Text style={styles.continueShoppingText}>{t("sign_in")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const MenuButton = ({ Icon, iconName, name, link }) => (
  <Link href={link} asChild>
    <TouchableOpacity
      style={styles.menuButton}
      accessible
      accessibilityLabel={name}
    >
      <View style={styles.menuButtonContent}>
        <View style={styles.menuButtonLeft}>
          <Icon name={iconName} size={24} color={Colors.primary} />
          <Text style={styles.menuButtonText}>{name}</Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={20}
          color={Colors.primary}
        />
      </View>
    </TouchableOpacity>
  </Link>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  profileContainer: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
    color: Colors.dark,
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  avatarContainer: {
    backgroundColor: Colors.primary,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 4,
  },
  menuSection: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuSectionMargin: {
    marginTop: 20,
  },
  menuButton: {
    paddingVertical: 12,
  },
  menuButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  menuButtonText: {
    fontSize: 16,
    color: Colors.dark,
  },
  divider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 8,
  },
  dangerButton: {
    paddingVertical: 12,
  },
  dangerButtonText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
  },
  continueShopping: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#393381",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  continueShoppingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Profile;