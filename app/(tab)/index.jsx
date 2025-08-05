import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import CategoryCard from "../../components/home/CategoryCard";
import SearchInput from "../../components/home/SearchInput";
import VideoCard from "../../components/home/VideoCard";
import icons from "../../constants/icons";
import images from "../../constants/images";
import { changeLanguageHandler, login } from "../../redux/authReducer";
import { cartLocalstorage } from "../../redux/cartReducer";

const cars = [
  { id: 1, name: "Model S", price: 79999, brand: "Tesla", image: images.car1 },
  { id: 2, name: "Civic", price: 22000, brand: "Honda", image: images.car2 },
  { id: 3, name: "Mustang", price: 35000, brand: "Ford", image: images.car3 },
  { id: 4, name: "Corolla", price: 19000, brand: "Toyota", image: images.van1 },
  { id: 5, name: "A4", price: 40000, brand: "Audi", image: images.car1 },
  { id: 6, name: "Camry", price: 24000, brand: "Toyota", image: images.car2 },
];
// import { RefreshControl } from "react-native-gesture-handler";
const Home = () => {
  const insets = useSafeAreaInsets();

  const [data, setData] = useState([]);
  const [isLodding, setLodding] = useState(false);
  const [isLoddingProduct, setLoddingProduct] = useState(false);
  const [language, setLanguage] = useState("en");
  const dispatch = useDispatch();
  const [featured, setFeatured] = useState([]);
  const { t, i18n } = useTranslation();
  const checkTheUser = async () => {
    const data = await AsyncStorage.getItem("data");
    dispatch(login(JSON.parse(data)));
  };
  const navigation = useNavigation();
  const fetchData = async () => {
    setLodding(true);
    setLoddingProduct(true);
    try {
      // const res = await axios.get(
      //   "https://localhost:8000/api/v1/products/?page=1&is_featured=true"
      // );

      setFeatured(cars);
      setLoddingProduct(false);

      // const response = await axios.get(
      //   "https://localhost:8000/api/v1/main-categories/?page=1&pageSize=10&sort[column]=name&sort[order]=ascend&all=true"
      // );
      setData(cars);

      setLodding(false);

      // dispatch(getMainCategories(response.data));

      // console.log("response22", res.data);
    } catch (error) {
      console.log(error); //
      console.log(error?.message);
      setLodding(false);
      setLoddingProduct(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    checkTheUser();
  }, []);
  const getLanguage = async () => {
    const lan = await AsyncStorage.getItem("locale");
    console.log("******: ", lan);
    console.log("Language: ", lan);
    if (lan) {
      dispatch(changeLanguageHandler(lan));
      setLanguage(lan);
    }
  };
  const getCart = async () => {
    const items = await AsyncStorage.getItem("items");
    const totalQuantity = await AsyncStorage.getItem("totalQuantity");
    const totalamount = await AsyncStorage.getItem("totalAmount");
    console.log("total1122", totalQuantity, totalamount);
    // await AsyncStorage.removeItem("items");
    // await AsyncStorage.removeItem("totalQuantity");
    // await AsyncStorage.removeItem("totalAmount");

    dispatch(
      cartLocalstorage({
        items: items ? JSON.parse(items) : [],
        totalQuantity: totalQuantity * 1 ? totalQuantity : 0,
        totalAmount: totalamount ? totalamount * 1 : 0,
      })
    );
  };
  useEffect(() => {
    getLanguage();
    getCart();
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const onReferesh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const toggleLanguage = async (lan) => {
    console.log("=====");
    if (lan == "en") {
      i18n.changeLanguage("am");
      setLanguage("am");
      dispatch(changeLanguageHandler("am"));

      await AsyncStorage.setItem("locale", "am");
    }
    if (lan == "am") {
      i18n.changeLanguage("en");
      setLanguage("en");
      dispatch(changeLanguageHandler("en"));

      await AsyncStorage.setItem("locale", "en");
    }
  };
  return (
    <View
      style={{
        backgroundColor: "#469E70",
        height: "100%",
      }}
    >
      <View
        style={{
          paddingTop: insets.top,
          flex: 1,
        }}
      >
        {/* <ScrollView> */}

        {/* <View > */}
        <View style={{ backgroundColor: "white", flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 15,
              paddingBottom: 20,
              marginTop: 10,
            }}
          >
            {/* <Image
            style={styles.top_image}
            source={images.KelatiLogo}
            resizeMode="contain"
          /> */}
            <Image
              source={icons.carLogo}
              resizeMode="contain"
              tintColor={"#7f1d1d"}
              style={styles.icon}
            />
            <SearchInput />
            <View>
              <TouchableOpacity onPress={() => toggleLanguage(language)}>
                <View style={styles.lang_con}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {language}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            // horizontal
            style={{ height: "100%" }}
            renderItem={({ item }) => <></>}
            ListHeaderComponent={() => (
              <View
                style={{
                  marginVertical: 0,
                  marginHorizontal: 15,
                  // borderWidth: 1,
                  height: "100%",
                }}
              >
                <View style={styles.top}>
                  <View style={{}}>
                    {/* <Text style={{ fontSize: 13, color: "white" }}>
                    {t("welcome_back")}
                  </Text> */}
                    <Text
                      style={{
                        fontSize: language == "am" ? 18 : 25,
                        color: "#5A8581",
                        fontFamily: "Play",
                        fontWeight: 700,
                      }}
                    >
                      {t("hero_title1")}
                    </Text>
                    {/* <Text
                    style={{
                      fontSize: language == "am" ? 18 : 22,
                      // color: "white",
                    }}
                  >
                    {t("hero_title2")}
                  </Text> */}

                    <View style={{ marginTop: 10 }}>
                      <Text
                        style={{
                          fontSize: language == "am" ? 12 : 15,
                          // color: "white",
                        }}
                      >
                        {t("hero_desc1")}
                      </Text>
                      <Text
                        style={{
                          fontSize: language == "am" ? 12 : 15,
                          // color: "white",
                        }}
                      >
                        {t("hero_desc2")}
                      </Text>
                      <TouchableOpacity
                        style={styles.continueShopping}
                        onPress={() => navigation.navigate("shop")}
                      >
                        <Text style={styles.continueShoppingText}>
                          {t("shop_now")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* ************** category ******** */}

                <View style={styles.category}>
                  <Text style={styles.category_text}>
                    {" "}
                    {t("featured_froducts")}
                  </Text>

                  {isLoddingProduct ? (
                    <FlatList
                      //   style={{ , flex: 1 }}
                      data={[{ id: 1 }, { id: 2 }, { id: 4 }, { id: 3 }]}
                      keyExtractor={(item) => item.id}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <View
                          style={{
                            height: 400,
                            width: 270,
                            // borderWidth: 1,
                            backgroundColor: "#e8e8e8",
                            borderRadius: 20,
                            margin: 15,
                            // boxShadow: {
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 1,
                              height: 10,
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 20,
                            elevation: 10,
                            // },
                          }}
                        ></View>
                      )}
                      viewabilityConfig={{
                        itemVisiblePercentThreshold: 70,
                      }}
                      contentOffset={{ x: 270 }}
                    />
                  ) : (
                    <CategoryCard
                      lan={language}
                      isLoadding={isLoddingProduct}
                      posts={featured ?? []}
                    />
                  )}
                </View>

                <View>
                  <Text style={styles.category_text}>
                    {" "}
                    {t("shop_by_category")}
                  </Text>

                  {isLodding ? (
                    <View style={styles.video_card_con}>
                      {Array(8)
                        .fill(2)
                        .map((d, i) => (
                          <View
                            style={{
                              backgroundColor: "#e8e8e8",
                              flexDirection: "col",
                              marginBottom: 15,
                              borderWidth: 1,
                              borderColor: "#dbdbdb",
                              width: "100%",
                              height: 260,
                              borderRadius: 20,
                            }}
                            key={i}
                          ></View>
                        ))}
                    </View>
                  ) : (
                    <View style={styles.video_card_con}>
                      {data.map((d) => (
                        <VideoCard lan={language} key={d.id} data={d} />
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onReferesh} />
            }
          />
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 120,
    borderRadius: 15,
    backgroundColor: "lightgray",
    margin: 10,
  },
  top: {
    // marginTop: 20,
    // backgroundColor: "#469E70",
    paddingHorizontal: 20,
    borderRadius: 15,
    color: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  top_image: {
    width: 90,
    height: 90,
  },
  category: {
    width: "100%",
    flex: 1,
    paddingTop: 20,
    paddingBottom: 32,
  },
  category_text: {
    color: "#2c2c2c",
    fontSize: 19,
    marginBottom: 10,
    fontWeight: "700",
  },
  video_card_con: {
    marginTop: 0,
    // flexDirection: "row",
    // width: 120,
    flexWrap: "wrap",
    // borderWidth: 1,
    gap: 15,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lang_con: {
    borderWidth: 2,
    borderColor: "#5A8581",
    backgroundColor: "#5A8581",
    borderRadius: 4,
    height: 43,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  continueShopping: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#393381",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  continueShoppingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    width: 45,
    height: 45,
    marginHorizontal: 10,
  },
});
