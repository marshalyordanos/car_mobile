import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import FormField from "../../components/FormField";
import { Link } from "expo-router";
import api from "../../redux/api";
import AppLoader from "../../components/AppLoader";
const { height } = Dimensions.get("window");
const minHeight = height * 0.85;

const Forget = () => {
  const [isLoadding, setLoding] = useState(false);

  const [form, setForm] = useState({
    email: "",
  });
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <ScrollView>
        <View style={styles.login_con}>
          {/* <Image
              style={styles.top_image}
              source={images.KelatiLogo}
              resizeMode="contain"
            /> */}
          <Text style={styles.login_main_text}>Forgot your Password? </Text>
          <Text style={{ marginTop: 10, color: "grey", fontSize: 14 }}>
            Enter your phone number or email address below and we will send you
            a link to reset your password.
          </Text>

          <FormField
            title="Phone\Emial"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={{ marginTop: 28 }}
            keyboardType="email-address"
            placeholder={"phone or email"}
          />

          <TouchableOpacity
            onPress={async () => {
              setLoding(true);
              try {
                const res = await api.post("api/v1/auth/jwt/reset-password/", {
                  phoneEmail: form.email,
                  password: form.password,
                });

                setLoding(false);

                Alert.alert(
                  "We have sent a password reset link to your phone / email address. Please check your phone / email."
                );
              } catch (error) {
                setLoding(false);

                console.log(error);
                console.log(error.response);
              }
            }}
            style={styles.login_button}
          >
            <Text style={{ color: "white", fontSize: 24, textAlign: "center" }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        {isLoadding && <AppLoader />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default Forget;
