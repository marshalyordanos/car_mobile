import {
  AntDesign,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import AppLoader from "../../components/AppLoader";
import FormField from "../../components/FormField";
import Colors from "../../constants/Colors";
import images from "../../constants/images";
import api from "../../redux/api";
import { login, logout, selectCurrentUser } from "../../redux/authReducer";

const Profile = () => {
  const query = useLocalSearchParams();
  const [isLoading, setLoading] = useState(false);
  const user = useSelector(selectCurrentUser);
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const language = useSelector((state) => state.auth.lan);

  useFocusEffect(
    useCallback(() => {
      setShowLogin(false);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!showLogin || user ? (
            <ProfileHome
              t={t}
              setLoading={setLoading}
              lan={language}
              user={user}
              setShowLogin={setShowLogin}
            />
          ) : (
            <Login
              t={t}
              lan={language}
              setLoading={setLoading}
              status={query?.success}
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
          Icon: MaterialCommunityIcons, // Changed from lowercase 'icon' to uppercase 'Icon'
          iconName: "account-details-outline",
          name: t("detail"),
          link: "/profile-detail",
        },
        {
          Icon: MaterialCommunityIcons, // Changed from lowercase 'icon' to uppercase 'Icon'
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
          Icon: SimpleLineIcons, // Changed from lowercase 'icon' to uppercase 'Icon'
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
          Icon: AntDesign, // Changed from lowercase 'icon' to uppercase 'Icon'
          iconName: "message1",
          name: t("about_us"),
          link: "/about",
        },
        {
          Icon: AntDesign, // Changed from lowercase 'icon' to uppercase 'Icon'
          iconName: "phone",
          name: t("contact_us"),
          link: "/contact",
        },
      ],
    },
  ];

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await api.post("api/v1/auth/users/delete/");
              await AsyncStorage.removeItem("data");
              dispatch(logout());
            } catch (error) {
              console.error(error);
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  console.log("user:2ss ", user);

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.headerTitle}>{t("profile")}</Text>

      {user && (
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <FontAwesome6 name="user-tie" size={40} color="white" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.user?.first_name + " " + user?.user?.last_name}
              </Text>
              <Text style={styles.lastLogin}>
                Last Login:{" "}
                {new Date(user?.user?.last_login).toLocaleDateString()}
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
          >
            <Text style={styles.dangerButtonText}>{t("logout")}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={async () => {
              Alert.alert(
                "Delete Account",
                "Are you sure you want to delete your account?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        setLoading(true);
                        await api.post("api/v1/auth/users/delete/");
                        await AsyncStorage.removeItem("data");
                        dispatch(logout());
                      } catch (error) {
                        console.error(error);
                      } finally {
                        setLoading(false);
                      }
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.dangerButtonText}>{t("delete_account")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!user && (
        <TouchableOpacity
          onPress={() => setShowLogin(true)}
          style={styles.continueShopping}
        >
          <Text style={styles.continueShoppingText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const MenuButton = ({ Icon, iconName, name, link }) => (
  <Link href={link} asChild>
    <TouchableOpacity style={styles.menuButton}>
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

const Login = ({ status, setLoading, setShowLogin, lan, t }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [showSuccess, setShowSuccess] = useState(status);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const validate = () => {
    const newErrors = {};
    if (!form.email)
      newErrors.email = "Please provide your email or phone number";
    if (!form.password) newErrors.password = "Please provide your password";
    setErrors({ ...errors, ...newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      console.log({
        phoneEmail: "+" + form.email,
        password: form.password,
      });
      const res = await api.post("user/login", {
        phone_number: "+" + form.email,
        password: form.password,
      });
      await AsyncStorage.setItem("data", JSON.stringify(res.data.data));
      dispatch(login(res.data.data));
      router.push({ pathname: "/profile", params: { success: true } });
    } catch (error) {
      console.log(error);
      setErrors({
        ...errors,
        general: "Invalid password or phone/email",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setShowLogin(false)}
      >
        <Ionicons name="arrow-back" size={32} color={Colors.dark} />
        <Text style={styles.backButtonText}>Profile</Text>
      </TouchableOpacity>

      <Image
        style={styles.logoImage}
        source={images.logo}
        resizeMode="contain"
      />

      <Text style={styles.loginTitle}>{t("sign_in")}</Text>
      <Text style={styles.loginSubtitle}>{t("sign_desc")}</Text>
      <Text style={styles.phoneFormat}>
        Enter phone number as "251*********" (without +)
      </Text>

      {showSuccess && (
        <View style={styles.successAlert}>
          <Text style={styles.alertText}>
            Registration successful. Please log in.
          </Text>
        </View>
      )}

      <FormField
        title={t("phone")}
        value={form.email}
        handleChangeText={(text) => {
          setForm({ ...form, email: text });
          setErrors({ ...errors, email: "", general: "" });
        }}
        error={errors.email}
        placeholder="Phone"
        keyboardType="email-address"
        style={styles.formField}
      />

      <FormField
        title={t("password")}
        value={form.password}
        handleChangeText={(text) => {
          setForm({ ...form, password: text });
          setErrors({ ...errors, password: "", general: "" });
        }}
        error={errors.password}
        placeholder="Password"
        secureTextEntry
        style={styles.formField}
      />

      {errors.general && (
        <View style={styles.errorAlert}>
          <Text style={styles.alertText}>{errors.general}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setErrors({ ...errors, general: "" })}
          >
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
        <Text style={styles.signInButtonText}>{t("sign_in")}</Text>
      </TouchableOpacity>

      <Link style={styles.forgotPassword} href="/forget">
        {t("forget")}
      </Link>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>
          {lan === "en" && "Don't have an account?"}
        </Text>
        <Link style={styles.signUpLink} href="/sign-up">
          {t("sign_up")}
        </Link>
      </View>
    </View>
  );
};

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
  lastLogin: {
    fontSize: 14,
    color: Colors.gray,
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
  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    backgroundColor: "#393381",
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

  // Login styles
  loginContainer: {
    padding: 20,
    minHeight: "100%",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.dark,
  },
  logoImage: {
    width: 200,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 26,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 8,
  },
  phoneFormat: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 20,
    fontStyle: "italic",
  },
  successAlert: {
    backgroundColor: "#28a745",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorAlert: {
    backgroundColor: "#dc3545",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alertText: {
    color: "white",
    fontSize: 14,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  formField: {
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signInButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
  forgotPassword: {
    textAlign: "center",
    color: Colors.primary,
    fontSize: 14,
    marginTop: 10,
    textDecorationLine: "underline",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    gap: 8,
  },
  signUpText: {
    fontSize: 16,
    color: Colors.dark,
  },
  signUpLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default Profile;
