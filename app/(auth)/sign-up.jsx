import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import CheckBox from "react-native-check-box";
import PhoneInput from "react-native-phone-number-input";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import AppLoader from "../../components/AppLoader";
import FormField from "../../components/Auth/FormField";
import styles from "../../components/Auth/Styles";
import api from "../../redux/api";

const { height } = Dimensions.get("window");
const minHeight = height * 0.85;

const SIGNUP_CONSTANTS = {
  ERRORS: {
    FULLNAME_REQUIRED: "errors.fullname_required",
    PHONE_INVALID: "errors.phone_invalid",
    EMAIL_INVALID: "errors.email_invalid",
    PASSWORD_REQUIRED: "errors.password_required",
    PASSWORD_MIN_LENGTH: "errors.password_min_length",
    PASSWORD_UPPERCASE: "errors.password_uppercase",
    PASSWORD_SPECIAL: "errors.password_special",
    PASSWORD_NUMBER: "errors.password_number",
    CONFIRM_PASSWORD_MISMATCH: "errors.confirm_password_mismatch",
    TERMS_NOT_ACCEPTED: "errors.terms_not_accepted",
    PROFILE_PHOTO_REQUIRED: "errors.profile_photo_required",
    PROFILE_PHOTO_INVALID: "errors.profile_photo_invalid",
    ID_FILE_REQUIRED: "errors.id_file_required",
    ID_FILE_INVALID: "errors.id_file_invalid",
    DRIVER_LICENSE_REQUIRED: "errors.driver_license_required",
    DRIVER_LICENSE_INVALID: "errors.driver_license_invalid",
    ROLE_REQUIRED: "errors.role_required",
    GENERAL: "errors.general",
    INVALID_REDIRECT: "errors.invalid_redirect",
    FILE_SIZE_EXCEEDED: "errors.file_size_exceeded",
    TERMS_URL_ERROR: "errors.terms_url_error",
  },
  DEFAULT_REDIRECT: "/home",
  ERROR_TIMEOUT: 5000,
  ROLES: ["guest", "host"],
};

