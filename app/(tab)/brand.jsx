import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryCard from "../../components/home/CategoryCard";
import VideoCard from "../../components/home/VideoCard";
// import { RefreshControl } from "react-native-gesture-handler";
// import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/home/EmptyState";
import axios from "axios";
import { baseImage, baseurl } from "../../constants/global";
import { AlphabetList } from "react-native-section-alphabet-list";
import { Link, useLocalSearchParams } from "expo-router";
import AppLoader from "../../components/AppLoader";
import { useTranslation } from "react-i18next";

const Brand = () => {
  // const { type, id } = useLocalSearchParams();
  // console.log("||||||||||||||||", type, id);
  return <BrandMain />;
};

const BrandMain = () => {
  const [data, setData] = useState([]);
  const [featured, setFeatured] = useState([]);

  const [isLodding, setLodding] = useState(false);

  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const { t, i18n } = useTranslation();
  const language = useSelector((state) => state.auth.lan);
  console.log("brand language", language);
  const fetchData = async () => {
    setLodding(true);
    try {
      console.log("starting");
      const response = await axios.get(
        baseurl +
          "api/v1/brands/?page=1&pageSize=10&sort[column]=name&sort[order]=ascend&all=true"
      );

      setData(response.data);
      // console.log(response.data);
      setFeatured(response.data.filter((d) => d.is_featured));

      setLodding(false);
    } catch (error) {
      console.log(error); //
      console.log(error?.message);
      setLodding(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const onReferesh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
  return (
    <SafeAreaView style={{ backgroundColor: "#469E70", height: "100%" }}>
      <View style={{ backgroundColor: "#f1f1f1", flex: 1 }}>
        <View
          style={{
            height: 300,
            display: "flex",
            flexDirection: "column",
            // borderWidth: 2,
            height: "100%",
          }}
        >
          <View
            style={{
              height: 300,
            }}
          >
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              // horizontal
              style={{ height: "100%" }}
              renderItem={({ item }) => <></>}
              ListHeaderComponent={() => (
                <>
                  <View style={{ backgroundColor: "#469E70" }}>
                    <Text style={styles.main_title}> {t("brand")} </Text>
                  </View>
                  <View
                    style={{
                      marginVertical: 0,
                      marginHorizontal: 15,
                      // borderWidth: 1,
                      height: "100%",
                    }}
                  >
                    {/* ************** category ******** */}

                    <View style={styles.category}>
                      <Text style={styles.category_text}>
                        {t("featured_brands")}
                      </Text>
                      {isLodding ? (
                        <View>
                          <View
                            style={{
                              height: 130,
                              width: "100%",
                              backgroundColor: "#ededed",
                              borderRadius: 20,
                              marginRight: 50,
                              marginBottom: 20,
                            }}
                          ></View>
                          <View
                            style={{
                              height: 30,
                              width: "50%",
                              backgroundColor: "#ededed",
                              borderRadius: 10,
                              marginRight: 50,
                            }}
                          ></View>
                        </View>
                      ) : (
                        <FlatList
                          //   style={{ , flex: 1 }}
                          data={featured}
                          keyExtractor={(item) => item.id}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          renderItem={({ item }) => (
                            <View style={{ marginRight: 10 }}>
                              <CardItem lan={language} item={item} />
                            </View>
                          )}
                        />
                      )}
                    </View>
                  </View>
                </>
              )}
              // ListEmptyComponent={() => (
              //   <EmptyState subtitle={"Comming soon!"} title="No Category" />
              // )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onReferesh}
                />
              }
            />
          </View>
          {/* </View> */}
          <View
            style={{
              height: 300,
              // borderWidth: 2,
              // height: "100%",
              flex: 1,
            }}
          >
            {isLodding ? (
              <ScrollView>
                {Array(15)
                  .fill(1)
                  .map((v, i) => (
                    <View
                      key={i}
                      style={{
                        height: 30,
                        width: "100%",
                        backgroundColor: "#f1f1f1",
                        borderRadius: 10,
                        borderBottomWidth: 1,
                        borderColor: "lightgray",
                        marginRight: 50,
                        marginTop: 5,
                      }}
                    ></View>
                  ))}
              </ScrollView>
            ) : (
              <AlphabetList
                data={data.map((d) => {
                  return {
                    value: d.name,
                    key: d.id,
                  };
                })}
                indexLetterStyle={{
                  color: "#469E70",
                  fontSize: 13,
                }}
                indexContainerStyle={{
                  border: "1px solid red",
                  marginRight: 5,
                  // padding: 2,
                }}
                renderCustomItem={(item) => (
                  <Link
                    // href={"/[brand-detail]"}
                    href={{
                      pathname: "/[brand-detail]",
                      params: { id: item.key },
                    }}
                    asChild
                  >
                    <TouchableOpacity style={styles.listItemContainer}>
                      <Text style={styles.listItemLabel}>
                        {language == "am"
                          ? item.value.split("*+*")[1]
                          : item.value.split("*+*")[0]}
                      </Text>
                    </TouchableOpacity>
                  </Link>
                )}
                renderCustomSectionHeader={(section) => (
                  <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeaderLabel}>
                      {section.title}
                    </Text>
                  </View>
                )}
              />
            )}
            {isLodding && <AppLoader />}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const CardItem = ({ item, lan }) => {
  const viewableItemsChange = () => {};

  return (
    <View>
      <Link
        // href={"/[brand-detail]"}
        href={{
          pathname: "/[brand-detail]",
          params: { id: item.id },
        }}
        asChild
      >
        <TouchableOpacity
          style={{
            height: 150,
            width: 300,
            // borderWidth: 1,
            backgroundColor: "transparent",
            borderRadius: 20,
            marginRight: 50,
            // boxShadow: {

            // },
          }}
        >
          <View>
            <View
              style={{
                height: 150,
                width: 300,
                borderRadius: 20,

                // borderWidth: 1,
              }}
            >
              <Image
                resizeMode="stretch"
                style={styles.img}
                source={{
                  uri: baseImage + item.image,
                }}
              />
            </View>
            <View
              style={{
                // borderWidth: 1,
                paddingHorizontal: 10,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 400 }}>
                {lan == "am"
                  ? item.name.split("*+*")[1]
                  : item.name.split("*+*")[0]}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                {/* <Text style={{ fontSize: 16 }}>
                  {item.brand.name.split("*+*")[0]}{" "}
                </Text>
                <Text style={{ fontSize: 16, color: "#5A8581" }}>
                  {item.product_combinations[0].price} ETB{" "}
                </Text> */}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Brand;

const styles = StyleSheet.create({
  main_title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 5,
    marginLeft: 5,
    color: "white",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    width: 160,
    height: 120,
    borderRadius: 15,
    backgroundColor: "lightgray",
    margin: 10,
  },
  top: {
    marginTop: 20,
    backgroundColor: "#469E70",
    padding: 20,
    borderRadius: 15,
    color: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  top_image: {
    width: 130,
    height: 130,
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
    flexDirection: "row",
    // width: 120,
    flexWrap: "wrap",
    // borderWidth: 1,
    gap: 15,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  img_con: {
    width: "100%",
    borderWidth: 1,
    // padding: 5,
    borderRadius: 20,
    borderColor: "#5a8581",
  },
  img: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    // marginTop: 10,
    resizeMode: "contain",
  },
  sectionHeaderContainer: {
    marginVertical: 10,
    backgroundColor: "whitesmoke",
    padding: 3,
    paddingLeft: 15,
  },
  sectionHeaderLabel: {
    fontWeight: "bold",
    fontSize: 20,
  },
  listItemLabel: {
    fontSize: 16,
    marginVertical: 10,
  },
  listItemContainer: {
    borderBottomWidth: 1,
    marginLeft: 15,

    borderBottomColor: "lightgray",
  },
});
