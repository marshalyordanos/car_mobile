import {
  Alert,
  Dimensions,
  Image,
  // SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import FormField from "../../components/FormField";
import {
  Link,
  router,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import AppLoader from "../../components/AppLoader";
import axios from "axios";
import {
  AntDesign,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectCurrentUser } from "../../redux/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../redux/api";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import Colors from "../../constants/Colors";

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
      {!login || user ? (
        <SafeAreaView style={styles.container}>
          <View style={{ backgroundColor: "#f1f1f1", flex: 1 }}>
            <ScrollView style={{ height: "100%" }}>
              <ProfileHome
                t={t}
                setLoding={setLoding}
                lan={language}
                user={user}
                setLogin={setLogin}
              />
            </ScrollView>
            {isLoadding && <AppLoader />}
          </View>
        </SafeAreaView>
      ) : (
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
      )}
    </>
  );
};

const ProfileHome = ({ user, t, setLogin, setLoding, lan }) => {
  const dispatch = useDispatch();

  console.log("user", JSON.stringify(user, null, 2));
  return (
    <View style={{ marginHorizontal: 20 }}>
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          marginTop: 50,
          marginBottom: 10,
        }}
      >
        {t("profile")}
      </Text>
      {user && (
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "gray",
                width: 60,
                height: 60,
                // borderRadius: "100%",
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome6 name="user-tie" size={40} color="white" />
            </View>
            <View>
              <Text style={{ fontSize: 18, marginBottom: 3 }}>
                {user?.user?.full_name}
              </Text>
              <Text>
                Last Login:{" "}
                {new Date(user?.user?.last_login).toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>

          <View
            style={{
              borderBottomWidth: 1,
              borderColor: "lightgray",
              marginVertical: 10,
            }}
          ></View>

          <CustomButton
            Icon={MaterialCommunityIcons}
            iconName={"account-details-outline"}
            name={t("detail")}
            link={"/profile-detail"}
          />
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: "lightgray",
              marginVertical: 10,
            }}
          ></View>

          <CustomButton
            Icon={MaterialCommunityIcons}
            iconName={"account-details-outline"}
            name={t("purchase_history")}
            link={"/purchase-history"}
          />
        </View>
      )}

      <View
        style={{
          backgroundColor: "white",
          padding: 10,
          borderRadius: 10,
          marginTop: 30,
        }}
      >
        <CustomButton
          Icon={MaterialCommunityIcons}
          iconName={"car-traction-control"}
          name={t("track_order")}
          link={"/track-order"}
        />
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "lightgray",
            marginVertical: 10,
          }}
        ></View>
        <CustomButton
          Icon={SimpleLineIcons}
          iconName={"question"}
          name={t("check_item")}
          link={"/check-item"}
        />
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "lightgray",
            marginVertical: 10,
          }}
        ></View>

        <CustomButton
          Icon={FontAwesome5}
          iconName={"check-circle"}
          name={t("order_confirmation")}
          link={"/order-confirmation"}
        />
      </View>

      <View
        style={{
          backgroundColor: "white",
          padding: 10,
          borderRadius: 10,
          marginTop: 30,
        }}
      >
        <CustomButton
          Icon={AntDesign}
          iconName={"message1"}
          name={t("about_us")}
          link={"/about"}
        />
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "lightgray",
            marginVertical: 10,
          }}
        ></View>
        <CustomButton
          Icon={AntDesign}
          iconName={"phone"}
          name={t("contact_us")}
          link="/contact"
        />
      </View>
      {user && (
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
            marginTop: 30,
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.removeItem("data");
              dispatch(logout());
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
              >
                <Text
                  style={{ fontSize: 20, marginBottom: 3, color: "#d03333" }}
                >
                  {t("logout")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: "lightgray",
              marginVertical: 10,
            }}
          ></View>
          <TouchableOpacity
            onPress={async () => {
              Alert.alert(
                "Delete Account",
                "Are you sure you want to delete you account",

                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: async () => {
                      console.log("OK Pressed");
                      try {
                        setLoding(true);

                        const res = await api.post("api/v1/auth/users/delete/");
                        await AsyncStorage.removeItem("data");
                        dispatch(logout());
                        setLoding(false);
                      } catch (error) {
                        setLoding(false);

                        console.log(err);
                      }
                    },
                  },
                ]
              );
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
              >
                <Text
                  style={{ fontSize: 20, marginBottom: 3, color: "#d03333" }}
                >
                  {t("delete_account")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {!user && (
        <TouchableOpacity
          onPress={() => setLogin(true)}
          style={{
            width: "100%",
            backgroundColor: "#393381",
            paddingVertical: 15,
            paddingHorizontal: 15,
            marginTop: 50,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "white",
              textAlign: "center",
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      )}
    </View>
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
  const BASE_URL = "https://api.kelatibeauty.com";

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
      <TouchableOpacity
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
        }}
        onPress={() => setLogin(false)}
      >
        <Ionicons name="arrow-back" size={35} color={Colors.dark} />
        <Text>Profile</Text>
      </TouchableOpacity>
      <Image
        style={styles.top_image}
        source={images.KelatiLogo}
        resizeMode="contain"
      />
      <Text style={styles.login_main_text}>{t("sign_in")} </Text>
      <Text style={{ marginTop: 10, color: "grey", fontSize: 14 }}>
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
        otherStyles={{ marginTop: 28 }}
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
    fontSize: 22,
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
