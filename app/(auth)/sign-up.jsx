import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import FormField from "../../components/FormField";
import { Link, router } from "expo-router";
import PhoneInput from "react-native-phone-number-input";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import api from "../../redux/api";
import CheckBox from "react-native-check-box";
import AppLoader from "../../components/AppLoader";
const { height } = Dimensions.get("window");
const minHeight = height * 0.85;

const SignUp = () => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isLoadding, setLoding] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    self_created: true,
  });
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
  const [fullnameEror, setFullnameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termError, setTermError] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();
  const language = useSelector((state) => state.auth.lan);
  const [isSelected, setSelection] = useState(false);
  const validate = (
    fullname,
    phone,
    email,
    password,
    confirmPassword,
    type
  ) => {
    let isvalid = true;

    if (type == "all" || type == "fullname") {
      if (fullname == "") {
        isvalid = false;
        setFullnameError("Pleas provide you full name.");
        return isvalid;
      } else {
        isvalid = true;
        setFullnameError("");
      }
    }

    if (type == "all" || type == "phone") {
      if (phone == "" || !phone.startsWith("+251") || phone.length != 13) {
        isvalid = false;
        setPhoneError("Pleas provide a valid phone number.");
        return isvalid;
      } else {
        isvalid = true;
        setPhoneError("");
      }
    }

    if (type == "all" || type == "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        isvalid = false;
        setEmailError("The email is invalid.");
        return isvalid;
      } else {
        isvalid = true;
        setEmailError("");
      }
    }
    if (type == "all" || type == "password") {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const isValidLength = password.length >= 8;

      if (!isValidLength) {
        setPasswordError("Password must be at least 8 characters long.");
        isvalid = false;
        return isvalid;
      } else if (!hasUpperCase) {
        isvalid = false;
        setPasswordError(
          "Password must contain at least one uppercase letter."
        );
        return isvalid;
      } else if (!hasSpecialChar) {
        isvalid = false;
        setPasswordError(
          "Password must contain at least one special character (!@#$%^&*)."
        );
        return isvalid;
      } else if (!hasNumber) {
        isvalid = false;
        setPasswordError("Password must contain at least one Number.");
        return isvalid;
      } else {
        isvalid = true;
        setPasswordError("");
      }
    }
    if (type == "all" || type == "confirmPassword") {
      if (password != confirmPassword || confirmPassword == "") {
        isvalid = false;
        setConfirmPasswordError("The passwords are doesn't match.");
      } else {
        isvalid = true;
        setConfirmPasswordError("");
      }
    }
    if (!isSelected) {
      setTermError("you must have aggre to terms and condtions");
      return false;
    } else {
      setTermError("");
    }

    return isvalid;
  };

  const handleSignUp = async () => {
    const isValid = validate(
      form.fullname,
      form.phone,
      form.email,
      form.password,
      form.confirmPassword,
      "all"
    );
    let cleanedNumber = form.phone.replace("+", "");
    setLoding(true);
    if (isValid) {
      console.log(form);
      try {
        const res = await api.post("api/v1/auth/jwt/signup/", {
          full_name: form.fullname,
          phone_number: cleanedNumber,
          email: form.email,
          password: form.password,
          self_created: true,
          username: cleanedNumber,
        });
        setLoding(false);

        router.push({ pathname: "/profile", params: { success: true } });
      } catch (error) {
        console.log(error);
        setLoding(false);

        console.log(error.message);
        if (error.response) {
          setError(error.response.data?.error);
        }
      }
    }
  };
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView>
          <View style={styles.login_con}>
            <Text style={styles.login_main_text}> {t("sign_up")} </Text>
            <Text style={{ marginTop: 10, color: "grey", fontSize: 14 }}>
              {t("sign_up_desc")}
            </Text>
            <FormField
              title={t("fullname")}
              value={form.fullname}
              handleChangeText={(e) => {
                validate(
                  e,
                  form.phone,
                  form.email,
                  form.password,
                  form.confirmPassword,
                  "fullname"
                );
                setForm({ ...form, fullname: e });
              }}
              otherStyles={{ marginTop: 28 }}
              keyboardType="email-address"
              placeholder={"fullname"}
            />
            <Text style={{ color: "red" }}>{fullnameEror}</Text>

            {/* <FormField
            title="Phone"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={{ marginTop: 28 }}
            keyboardType="email-address"
            placeholder={"phone"}
          /> */}

            <View style={{ marginTop: 40 }}>
              <Text>{t("phone")}</Text>
              <PhoneInput
                containerStyle={{ borderWidth: 1, width: "100%" }}
                value={form.phone}
                defaultCode="ET"
                layout="first"
                onChangeText={(text) => {
                  console.log(text);
                }}
                onChangeFormattedText={(text) => {
                  console.log("phone: ", text);
                  validate(
                    form.fullname,
                    text,
                    form.email,
                    form.password,
                    form.confirmPassword,
                    "phone"
                  );

                  setForm({ ...form, phone: text });

                  // setFormattedValue(text);
                }}
                // withDarkTheme
                // withShadow
                // autoFocus
              />
            </View>
            <Text style={{ color: "red" }}>{phoneError}</Text>

            <FormField
              title={t("email")}
              value={form.email}
              handleChangeText={(e) => {
                validate(
                  form.fullname,
                  form.phone,
                  e,
                  form.password,
                  form.confirmPassword,
                  "email"
                );

                setForm({ ...form, email: e });
              }}
              otherStyles={{ marginTop: 28 }}
              keyboardType="email-address"
              placeholder={"email"}
            />
            <Text style={{ color: "red" }}>{emailError}</Text>

            <FormField
              title={t("password")}
              value={form.password}
              handleChangeText={(e) => {
                validate(
                  form.fullname,
                  form.phone,
                  form.email,
                  e,
                  form.confirmPassword,
                  "password"
                );

                setForm({ ...form, password: e });
              }}
              otherStyles={{ marginTop: 28 }}
              keyboardType="email-address"
              placeholder={"password"}
            />
            <Text style={{ color: "red" }}>{passwordError}</Text>

            <FormField
              title={t("confirm_password")}
              value={form.confirmPassword}
              handleChangeText={(e) => {
                validate(
                  form.fullname,
                  form.phone,
                  form.email,
                  form.password,
                  e,
                  "confirmPassword"
                );

                setForm({ ...form, confirmPassword: e });
              }}
              otherStyles={{ marginTop: 28 }}
              keyboardType="email-address"
              placeholder={"Confirm Password"}
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

            <View style={{ marginTop: 20 }}></View>
            {error && (
              <View
                style={{
                  backgroundColor: "#d98989",
                  borderRadius: 8,
                  marginBottom: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: 50,
                  paddingHorizontal: 10,
                }}
              >
                <Text style={{ color: "white" }}>{error}</Text>
                <TouchableOpacity
                  style={{
                    height: 50,
                    justifyContent: "center",
                    paddingHorizontal: 10,
                  }}
                  onPress={() => setError(null)}
                >
                  <Ionicons name="close" size={20} />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              onPress={handleSignUp}
              style={styles.login_button}
            >
              <Text
                style={{ color: "white", fontSize: 24, textAlign: "center" }}
              >
                {t("sign_up")}
              </Text>
            </TouchableOpacity>
          </View>
          {isLoadding && <AppLoader />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // paddingHorizontal: 10,
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
    // width: "100%",
    // justifyContent: "center",
    margin: 15,
    minHeight: "100%",
    // backgroundColor: "red",
    paddingHorizontal: "16px",
    marginVertical: 24,
  },
  top_image: {
    width: 200,
    height: 100,
  },
  login_main_text: {
    fontSize: 22,
    marginTop: 10,
    fontWeight: "semibold",
  },
  login_button: {
    backgroundColor: "#393381",
    // marginVertical: 20,
    padding: 15,
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
});

export default SignUp;
