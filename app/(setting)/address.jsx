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
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import FormField from "../../components/FormField";
import { Link, router } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import PhoneInput from "react-native-phone-number-input";
import * as Location from "expo-location";
import SelectDropdown from "react-native-select-dropdown";
import api from "../../redux/api";

const { height } = Dimensions.get("window");
const minHeight = height * 0.85;

const Address = () => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [form, setForm] = useState({
    city: "Addis Ababa",
    country: "Ethiopia",
    house_number: "",
    kebele: "",
    latitude: 0,
    longitude: 0,
    name: "",
    phone_number: "",
    precise_location: "",
    subcity: "Kirkos",
    woreda: "",
  });
  const [nameEror, setNameError] = useState("");
  const [cityError, setCityError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [subcityError, setSubcityError] = useState("");
  const [loddingLocation, setLoddingLocation] = useState(false);

  const [error, setError] = useState(null);

  const validate = (
    city,
    country,
    latitude,
    longitude,
    name,
    phone_number,
    subcity,
    type
  ) => {
    let isvalid = true;
    console.log("==========--::", form.phone_number);

    if (type == "all" || type == "city") {
      if (city == "") {
        isvalid = false;
        setCityError("Pleas provide you full city.");
        return isvalid;
      } else {
        isvalid = true;
        setCityError("");
      }
    }
    if (type == "all" || type == "phone") {
      if (
        phone_number == "" ||
        !phone_number.startsWith("251") ||
        phone_number.length != 12
      ) {
        isvalid = false;
        setPhoneError("Pleas provide a valid phone number.");
        return isvalid;
      } else {
        isvalid = true;
        setPhoneError("");
      }
    }
    if (type == "all" || type == "name") {
      if (name == "") {
        isvalid = false;
        setNameError("Pleas provide you name.");
        return isvalid;
      } else {
        isvalid = true;
        setNameError("");
      }
    }

    if (type == "all" || type == "country") {
      if (country == "") {
        isvalid = false;
        setCountryError("Pleas provide you country.");
        return isvalid;
      } else {
        isvalid = true;
        setCountryError("");
      }
    }

    if (type == "all" || type == "subcity") {
      if (subcity == "") {
        isvalid = false;
        setSubcityError("Pleas provide you subcity.");
        return isvalid;
      } else {
        isvalid = true;
        setSubcityError("");
      }
    }

    return isvalid;
  };
  const getLocationHandler = async () => {
    try {
      console.log("----------");
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("----------", status);

      if (status !== "granted") {
        return;
      }
      setLoddingLocation(true);
      let currentLocation = await Location.getCurrentPositionAsync({});
      console.log("currentLocation", currentLocation);
      setForm({
        ...form,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setLoddingLocation(false);
    } catch (error) {
      console.log("Error", error);
      setLoddingLocation(false);
      setError(error.message);
    }
  };
  const handleAddAddress = async () => {
    const isValid = validate(
      form.city,
      form.country,
      form.latitude,
      form.longitude,
      form.name,
      form.phone_number,
      form.subcity,
      "all"
    );

    if (isValid) {
      console.log(form);
      try {
        const res = api.post("/api/v1/addresses/", form);
        router.push({
          pathname: "/profile-detail",
          params: { success: false },
        });
      } catch (error) {
        console.log(error);
        console.log(error.message);
        if (error.response) {
          setError(error.response.data?.error);
        }
      }
    }
  };
  return (
    // <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.login_con}>
          <FormField
            title="Name*"
            value={form.name}
            handleChangeText={(e) => {
              validate(
                form.city,
                form.country,
                form.latitude,
                form.longitude,
                e,
                form.phone_number,
                form.subcity,
                "name"
              );
              setForm({ ...form, name: e });
            }}
            otherStyles={{ marginTop: 0 }}
            keyboardType="email-address"
            placeholder={"Home/Office"}
          />

          <Text style={{ color: "red" }}>{nameEror}</Text>

          <Text style={{ fontSize: 17 }}>Country*</Text>
          <SelectDropdown
            data={["Ethiopia"]}
            defaultValue={"Ethiopia"}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              validate(
                form.city,
                selectedItem,
                form.latitude,
                form.longitude,
                form.name,
                form.phone_number,
                form.subcity,
                "country"
              );

              setForm({ ...form, country: selectedItem });
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.field_con}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem) || "Select yor country"}
                  </Text>
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && { backgroundColor: "#D2D9DF" }),
                  }}
                >
                  {/* <Icon
                      name={item.icon}
                      style={styles.dropdownItemIconStyle}
                    /> */}
                  <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
          <Text style={{ color: "red" }}>{countryError}</Text>

          <Text style={{ fontSize: 17 }}>City*</Text>
          <SelectDropdown
            data={["Addis Ababa", "Bahirdar"]}
            defaultValue={"Addis Ababa"}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              validate(
                selectedItem,
                form.country,
                form.latitude,
                form.longitude,
                form.name,
                form.phone_number,
                form.subcity,
                "city"
              );

              setForm({ ...form, country: selectedItem });
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.field_con}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem) || "Select yor country"}
                  </Text>
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && { backgroundColor: "#D2D9DF" }),
                  }}
                >
                  {/* <Icon
                      name={item.icon}
                      style={styles.dropdownItemIconStyle}
                    /> */}
                  <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
          <Text style={{ color: "red" }}>{cityError}</Text>

          <Text style={{ fontSize: 17 }}>Sybcity*</Text>
          <SelectDropdown
            data={[
              "Addis Ketema",
              "Akaki Kaliti",
              "Arada",
              "Bole",
              "Gulele",
              "Kirkos",
              "Kolfe Keranyo",
              "Lemi Kura",
              "Lideta",
              "Nifas Silk",
              "Yeka",
              "other",
            ]}
            defaultValue={"Kirkos"}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              validate(
                form.city,
                form.country,
                form.latitude,
                form.longitude,
                form.name,
                form.phone_number,
                selectedItem,
                "subcity"
              );

              setForm({ ...form, country: selectedItem });
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.field_con}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem) || "Select yor country"}
                  </Text>
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && { backgroundColor: "#D2D9DF" }),
                  }}
                >
                  {/* <Icon
                      name={item.icon}
                      style={styles.dropdownItemIconStyle}
                    /> */}
                  <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
          <Text style={{ color: "red" }}>{subcityError}</Text>

          <FormField
            title="Woreda*"
            value={form.woreda}
            handleChangeText={(e) => {
              setForm({ ...form, woreda: e });
            }}
            otherStyles={{ marginTop: 0 }}
            keyboardType="email-address"
            placeholder={"woreda"}
          />

          <FormField
            title="Kebele*"
            value={form.kebele}
            handleChangeText={(e) => {
              setForm({ ...form, kebele: e });
            }}
            otherStyles={{ marginTop: 0 }}
            keyboardType="email-address"
            placeholder={"kebele"}
          />

          <FormField
            title="Precise Location*"
            value={form.precise_location}
            handleChangeText={(e) => {
              setForm({ ...form, precise_location: e });
            }}
            otherStyles={{ marginTop: 0 }}
            keyboardType="email-address"
            placeholder={"Precise Location"}
          />

          <FormField
            title="House Number*"
            value={form.house_number}
            handleChangeText={(e) => {
              setForm({ ...form, house_number: e });
            }}
            otherStyles={{ marginTop: 0 }}
            keyboardType="email-address"
            placeholder={"house number"}
          />

          {/* <TouchableOpacity
            onPress={getLocationHandler}
            style={styles.get_location}
          >
            <Text style={{ color: "white", fontSize: 24, textAlign: "center" }}>
              Get Location
            </Text>
          </TouchableOpacity>
          {loddingLocation ? (
            <ActivityIndicator style={{ marginVertical: 10 }} />
          ) : (
            <View style={{ margin: 10, fontSize: 17 }}>
              <Text style={{ fontSize: 17 }}>Latitude: {form.latitude}</Text>
              <Text style={{ marginVertical: 5, fontSize: 17 }}>
                Longitude: {form.longitude}
              </Text>
            </View>
          )} */}

          <View style={{ marginTop: 0 }}>
            <Text>Phone</Text>
            <PhoneInput
              containerStyle={{ borderWidth: 1, width: "100%" }}
              value={form.phone_number}
              defaultCode="ET"
              layout="first"
              onChangeText={(text) => {
                console.log(text);
              }}
              onChangeFormattedText={(text) => {
                console.log("phone: ", text);
                validate(
                  form.city,
                  form.country,
                  form.latitude,
                  form.longitude,
                  form.name,
                  text.substring(1),
                  form.subcity,
                  "phone"
                );
                setForm({ ...form, phone_number: text.substring(1) });
                validate(
                  form.city,
                  form.country,
                  form.latitude,
                  form.longitude,
                  form.name,
                  text.substring(1),
                  form.subcity,
                  "phone"
                );
                // setFormattedValue(text);
              }}
              // withDarkTheme
              // withShadow
              // autoFocus
            />
          </View>
          <Text style={{ color: "red" }}>{phoneError}</Text>

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
            onPress={handleAddAddress}
            style={styles.login_button}
          >
            <Text style={{ color: "white", fontSize: 24, textAlign: "center" }}>
              Add Address
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    // </SafeAreaView>
  );
};

export default Address;

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
  get_location: {
    backgroundColor: "#5A8581",
    // marginVertical: 20,
    padding: 15,
    borderRadius: 10,
    marginTop: 15,

    justifyContent: "center",
  },
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  field_con: {
    // width: "100%",
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: "whitesmoke",
    borderWidth: 1,
    marginRight: 0,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",

    alignItems: "center",
  },
});
