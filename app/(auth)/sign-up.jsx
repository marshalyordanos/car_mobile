import * as DocumentPicker from "expo-document-picker";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert, Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"; // 🆗 Added Alert
import CheckBox from "react-native-check-box";
import PhoneInput from "react-native-phone-number-input";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Entypo, MaterialIcons } from "react-native-vector-icons/MaterialIcons"; // 🆗 Both icons
import { useSelector } from "react-redux";
import AppLoader from "../../components/AppLoader";
import FormField from "../../components/FormField";
import api from "../../redux/api";

const { height } = Dimensions.get("window");
const minHeight = height * 0.85;

const SignUp = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  
  // 🆗 FIXED: Correct state names
  const [isLoading, setLoading] = useState(false);
  const [idFile, setIdFile] = useState(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState(null);

  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    self_created: true,
  });

  const [fullnameError, setFullnameError] = useState(""); // 🆗 Fixed typo
  const [phoneError, setPhoneError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termError, setTermError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errors, setError] = useState([]);

  const { t, i18n } = useTranslation();
  const language = useSelector((state) => state.auth.lan);
  const [isSelected, setSelection] = useState(false);

  const validate = (
    fullname,
    phone,
    email,
    password,
    confirmPassword,
    isTermsAccepted
  ) => {
    const errors = [];

    if (!fullname) errors.push("Please provide your full name.");
    if (!phone || !phone.startsWith("+251") || phone.length !== 13)
      errors.push("Please provide a valid phone number.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) errors.push("The email is invalid.");
    if (!password) errors.push("Password is required.");
    if (password) {
      if (password.length < 8)
        errors.push("Password must be at least 8 characters long.");
      if (!/[A-Z]/.test(password))
        errors.push("Password must contain at least one uppercase letter.");
      if (!/[!@#$%^&*]/.test(password))
        errors.push(
          "Password must contain at least one special character (!@#$%^&*)."
        );
      if (!/[0-9]/.test(password))
        errors.push("Password must contain at least one number.");
    }
    if (!confirmPassword || password !== confirmPassword)
      errors.push("Passwords do not match.");
    if (!isTermsAccepted)
      errors.push("You must agree to the terms and conditions.");

    return errors;
  };

  // 🆗 FIXED: Updated pickFile function
  const pickFile = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      // 🆗 FIXED: New expo-document-picker format
      if (!result.canceled && result.assets?.[0]) {
        const file = result.assets[0];

        const fileObj = {
          uri: file.uri,
          name: file.name || `file_${Date.now()}.jpg`,
          type: file.mimeType || "application/octet-stream",
        };

        if (type === "id") {
          setIdFile(fileObj);
        } else if (type === "driverLicense") {
          setDriverLicenseFile(fileObj);
        }

        console.log("✅ Selected file:", fileObj);
      }
    } catch (err) {
      console.log("❌ File picking error:", err);
    }
  };

  // 🆗 FIXED: Updated handleSignUp function
  const handleSignUp = async () => {
    console.log("phone: ", value, formattedValue);
    const errors = validate(
      form.fullname,
      formattedValue,
      form.email,
      form.password,
      form.confirmPassword,
      isSelected
    );

    // 🆗 FIXED: Safe file validation
    if (!idFile) errors.push("ID file is missing.");
    if (!driverLicenseFile) errors.push("Driver License file is missing.");

    if (errors.length > 0) {
      setError(errors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      const [first, last] = form.fullname.split(" ");
      formData.append("first_name", first || "");
      formData.append("last_name", last || "");

      formData.append("phone_number", formattedValue);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("self_created", "true");
      formData.append("role", "renter");

      // 🆗 FIXED: Safe file append with correct properties
      if (idFile) {
        formData.append("national_id", {
          uri: idFile.uri,
          name: idFile.name,
          type: idFile.type || "application/octet-stream",
        });
      }

      if (driverLicenseFile) {
        formData.append("driver_license", {
          uri: driverLicenseFile.uri,
          name: driverLicenseFile.name,
          type: driverLicenseFile.type || "application/octet-stream",
        });
      }

      console.log("📤 Sending signup request...");
      const res = await api.post("user/register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Signup success:", res.data);
      setLoading(false);

      router.push({ pathname: "/profile", params: { success: true } });
    } catch (error) {
      console.log("❌ Signup error:", error.response?.data || error.message);
      setLoading(false);

      if (error.response?.data?.error) {
        setError([error.response.data.error]);
      } else {
        setError(["Signup failed. Please try again."]);
      }
    }
  };

  const handlePressTerms = async () => {
    const url =
      "https://docs.google.com/document/d/1UWnR3ZnWn6a6XCg6sFf_s2Ha63rNvf4m4llL4XY6pJE/edit?usp=drive_link";

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Try later!`);
    }
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <ScrollView style={{ backgroundColor: "white" }}>
        <View style={styles.login_con}>
          <Text style={styles.login_main_text}> {t("sign_up")} </Text>
          <Text style={{ marginTop: 10, color: "grey", fontSize: 14 }}>
            {t("sign_up_desc")}
          </Text>

          <FormField
            title={t("fullname")}
            value={form.fullname}
            handleChangeText={(e) => {
              setForm({ ...form, fullname: e });
            }}
            otherStyles={{ marginTop: 28 }}
            keyboardType="default"
            placeholder={t("fullname")}
          />
          <Text style={{ color: "red" }}>{fullnameError}</Text>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, paddingBottom: 5 }}>{t("phone")}</Text>
            <PhoneInput
              containerStyle={{
                backgroundColor: "#e7ebf0",
                borderRadius: 8,
                width: "100%",
                height: 52,
              }}
              textContainerStyle={{
                backgroundColor: "#e7ebf0",
                borderRadius: 8,
                paddingVertical: 0,
                paddingHorizontal: 0,
                height: 50,
              }}
              flagButtonStyle={{
                width: 60,
                height: 60,
              }}
              defaultValue={value}
              defaultCode="ET"
              layout="first"
              onChangeText={setValue}
              onChangeFormattedText={setFormattedValue}
              withDarkTheme
              withShadow
            />
          </View>
          <Text style={{ color: "red" }}>{phoneError}</Text>

          <View>
            {/* 🆗 File pickers */}
            <FilePickerField
              label="ID"
              file={idFile}
              setFile={setIdFile}
              pickFile={() => pickFile("id")}
            />

            <FilePickerField
              label="Driver License"
              file={driverLicenseFile}
              setFile={setDriverLicenseFile}
              pickFile={() => pickFile("driverLicense")}
            />
          </View>

          <FormField
            title={t("email")}
            value={form.email}
            handleChangeText={(e) => {
              setForm({ ...form, email: e });
            }}
            otherStyles={{ marginTop: 20 }}
            keyboardType="email-address"
            placeholder={t("email")}
          />
          <Text style={{ color: "red" }}>{emailError}</Text>

          <FormField
            title={t("password")}
            value={form.password}
            handleChangeText={(e) => {
              setForm({ ...form, password: e });
            }}
            otherStyles={{ marginTop: 20 }}
            keyboardType="default"
            secureTextEntry
            placeholder={t("password")}
          />
          <Text style={{ color: "red" }}>{passwordError}</Text>

          <FormField
            title={t("confirm_password")}
            value={form.confirmPassword}
            handleChangeText={(e) => {
              setForm({ ...form, confirmPassword: e });
            }}
            otherStyles={{ marginTop: 20 }}
            keyboardType="default"
            secureTextEntry
            placeholder={t("confirm_password")}
          />
          <Text style={{ color: "red" }}>{confirmPasswordError}</Text>

          <View style={styles.checkboxContainer}>
            <CheckBox
              style={styles.checkbox}
              onClick={() => {
                setSelection(!isSelected);
              }}
              isChecked={isSelected}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text style={styles.checkboxLabel}>
                I accept the Terms and Conditions
              </Text>
              <Link
                style={{
                  fontSize: 18,
                  color: "#393381",
                  textDecorationLine: "underline",
                }}
                href={"/terms"}
              >
                Read
              </Link>
            </View>
          </View>
          <Text style={{ color: "red" }}>{termError}</Text>

          <View style={{ marginTop: 10 }}></View>
          
          {/* 🆗 Error display */}
          {errors.length > 0 && (
            <View
              style={{
                backgroundColor: "#fde2e2",
                borderRadius: 8,
                padding: 10,
                marginBottom: 15,
                position: "relative",
              }}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {errors.map((err, index) => (
                  <Text
                    key={index}
                    style={{
                      color: "#b00020",
                      fontSize: 13,
                      marginBottom: 3,
                      fontWeight: "500",
                    }}
                  >
                    • {err}
                  </Text>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 0,
                  top: -10,
                  backgroundColor: "black",
                  borderRadius: 100,
                  width: 30,
                  height: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => setError([])}
              >
                <Ionicons name="close" size={20} color={"white"} />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity onPress={handleSignUp} style={styles.login_button}>
            <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
              {t("sign_up")}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* 🆗 FIXED: Correct loading state */}
        {isLoading && <AppLoader />}
      </ScrollView>
    </SafeAreaView>
  );
};

// 🆗 FilePickerField - Already perfect
const FilePickerField = ({ label, file, setFile, pickFile }) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 16, marginBottom: 5 }}>{label}</Text>

      {file ? (
        <View
          style={{
            position: "relative",
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: "#e0e0e0",
          }}
        >
          {file.type?.startsWith("image/") ? (
            <Image
              source={{ uri: file.uri }}
              style={{ width: "100%", height: 150 }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                backgroundColor: "black",
              }}
            >
              <MaterialIcons name="insert-drive-file" size={24} color="white" />
              <Text
                style={{
                  color: "white",
                  marginLeft: 10,
                  flexShrink: 1,
                }}
                numberOfLines={1}
              >
                {file.name}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => setFile(null)}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 15,
              padding: 3,
            }}
          >
            <Entypo name="cross" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={{
            height: 60,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
          }}
          onPress={pickFile}
        >
          <Entypo name="plus" size={37} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  registerPage_link: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  login_con: {
    margin: 15,
    minHeight: "100%",
    paddingHorizontal: 16,
  },
  top_image: {
    width: 200,
    height: 100,
    marginTop: 10,
  },
  login_main_text: {
    fontSize: 22,
    marginTop: 10,
    fontWeight: "semibold",
  },
  login_button: {
    backgroundColor: "black",
    marginBottom: 40,
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  file_con: {
    backgroundColor: "black",
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default SignUp;