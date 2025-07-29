import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/authReducer";
import { Link, router } from "expo-router";
import api from "../../redux/api";
import ModalApp from "../../components/ModalApp";
import AppLoader from "../../components/AppLoader";

const New = () => {
  const user = useSelector(selectCurrentUser);
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addressId, setAddressId] = useState("");
  // console.log(addresses);
  useEffect(() => {
    const featchAddress = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("api/v1/addresses/");
        console.log(
          "========================================================="
        );
        // console.log(res.data);
        setAddresses(res.data.results);
        setIsLoading(false);

        // router.push({ pathname: "/profile-detail", params: { success: true } });
      } catch (error) {
        setIsLoading(false);

        console.log(error);
        console.log(error.message);
        if (error.response) {
          console.log(error.response.data);
          setError(error.response.data?.detail);
        }
      }
    };
    featchAddress();
  }, []);

  useEffect(() => {
    let intervalId;
    if (message) {
      intervalId = setInterval(() => {
        setMessage("");
      }, 5000);
    }

    return () => clearInterval(intervalId);
  }, [message]);
  useEffect(() => {
    let intervalId;

    if (error) {
      intervalId = setInterval(() => {
        setError("");
      }, 5000);
    }

    return () => clearInterval(intervalId);
  }, [error]);

  const handleEmailVerfication = async () => {
    try {
      setIsLoading(true);
      const res = await api.post("api/v1/auth/email-verify/");
      console.log(res.data);
      setMessage(res.data?.message);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.log(error);
      console.log(error.message);
      if (error.response) {
        console.log(error.response.data);
        setError(error.response.data?.detail);
      }
    }
  };
  const handlePhoneVerfication = async () => {
    try {
      setIsLoading(true);
      const res = await api.post(
        "https://api.kelatibeauty.com/api/v1/auth/phone-verify/"
      );
      console.log(res.data);
      setMessage(res.data?.message);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.log(error);
      console.log(error.message);
      if (error.response) {
        console.log(error.response.data);
        setError(error.response.data?.detail);
      }
    }
  };
  const onDeleteAddress = async () => {
    setIsLoading(true);

    try {
      const res = await api.delete(`api/v1/addresses/${addressId}/`);
      // console.log(res);
      const data = addresses.filter((ad) => ad.id != addressId);
      setAddresses(data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.log(error);
      console.log(error.message);
      if (error.response) {
        console.log(error.response.data);
        setError(error.response.data?.detail);
      }
    }
  };
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <ScrollView>
        <View>
          <ModalApp
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            onDelete={onDeleteAddress}
          />

          {(message || error) && (
            <View
              style={{
                backgroundColor: error ? "#d0571b" : "#678e65",
                borderRadius: 8,
                marginTop: 20,
                marginHorizontal: 20,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: 50,
                paddingHorizontal: 10,
              }}
            >
              <Text style={{ color: "white" }}>{message || error}</Text>
            </View>
          )}
          <View style={{ marginHorizontal: 20 }}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                marginTop: 50,
                marginBottom: 10,
              }}
            >
              User Info
            </Text>
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 15, alignItems: "center" }}
              >
                <View
                  style={{
                    backgroundColor: "gray",
                    width: 60,
                    height: 60,
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
                    {new Date(user?.user?.last_login).toLocaleDateString(
                      "en-US",
                      {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
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

              <View>
                <Text style={{ fontSize: 17 }}>
                  Date joined:{" "}
                  {new Date(user?.user?.date_joined).toLocaleDateString(
                    "en-US",
                    {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </Text>
              </View>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: "lightgray",
                  marginVertical: 10,
                }}
              ></View>
              <TouchableOpacity onPress={handleEmailVerfication}>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 17 }}>
                    Email {user?.user?.email}
                  </Text>
                  <View
                    style={{
                      backgroundColor: user?.user?.email_verify
                        ? "#1a6222"
                        : "#c51717",
                      paddingVertical: 5,
                      paddingHorizontal: 15,
                      borderRadius: 5,
                    }}
                  >
                    {user?.user?.email_verify ? (
                      <Text style={{ color: "white" }}>Verified</Text>
                    ) : (
                      <Text style={{ color: "white" }}>Verify</Text>
                    )}
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
              <TouchableOpacity onPress={handlePhoneVerfication}>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 17 }}>
                    Phone Number {user?.user?.phone_number}
                  </Text>
                  <View
                    style={{
                      backgroundColor: user?.user?.phone_verify
                        ? "#1a6222"
                        : "#c51717",
                      paddingVertical: 5,
                      paddingHorizontal: 15,
                      borderRadius: 5,
                    }}
                  >
                    {user?.user?.phone_verify ? (
                      <Text style={{ color: "white" }}>Verified</Text>
                    ) : (
                      <Text style={{ color: "white" }}>Verify</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
                marginTop: 30,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    margin: 10,
                    marginBottom: 4,
                  }}
                >
                  Add new address
                </Text>
                <Text style={{ marginBottom: 10, marginHorizontal: 10 }}>
                  You can add upto 2 addresses for faster checkout
                </Text>
              </View>
              <CustomButton
                Icon={FontAwesome}
                iconName={"address-book-o"}
                name="Add Adress"
                link={"/address"}
              />
              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: "lightgray",
                  marginVertical: 10,
                }}
              ></View>

              {addresses.map((address) => {
                return (
                  <View style={{}} key={address.id}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontSize: 18, marginBottom: 10 }}>
                        Country{"  "}:{"  "}
                        {address?.country}
                      </Text>
                      <Text style={{ fontSize: 18, marginBottom: 10 }}>
                        City{"  "}:{"  "}
                        {address?.city}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontSize: 18, marginBottom: 10 }}>
                        Subcity{"  "}:{"  "}
                        {address?.subcity}
                      </Text>
                      <Text style={{ fontSize: 18, marginBottom: 10 }}>
                        Woreda{"  "}:{"  "}
                        {address?.woreda}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontSize: 18, marginBottom: 10 }}>
                        Kebele{"  "}:{"  "}
                        {address.kebele}
                      </Text>
                      <Text style={{ fontSize: 18, marginBottom: 10 }}>
                        House no{"  "}:{"  "}
                        {address.house_number}
                      </Text>
                    </View>

                    <View>
                      <Text style={{ fontSize: 18, marginBottom: 10 }}>
                        Phone Number{"  "}:{"  "}
                        {address.phone_number}
                      </Text>
                      <Text style={{ fontSize: 18, marginBottom: 10 }}>
                        Precise Location{"  "}:{"  "}
                        {address.precise_location}
                      </Text>
                    </View>
                    <Pressable
                      style={{
                        backgroundColor: "#bc4040",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                      }}
                      onPress={() => {
                        setModalVisible(true);
                        setAddressId(address.id);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Delete
                      </Text>
                    </Pressable>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderColor: "lightgray",
                        marginVertical: 10,
                      }}
                    ></View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
      {isLoading && <AppLoader />}
    </SafeAreaView>
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
export default New;

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
