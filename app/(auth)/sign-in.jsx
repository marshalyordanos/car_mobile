import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import FormField from "../../components/Auth/FormField";
import Colors from "../../constants/Colors";
import api from "../../redux/api";
import { login } from "../../redux/authReducer";

const SIGNIN_CONSTANTS = {
  ERRORS: {
    PHONE_REQUIRED: "errors.phone_required",
    PHONE_INVALID: "errors.phone_invalid",
    PASSWORD_REQUIRED: "errors.password_required",
    PASSWORD_MIN_LENGTH: "errors.password_min_length",
    GENERAL: "errors.general",
    INVALID_CREDENTIALS: "errors.invalid_credentials",
    SERVICE_UNAVAILABLE: "errors.service_unavailable",
    SERVER_ERROR: "errors.server_error",
    SERVER_ERROR_WITH_STATUS: "errors.server_error_with_status",
    NO_INTERNET: "errors.no_internet",
    INVALID_REDIRECT: "errors.invalid_redirect",
  },
  DEFAULT_REDIRECT: "/home",
  ERROR_TIMEOUT: 5000,
};

const SignIn = ({ onBackPress }) => {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const { redirect, success } = useLocalSearchParams();

  useEffect(() => {
    if (errors.general) {
      const timer = setTimeout(() => setErrors({ ...errors, general: "" }), SIGNIN_CONSTANTS.ERROR_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [errors.general]);

  useEffect(() => {
    if (success) {
      setErrors({ ...errors, general: t("registration_success") });
    }
  }, [success]);

  useEffect(() => {
    console.log("Raw redirect param:", redirect);
  }, [redirect]);

  const isValidRoute = (route) => {
    if (typeof route !== "string" || !route || route === "/") return false;
    return /^\/[a-zA-Z0-9-_\/]+$/.test(route);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.phone) {
      newErrors.phone = t(SIGNIN_CONSTANTS.ERRORS.PHONE_REQUIRED);
    } else if (!/^\+?\d{9,15}$/.test(form.phone)) {
      newErrors.phone = t(SIGNIN_CONSTANTS.ERRORS.PHONE_INVALID);
    }

    if (!form.password) {
      newErrors.password = t(SIGNIN_CONSTANTS.ERRORS.PASSWORD_REQUIRED);
    } else if (form.password.trim().length < 8) {
      newErrors.password = t(SIGNIN_CONSTANTS.ERRORS.PASSWORD_MIN_LENGTH);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = useCallback(async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({ phone: "", password: "", general: "" });

    try {
      const phoneNumber = form.phone.trim();
      const password = form.password.trim();

      console.log("Attempting sign in with:", {
        phone: phoneNumber,
        passwordLength: password.length,
      });

      const response = await api.post("/auth/login", {
        phone: phoneNumber,
        password,
      });

      console.log("Login successful:", response.data);

      const userData = response.data.data;

      try {
        await AsyncStorage.setItem("data", JSON.stringify(userData));
      } catch (storageError) {
        console.error("AsyncStorage error:", storageError);
      }

      dispatch(login(userData));
      let safeRedirect = router.canGoBack() ? "back" : SIGNIN_CONSTANTS.DEFAULT_REDIRECT;
      if (Array.isArray(redirect)) {
        safeRedirect = redirect.find((r) => isValidRoute(r)) || safeRedirect;
      } else if (isValidRoute(redirect)) {
        safeRedirect = redirect;
      } else if (redirect) {
        console.warn("Invalid redirect:", redirect);
        setErrors({ ...errors, general: t(SIGNIN_CONSTANTS.ERRORS.INVALID_REDIRECT) });
        setLoading(false);
        return;
      }

      console.log("Navigating to:", safeRedirect);
      try {
        if (safeRedirect === "back") {
          router.back();
        } else {
          router.push(safeRedirect);
        }
      } catch (navError) {
        console.error("Navigation error:", navError);
        setErrors({ ...errors, general: t(SIGNIN_CONSTANTS.ERRORS.INVALID_REDIRECT) });
        if (router.canGoBack()) {
          router.back();
        } else {
          router.push(SIGNIN_CONSTANTS.DEFAULT_REDIRECT);
        }
      }
    } catch (error) {
      console.error("Login failed - FULL ERROR:", error);

      let errorMessage = t(SIGNIN_CONSTANTS.ERRORS.GENERAL);

      if (error?.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;

        if (status === 401) {
          errorMessage = serverMessage || t(SIGNIN_CONSTANTS.ERRORS.INVALID_CREDENTIALS);
        } else if (status === 404) {
          errorMessage = t(SIGNIN_CONSTANTS.ERRORS.SERVICE_UNAVAILABLE);
        } else if (status === 500) {
          errorMessage = t(SIGNIN_CONSTANTS.ERRORS.SERVER_ERROR);
        } else {
          errorMessage = serverMessage || t(SIGNIN_CONSTANTS.ERRORS.SERVER_ERROR_WITH_STATUS, { status });
        }
      } else if (error?.request) {
        errorMessage = t(SIGNIN_CONSTANTS.ERRORS.NO_INTERNET);
      }

      setErrors({ phone: "", password: "", general: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [form, dispatch, router, redirect, t]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      accessible
      accessibilityLabel={t("sign_in_screen")}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {onBackPress && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            accessible
            accessibilityLabel={t("back_to_profile")}
          >
            <Ionicons name="arrow-back" size={32} color={Colors.dark} />
            <Text style={styles.backButtonText}>{t("profile")}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.header}>
          <Image
            style={styles.logoImage}
            source={require("../../assets/images/logo1.png")}
            resizeMode="contain"
            accessible
            accessibilityLabel={t("app_logo")}
          />
          <Text style={styles.title}>{t("sign_in")}</Text>
          <Text style={styles.subtitle}>{t("sign_desc")}</Text>
        </View>

        <View style={styles.form}>
          {errors.general ? (
            <View style={[styles.alert, errors.general === t("registration_success") ? styles.successAlert : styles.errorAlert]}>
              <Text style={styles.alertText}>{errors.general}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setErrors({ ...errors, general: "" })}
                accessible
                accessibilityLabel={t("close_alert")}
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : null}

          <FormField
            title={t("phone")}
            value={form.phone}
            handleChangeText={(text) => {
              const cleanPhone = text.replace(/[^0-9+]/g, "");
              setForm({ ...form, phone: cleanPhone });
              if (errors.phone || errors.general) setErrors({ ...errors, phone: "", general: "" });
            }}
            error={errors.phone}
            placeholder={t("Enter your phone no")}
            keyboardType="phone-pad"
            otherStyles={styles.formField}
            editable={!loading}
            accessible
            accessibilityLabel={t("phone_input")}
          />

          <View style={styles.passwordContainer}>
            <FormField
              title={t("password")}
              value={form.password}
              handleChangeText={(text) => {
                setForm({ ...form, password: text });
                if (errors.password || errors.general) setErrors({ ...errors, password: "", general: "" });
              }}
              error={errors.password}
              placeholder={t("Password")}
              secureTextEntry={!showPassword}
              otherStyles={styles.formField}
              editable={!loading}
              accessible
              accessibilityLabel={t("password_input")}
              showPassword={showPassword} 
              onTogglePassword={() => setShowPassword(!showPassword)} 
            />
           
          </View>

          <TouchableOpacity
            onPress={handleSignIn}
            style={[styles.signInButton, loading && styles.disabledButton]}
            disabled={loading}
            activeOpacity={0.7}
            accessible
            accessibilityLabel={t("sign_in_button")}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signInButtonText}>{t("sign_in")}</Text>
            )}
          </TouchableOpacity>

          <Link style={styles.forgotPassword} href="/forget" asChild>
            <Text accessible accessibilityLabel={t("forgot_password_link")}>
              {t("forget")}
            </Text>
          </Link>
        </View>

        <View style={styles.footer}>
          <Text style={styles.signUpText}>{t("don't have an account?")}</Text>
          <Link style={styles.signUpLink} href="/sign-up" asChild>
            <Text accessible accessibilityLabel={t("sign_up_link")}>
              {t("sign_up")}
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
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
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoImage: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 8,
  },
  form: {
    width: "100%",
  },
  formField: {
    marginBottom: 20,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: 40,
    zIndex: 1,
  },
  signInButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  signInButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPassword: {
    textAlign: "center",
    color: Colors.primary,
    fontSize: 14,
    marginTop: 15,
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
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
  alert: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  successAlert: {
    backgroundColor: "#28a745",
  },
  errorAlert: {
    backgroundColor: "#dc3545",
  },
  alertText: {
    color: "white",
    fontSize: 14,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
});

export default SignIn;