const SignUp = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { redirect } = useLocalSearchParams();
  const language = useSelector((state) => state.auth.lan);
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState(null);
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setError] = useState([]);
  const [isSelected, setSelection] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setError([]), SIGNUP_CONSTANTS.ERROR_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    console.log("Redirect param:", redirect);
  }, [redirect]);

  const isValidRoute = (route) => {
    if (typeof route !== "string" || !route || route === "/") return false;
    return /^\/[a-zA-Z0-9-_\/]+$/.test(route);
  };

  const validate = (
    fullname,
    phone,
    email,
    password,
    confirmPassword,
    isTermsAccepted,
    profilePhotoFile,
    idFile,
    driverLicenseFile,
    role
  ) => {
    const errors = [];

    if (!fullname) errors.push(t(SIGNUP_CONSTANTS.ERRORS.FULLNAME_REQUIRED));
    if (!phone || !phone.startsWith("+251") || phone.length !== 13)
      errors.push(t(SIGNUP_CONSTANTS.ERRORS.PHONE_INVALID));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) errors.push(t(SIGNUP_CONSTANTS.ERRORS.EMAIL_INVALID));
    if (!password) errors.push(t(SIGNUP_CONSTANTS.ERRORS.PASSWORD_REQUIRED));
    if (password) {
      if (password.length < 8) errors.push(t(SIGNUP_CONSTANTS.ERRORS.PASSWORD_MIN_LENGTH));
      if (!/[A-Z]/.test(password)) errors.push(t(SIGNUP_CONSTANTS.ERRORS.PASSWORD_UPPERCASE));
      if (!/[!@#$%^&*]/.test(password)) errors.push(t(SIGNUP_CONSTANTS.ERRORS.PASSWORD_SPECIAL));
      if (!/[0-9]/.test(password)) errors.push(t(SIGNUP_CONSTANTS.ERRORS.PASSWORD_NUMBER));
    }
    if (!confirmPassword || password !== confirmPassword)
      errors.push(t(SIGNUP_CONSTANTS.ERRORS.CONFIRM_PASSWORD_MISMATCH));
    if (!isTermsAccepted) errors.push(t(SIGNUP_CONSTANTS.ERRORS.TERMS_NOT_ACCEPTED));
    if (!profilePhotoFile) errors.push(t(SIGNUP_CONSTANTS.ERRORS.PROFILE_PHOTO_REQUIRED));
    if (profilePhotoFile && !["image/jpeg", "image/png"].includes(profilePhotoFile.type))
      errors.push(t(SIGNUP_CONSTANTS.ERRORS.PROFILE_PHOTO_INVALID));
    if (!idFile) errors.push(t(SIGNUP_CONSTANTS.ERRORS.ID_FILE_REQUIRED));
    if (idFile && !["image/jpeg", "image/png", "application/pdf"].includes(idFile.type))
      errors.push(t(SIGNUP_CONSTANTS.ERRORS.ID_FILE_INVALID));
    if (!driverLicenseFile) errors.push(t(SIGNUP_CONSTANTS.ERRORS.DRIVER_LICENSE_REQUIRED));
    if (
      driverLicenseFile &&
      !["image/jpeg", "image/png", "application/pdf"].includes(driverLicenseFile.type)
    )
      errors.push(t(SIGNUP_CONSTANTS.ERRORS.DRIVER_LICENSE_INVALID));
    if (!role || !SIGNUP_CONSTANTS.ROLES.includes(role))
      errors.push(t(SIGNUP_CONSTANTS.ERRORS.ROLE_REQUIRED));

    return errors;
  };

  const pickFile = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: type === "profile" ? ["image/*"] : ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const file = result.assets[0];

        if (file.size > 5 * 1024 * 1024) {
          setError([t(SIGNUP_CONSTANTS.ERRORS.FILE_SIZE_EXCEEDED)]);
          return;
        }

        const fileObj = {
          uri: file.uri,
          name: file.name || `file_${Date.now()}.${file.mimeType?.split("/")[1] || "jpg"}`,
          type: file.mimeType || "application/octet-stream",
          size: file.size,
        };

        if (type === "profile") {
          setProfilePhotoFile(fileObj);
        } else if (type === "id") {
          setIdFile(fileObj);
        } else if (type === "driverLicense") {
          setDriverLicenseFile(fileObj);
        }

        console.log("Selected file:", fileObj);
      }
    } catch (err) {
      console.error("Error picking file:", err);
      setError([t(SIGNUP_CONSTANTS.ERRORS.GENERAL)]);
    }
  };

  const resetForm = () => {
    setForm({
      fullname: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
    setValue("");
    setFormattedValue("");
    setProfilePhotoFile(null);
    setIdFile(null);
    setDriverLicenseFile(null);
    setSelection(false);
    setError([]);
  };

  const handleSignUp = useCallback(async () => {
    const errors = validate(
      form.fullname,
      formattedValue,
      form.email,
      form.password,
      form.confirmPassword,
      isSelected,
      profilePhotoFile,
      idFile,
      driverLicenseFile,
      form.role
    );

    if (errors.length > 0) {
      setError(errors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      const [first, last] = form.fullname.split(" ");
      formData.append("firstName", first || "");
      formData.append("lastName", last || "");
      formData.append("phone", formattedValue);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", form.role);

      if (profilePhotoFile) {
        formData.append("profilePhotoFile", {
          uri: profilePhotoFile.uri,
          name: profilePhotoFile.name,
          type: profilePhotoFile.type,
        });
      }

      if (idFile) {
        formData.append("nationalIdFile", {
          uri: idFile.uri,
          name: idFile.name,
          type: idFile.type,
        });
      }

      if (driverLicenseFile) {
        formData.append("driverLicenseFile", {
          uri: driverLicenseFile.uri,
          name: driverLicenseFile.name,
          type: driverLicenseFile.type,
        });
      }

      console.log("Sending signup request...");
      const res = await api.post("auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Signup successful:", res.data);
      setLoading(false);

      let safeRedirect = router.canGoBack() ? "back" : SIGNUP_CONSTANTS.DEFAULT_REDIRECT;
      if (Array.isArray(redirect)) {
        safeRedirect = redirect.find((r) => isValidRoute(r)) || safeRedirect;
      } else if (isValidRoute(redirect)) {
        safeRedirect = redirect;
      } else if (redirect) {
        console.warn("Invalid redirect:", redirect);
        setError([t(SIGNUP_CONSTANTS.ERRORS.INVALID_REDIRECT)]);
        setLoading(false);
        return;
      }

      console.log("Navigating to:", safeRedirect);
      try {
        if (safeRedirect === "back") {
          router.back();
        } else {
          router.push({ pathname: safeRedirect, params: { success: true } });
        }
      } catch (navError) {
        console.error("Navigation error:", navError);
        setError([t(SIGNUP_CONSTANTS.ERRORS.INVALID_REDIRECT)]);
        if (router.canGoBack()) {
          router.back();
        } else {
          router.push({ pathname: SIGNUP_CONSTANTS.DEFAULT_REDIRECT, params: { success: true } });
        }
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      setLoading(false);
      setError([error.response?.data?.message || t(SIGNUP_CONSTANTS.ERRORS.GENERAL)]);
    }
  }, [form, formattedValue, isSelected, profilePhotoFile, idFile, driverLicenseFile, router, redirect, t]);

  const handlePressTerms = async () => {
    const url =
      "https://docs.google.com/document/d/1UWnR3ZnWn6a6XCg6sFf_s2Ha63rNvf4m4llL4XY6pJE/edit?usp=drive_link";
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        setError([t(SIGNUP_CONSTANTS.ERRORS.TERMS_URL_ERROR)]);
      }
    } catch (err) {
      console.error("Error opening terms:", err);
      setError([t(SIGNUP_CONSTANTS.ERRORS.TERMS_URL_ERROR)]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.login_con}>
          <Text style={styles.login_main_text}>{t("sign_up")}</Text>
          <Text style={styles.subtitle}>{t("sign_up_desc")}</Text>

          <FormField
            title={t("fullname")}
            value={form.fullname}
            handleChangeText={(e) => {
              setForm({ ...form, fullname: e });
              if (errors.length) setError([]);
            }}
            otherStyles={{ marginTop: 28 }}
            keyboardType="default"
            placeholder={t("fullname")}
            accessible
            accessibilityLabel={t("fullname_input")}
          />

          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>{t("phone")}</Text>
            <PhoneInput
              containerStyle={styles.phoneInputContainer}
              textContainerStyle={styles.phoneInputText}
              flagButtonStyle={styles.flagButton}
              defaultValue={value}
              defaultCode="ET"
              layout="first"
              onChangeText={setValue}
              onChangeFormattedText={(text) => {
                setFormattedValue(text);
                if (errors.length) setError([]);
              }}
              withDarkTheme
              withShadow
              accessible
              accessibilityLabel={t("phone_input")}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>{t("Role")}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.role}
                onValueChange={(itemValue) => {
                  setForm({ ...form, role: itemValue });
                  if (errors.length) setError([]);
                }}
                style={styles.picker}
                accessibilityLabel={t("role_select")}
                accessibilityState={{ selected: !!form.role }}
              >
                <Picker.Item label={t("select_role")} value="" enabled={false} />
                {SIGNUP_CONSTANTS.ROLES.map((role) => (
                  <Picker.Item key={role} label={t(`${role}`)} value={role} />
                ))}
              </Picker>
            </View>
          </View>

          <FilePickerField
            label={t("Profile Photo")}
            file={profilePhotoFile}
            setFile={setProfilePhotoFile}
            pickFile={() => pickFile("profile")}
          />
          <FilePickerField
            label={t("Id")}
            file={idFile}
            setFile={setIdFile}
            pickFile={() => pickFile("id")}
          />
          <FilePickerField
            label={t("Driver License")}
            file={driverLicenseFile}
            setFile={setDriverLicenseFile}
            pickFile={() => pickFile("driverLicense")}
          />

          <FormField
            title={t("Email")}
            value={form.email}
            handleChangeText={(e) => {
              setForm({ ...form, email: e });
              if (errors.length) setError([]);
            }}
            otherStyles={{ marginTop: 20 }}
            keyboardType="email-address"
            placeholder={t("email")}
            accessible
            accessibilityLabel={t("email_input")}
          />

          <View style={styles.passwordContainer}>
            <FormField
              title={t("password")}
              value={form.password}
              handleChangeText={(e) => {
                setForm({ ...form, password: e });
                if (errors.length) setError([]);
              }}
              otherStyles={{ marginTop: 20 }}
              secureTextEntry={!showPassword}
              placeholder={t("password")}
              accessible
              accessibilityLabel={t("password_input")}
              showPassword={showPassword} 
              onTogglePassword={() => setShowPassword(!showPassword)} 
            />
            
          </View>

          <FormField
            title={t("confirm_password")}
            value={form.confirmPassword}
            handleChangeText={(e) => {
              setForm({ ...form, confirmPassword: e });
              if (errors.length) setError([]);
            }}
            otherStyles={{ marginTop: 20 }}
            secureTextEntry={!showPassword}
            placeholder={t("confirm_password")}
            accessible
            accessibilityLabel={t("confirm_password_input")}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <View style={styles.checkboxContainer}>
            <CheckBox
              style={styles.checkbox}
              onClick={() => setSelection(!isSelected)}
              isChecked={isSelected}
              accessible
              accessibilityLabel={t("terms_checkbox")}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text style={styles.checkboxLabel}>{t("I accept the Terms of Service.")}</Text>
              <TouchableOpacity onPress={handlePressTerms} accessible accessibilityLabel={t("terms_link")}>
                <Text style={styles.linkText}>{t("Read Terms")}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {errors.length > 0 && (
            <View style={styles.errorContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {errors.map((err, index) => (
                  <Text key={index} style={styles.errorText}>
                    • {err}
                  </Text>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setError([])}
                accessible
                accessibilityLabel={t("close_alert")}
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleSignUp}
              style={[styles.login_button, isLoading && styles.disabledButton]}
              disabled={isLoading}
              accessible
              accessibilityLabel={t("sign_up_button")}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>{t("sign_up")}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={resetForm}
              style={styles.resetButton}
              accessible
              accessibilityLabel={t("reset_form")}
            >
              <Text style={styles.resetButtonText}>{t("reset")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerPage_link}>
            <Text style={styles.signUpText}>{t("have_account")}</Text>
            <Link href="/sign-in" asChild>
              <Text style={styles.linkText} accessible accessibilityLabel={t("sign_in_link")}>
                {t("sign_in")}
              </Text>
            </Link>
          </View>
        </View>

        {isLoading && <AppLoader />}
      </ScrollView>
    </SafeAreaView>
  );
};

const FilePickerField = ({ label, file, setFile, pickFile }) => {
  const { t } = useTranslation();
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>{label}</Text>
      {file ? (
        <View style={styles.filePreview}>
          {file.type?.startsWith("image/") ? (
            <Image
              source={{ uri: file.uri }}
              style={styles.fileImage}
              resizeMode="cover"
              accessible
              accessibilityLabel={`${label} preview`}
            />
          ) : (
            <View style={styles.filePlaceholder}>
              <MaterialIcons name="insert-drive-file" size={24} color="white" />
              <Text
                style={styles.fileName}
                numberOfLines={1}
                ellipsizeMode="middle"
                accessible
                accessibilityLabel={`${label} file name`}
              >
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setFile(null)}
            style={styles.removeFileButton}
            accessible
            accessibilityLabel={t("remove_file", { label })}
          >
            <Entypo name="cross" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.filePickerButton}
          onPress={pickFile}
          accessible
          accessibilityLabel={t("pick_file", { label })}
        >
          <Entypo name="plus" size={37} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SignUp;