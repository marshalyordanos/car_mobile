import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useLocalSearchParams, useRouter } from "expo-router"; // ✅ Fixed import
import { useState } from "react";
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
  View
} from "react-native";
import { useDispatch } from "react-redux";
import FormField from "../../components/FormField";
import Colors from "../../constants/Colors";
import images from "../../constants/images";
import api from "../../redux/api";
import { login } from "../../redux/authReducer";

const SignIn = () => {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const { redirect } = useLocalSearchParams(); // ✅ Now works

  const validate = () => {
    const newErrors = {};
    
    // ✅ Improved phone validation (international support)
    if (!form.phone) {
      newErrors.phone = "Please provide your phone number";
    } else if (form.phone.length < 9 || form.phone.length > 15) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    // Password validation
    if (!form.password) {
      newErrors.password = "Please provide your password";
    } else if (form.password.trim().length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({ phone: "", password: "", general: "" });

    try {
      const phoneNumber = form.phone.trim();
      const password = form.password.trim();

      console.log("🔐 Attempting sign in with:", { 
        phone: phoneNumber, 
        passwordLength: password.length 
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

     
      if (redirect && typeof redirect === 'string' && redirect !== '/') {
        router.replace(redirect);
      } else {
        router.replace("/Checkout");
      }

    } catch (error) {
      console.error("Login failed - FULL ERROR:", error);

      let errorMessage = "Something went wrong. Please try again.";

      if (error?.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;

        if (status === 401) {
          errorMessage = serverMessage || "Invalid phone number or password";
        } else if (status === 404) {
          errorMessage = "Login service unavailable";
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = serverMessage || `Server error (${status})`;
        }
      } else if (error?.request) {
        errorMessage = "No internet connection. Please check your connection.";
      }

      setErrors({ phone: "", password: "", general: errorMessage });

    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image
            style={styles.logoImage}
            source={images.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>{t("sign_in")}</Text>
          <Text style={styles.subtitle}>{t("sign_desc")}</Text>
          <Text style={styles.phoneFormat}>
            Enter your phone number
          </Text>
        </View>

        <View style={styles.form}>
          {errors.general ? (
            <View style={styles.errorAlert}>
              <Text style={styles.alertText}>{errors.general}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setErrors({ ...errors, general: "" })}
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : null}

          <FormField
            title={t("phone")}
            value={form.phone}
            handleChangeText={(text) => {
              const cleanPhone = text.replace(/[^0-9+]/g, ""); // ✅ Better cleaning
              setForm({ ...form, phone: cleanPhone });
              if (errors.phone) {
                setErrors({ ...errors, phone: "" });
              }
            }}
            error={errors.phone}
            placeholder="Phone number"
            keyboardType="phone-pad"
            otherStyles={styles.formField}
          />

          <FormField
            title={t("password")}
            value={form.password}
            handleChangeText={(text) => {
              setForm({ ...form, password: text });
              if (errors.password) {
                setErrors({ ...errors, password: "" });
              }
            }}
            error={errors.password}
            placeholder="Password"
            secureTextEntry
            otherStyles={styles.formField}
          />

          <TouchableOpacity
            onPress={handleSignIn}
            style={[styles.signInButton, loading && styles.disabledButton]}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signInButtonText}>{t("sign_in")}</Text>
            )}
          </TouchableOpacity>

          <Link style={styles.forgotPassword} href="/forget">
            {t("forget")}
          </Link>
        </View>

        <View style={styles.footer}>
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <Link style={styles.signUpLink} href="/sign-up">
            {t("sign_up")}
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
  phoneFormat: {
    fontSize: 12,
    color: Colors.gray,
    fontStyle: "italic",
  },
  form: {
    width: "100%",
  },
  formField: {
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
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
});

export default SignIn;