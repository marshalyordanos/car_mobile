import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
  Image,
  // SafeAreaView,
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
import images from "../../constants/images";
import api from "../../redux/api";
import { login, selectCurrentUser } from "../../redux/authReducer";

// const { height } = Dimensions.get("window");
// const minHeight = height * 0.85;
const Profile = () => {
  const query = useLocalSearchParams();
  const [isLoadding, setLoding] = useState(false);
  const user = useSelector(selectCurrentUser);
  const { t, i18n } = useTranslation();
  const [login, setLogin] = useState(false);
  const language = useSelector((state) => state.auth.lan);

  useFocusEffect(
    useCallback(() => {
      // This will run every time the screen is focused
      setLogin(false);
      // Return a cleanup function if needed
      // return () => {
      //   console.log('Screen is unfocused');
      // };
    }, [])
  );

  useEffect(() => {
    const featchAddress = async () => {
      try {
        const res = await api.get("api/v1/addresses/");
      } catch (error) {}
    };
    featchAddress();
  }, []);

  return (
    <>
      <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
        <ScrollView style={{ height: "100%" }}>
          <Login
            t={t}
            lan={language}
            setLoding={setLoding}
            status={query?.success}
            setLogin={setLogin}
          />
        </ScrollView>
        {isLoadding && <AppLoader />}
      </SafeAreaView>
    </>
  );
};

const CustomButton = ({ Icon, iconName, name, link }) => {
  return (
    <Link
      href={link}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      asChild
    >
      <TouchableOpacity>
        <View
          style={{
            width: "100%",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <Icon name={iconName} size={28} color="#343434" />
            <Text style={{ fontSize: 18, marginBottom: 3 }}>{name}</Text>
          </View>
          <MaterialIcons name={"arrow-forward-ios"} size={24} color="#343434" />
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const Login = ({ status, setLoding, setLogin, lan, t }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [stat, setStat] = useState(status);
  useEffect(() => {
    let intervalId;

    if (stat) {
      intervalId = setInterval(() => {
        setStat(false);
      }, 5000);
    }

    return () => clearInterval(intervalId);
  }, [stat]);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const validate = (email, password, type) => {
    let isvalid = true;
    if (type == "all" || type == "email") {
      if (email == "") {
        isvalid = false;

        setEmailError("Plase provide your email or phone number.");
      } else {
        isvalid = true;

        setEmailError("");
      }
    }
    if (type == "all" || type == "password") {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*]/.test(password);
      const isValidLength = password.length >= 8;

      if (password == "") {
        isvalid = false;

        setPasswordError("Please provide you passowrd.");
      } else {
        isvalid = true;

        setPasswordError("");
      }
    }

    return isvalid;
  };
  const BASE_URL = "https://localhost:8000";

  const handleSignIn = async () => {
    const isValid = validate(form.email, form.password, "all");

    if (isValid) {
      setLoding(true);
      try {
        const res = await api.post("api/v1/auth/jwt/signin/", {
          phoneEmail: form.email,
          password: form.password,
        });

        console.log(res.data.access);
        await AsyncStorage.setItem("data", JSON.stringify(res.data));
        dispatch(login(res.data));

        setLoding(false);

        router.push({ pathname: "/profile", params: { success: true } });
      } catch (error) {
        setLoding(false);

        console.log(error);
        console.log(error.response);
        if (error.response) {
          setError("Invalid password or phone/email");
        }
      }
      console.log(form);
    }
  };
  const router = useRouter();

  return (
    <View style={styles.login_con}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          style={styles.top_image}
          source={images.logo}
          resizeMode="contain"
        />
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.login_main_text}>{t("sign_in")} </Text>
      </View>

      <Text style={{ marginTop: 10, color: "grey", fontSize: 1 }}>
        {t("sign_desc")}
      </Text>
      <Text style={{ color: "gray" }}>
        Make sure to enter phone number in this format "251*********" (without
        the +)
      </Text>

      {status && (
        <View
          style={{
            backgroundColor: "#678e65",
            borderRadius: 8,
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 50,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ color: "white" }}>
            Registration was successful. Please log in
          </Text>
        </View>
      )}

      <FormField
        title={t("phoneEmail")}
        value={form.email}
        handleChangeText={(e) => {
          validate(e, form.password, "email");
          setForm({ ...form, email: e });
        }}
        otherStyles={{ marginTop: 0 }}
        keyboardType="email-address"
        placeholder={"email or phone"}
      />
      <Text style={{ color: "red" }}>{emailError}</Text>

      <FormField
        title={t("password")}
        value={form.password}
        handleChangeText={(e) => {
          validate(form.email, e, "password");
          setForm({ ...form, password: e });
        }}
        otherStyles={{ marginTop: 15 }}
        keyboardType="email-address"
        placeholder={"password"}
      />
      <Text style={{ color: "red" }}>{passwordError}</Text>

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
      <TouchableOpacity onPress={handleSignIn} style={styles.login_button}>
        <Text style={{ color: "white", fontSize: 24, textAlign: "center" }}>
          {t("sign_in")}
        </Text>
      </TouchableOpacity>

      <Link style={{ textAlign: "center", color: "blue" }} href={"/forget"}>
        {t("forget")}
      </Link>

      <View style={styles.registerPage_link}>
        <Text style={{ fontSize: 16 }}>
          {" "}
          {lan == "en" && "Dont't have account?"}
        </Text>
        <Link
          style={{
            fontSize: 18,
            color: "#393381",
            textDecorationLine: "underline",
          }}
          href={"/sign-up"}
        >
          {t("sign_up")}
        </Link>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#469E70",
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
    fontSize: 26,
    marginTop: 10,
    fontWeight: "semibold",
  },
  login_button: {
    backgroundColor: "#393381",
    marginVertical: 20,
    padding: 15,
    borderRadius: 10,

    justifyContent: "center",
  },
});
