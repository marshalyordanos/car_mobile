import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import FormField from "../../components/FormField";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../redux/api";
import AppLoader from "../../components/AppLoader";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [emailError, setEmailError] = useState("");
  const [nameError, setnameError] = useState("");
  const [valid, setValid] = useState(false);

  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();

  useEffect(() => {
    let intervalId;

    if (error) {
      intervalId = setInterval(() => {
        setError("");
      }, 3000);
    }

    return () => clearInterval(intervalId);
  }, [error]);
  useEffect(() => {
    let intervalId;

    if (msg) {
      intervalId = setInterval(() => {
        setMsg("");
      }, 3000);
    }

    return () => clearInterval(intervalId);
  }, [msg]);

  const validate = (email, name, type) => {
    let isvalid = true;
    if (type == "all" || type == "email") {
      if (email == "") {
        isvalid = false;
        setValid(false);

        setEmailError("Plase provide your email or phone number.");
      } else {
        isvalid = true;
        setValid(true);

        setEmailError("");
      }
    }
    if (type == "all" || type == "name") {
      if (name == "") {
        isvalid = false;
        setValid(false);

        setnameError("Plase provide your name .");
      } else {
        isvalid = true;
        setValid(true);

        setnameError("");
      }
    }

    return isvalid;
  };

  const handleContact = async () => {
    const isValid = validate(form.email, form.name, "all");

    if (isValid) {
      setLoading(true);
      try {
        const res = await api.post("api/v1/contacts/", form);

        setMsg("Successfuly send");
        setError("");
        console.log(
          "___________________________________________________________"
        );
        console.log(res.data);

        setLoading(false);

        router.push({ pathname: "/profile", params: { success: true } });
      } catch (error) {
        setLoading(false);
        setMsg("");
        // console.log(error);
        // console.log(error.response);
        if (error.response) {
          setError("The email is not sent");
        }
      }
      console.log(form);
    }
  };
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView>
          <View style={styles.con}>
            <View>
              {(msg || error) && (
                <View
                  style={{
                    backgroundColor: error ? "#d44343" : "#678e65",
                    borderRadius: 8,
                    marginTop: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 50,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text style={{ color: "white" }}>{msg || error}</Text>
                </View>
              )}
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {t("constact_us_desc")}
              </Text>
              <FormField
                title={t("name")}
                value={form.name}
                handleChangeText={(e) => {
                  validate(form.email, e, "all");

                  setForm({ ...form, name: e });
                }}
                otherStyles={{ marginTop: 20 }}
                keyboardType="email-address"
                placeholder={"email or phone"}
              />

              <FormField
                title={t("email")}
                value={form.email}
                handleChangeText={(e) => {
                  validate(e, form.name, "all");
                  setForm({ ...form, email: e });
                }}
                otherStyles={{ marginTop: 20 }}
                keyboardType="email-address"
                placeholder={"email"}
              />

              <Text style={{ fontSize: 16, marginTop: 20 }}>
                {t("message")}
              </Text>
              <View style={styles.field_con}>
                {/* <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => setForm({ ...form, message: text })}
          value={form.message}
        /> */}
                <TextInput
                  multiline={true}
                  numberOfLines={4}
                  style={styles.textInput}
                  value={form.message}
                  placeholder={"message"}
                  placeholderTextColor="grays"
                  onChangeText={(text) => setForm({ ...form, message: text })}
                />
              </View>

              <TouchableOpacity
                disabled={emailError || nameError}
                onPress={handleContact}
                style={[
                  styles.login_button,
                  {
                    backgroundColor: !(emailError || nameError)
                      ? "#393381"
                      : "#e6e6e6",
                  },
                ]}
              >
                <Text
                  style={{
                    color: !(emailError || nameError) ? "white" : "gray",
                    fontSize: 24,
                    textAlign: "center",
                  }}
                >
                  {t("send")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {loading && <AppLoader />}
    </SafeAreaView>
  );
};

export default Contact;

const styles = StyleSheet.create({
  con: {
    // width: "100%",
    // justifyContent: "center",
    margin: 15,
    minHeight: "100%",
    // backgroundColor: "red",
    paddingHorizontal: "16px",
    marginVertical: 24,
  },
  login_button: {
    marginTop: 25,
    backgroundColor: "#393381",
    // marginVertical: 20,
    padding: 15,
    borderRadius: 10,

    justifyContent: "center",
  },
  field_con: {
    // width: "100%",
    // height: 60,
    paddingHorizontal: 16,
    backgroundColor: "whitesmoke",
    borderWidth: 1,
    marginRight: 0,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",

    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: "white",
    height: 100,
  },
});
