import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { baseImage, baseurl } from "../../constants/global";
import axios from "axios";
import ProductItem from "../../components/category/ProductItem";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";

const screenWidth = Dimensions.get("window").width;

const itemWidth = (screenWidth - 10) / 2;

const BrandDetal = () => {
  const [data, setData] = useState([]);
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);

  const [isLodding, setLodding] = useState(false);
  const [isLOadMOre, setLoadMore] = useState(false);

  const [isLoddingProduct, setLoddingProduct] = useState(false);
  const [lastLoad, setLastLoad] = useState(false);

  const { id } = useLocalSearchParams();
  const language = useSelector((state) => state.auth.lan);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      setLodding(true);
      setLoddingProduct(true);

      try {
        const response = await axios.get(baseurl + "api/v1/brands/" + id);

        setBrand(response.data);

        setLodding(false);

        const res = await axios.get(
          "https://api.kelatibeauty.com/api/v1/products/?page=1&brand__id=" + id
        );

        setProducts(res.data.results);
        setData(res.data);

        setLoddingProduct(false);
      } catch (error) {
        console.log(error); //p1
        console.log(error?.message);
        setLodding(false);
        setLoddingProduct(flase);
      }
    };

    fetchData();
  }, []);

  const handleOnendReached = async () => {
    console.log("+++++++++++++++++");
    try {
      if (data.next) {
        // setLastLoad(true);
        setLoadMore(true);

        // setLodding(true);
        let url = data.next;

        if (url.startsWith("http://")) {
          url = url.replace("http://", "https://");
        }
        const res = await axios.get(url);

        setProducts([...products, ...res.data.results]);
        setData(res.data);
        // setLastLoad(true);
        setLoadMore(false);

        setLoddingProduct(false);
      } else {
        setLastLoad(true);
        setLoadMore(false);

        // setLastLoad(false);
      }
    } catch (err) {
      console.log("someeerrr", err);
    } finally {
      setLastLoad(true);
      setLoadMore(false);
    }
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        height: "100%",
        backgroundColor: "#ffffff",
      }}
    >
      <View style={{ marginHorizontal: 15, flex: 1 }}>
        {isLodding ? (
          <View>
            <View
              style={{
                height: 40,
                width: "100%",
                backgroundColor: "#f1f1f1",
                borderRadius: 10,
                marginTop: 20,
              }}
            ></View>
            <View
              style={{
                height: 130,
                width: "100%",
                backgroundColor: "#f1f1f1",
                borderRadius: 10,
                marginTop: 20,
                marginBottom: 10,
              }}
            ></View>
          </View>
        ) : (
          <View>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.main_title}>
                {language == "am"
                  ? brand?.name.split("*+*")[1]
                  : brand?.name.split("*+*")[0]}
              </Text>
            </View>
            <View>
              <Image
                resizeMode="stretch"
                style={{ height: 150, margin: 0, padding: 0 }}
                source={{
                  uri: baseImage + brand?.image,
                }}
              />
            </View>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={{ textAlign: "center", marginVertical: 20, fontSize: 20 }}
          >
            {t("products")}
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            {t("resluts")}({data?.count})
          </Text>

          <View style={{ flex: 1 }}>
            {isLoddingProduct ? (
              <ActivityIndicator
                size="small"
                color="#393381"
                // style={styles.loadingMore}
              />
            ) : (
              <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                // horizontal
                numColumns={2}
                // style={{ height: "100%" }}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                  <View
                    key={item.id}
                    style={{
                      marginVertical: 0,
                      maxWidth: itemWidth,
                      flex: 1,
                    }}
                  >
                    {/* <Text> dd</Text> */}
                    <ProductItem item={item} />
                  </View>
                )}
                ListFooterComponent={() =>
                  data.next || isLoddingProduct ? (
                    <ActivityIndicator
                      size="small"
                      color="#393381"
                      // style={styles.loadingMore}
                    />
                  ) : null
                }
                onEndReached={handleOnendReached}
                // ListFooterComponent={() =>
                //   data.next && !lastLoad && !isLOadMOre ? (
                //     <View
                //       style={{ justifyContent: "center", alignItems: "center" }}
                //     >
                //       <TouchableOpacity
                //         style={{
                //           paddingHorizontal: 10,
                //           paddingVertical: 10,
                //           backgroundColor: "#393381",
                //           width: 100,
                //         }}
                //         onPress={handleOnendReached}
                //       >
                //         <Text style={{ color: "white" }}>Load More</Text>
                //       </TouchableOpacity>
                //     </View>
                //   ) : (isLOadMOre && !lastLoad) || isLoddingProduct ? (
                //     <ActivityIndicator
                //       size="small"
                //       color="#393381"
                //       // style={styles.loadingMore}
                //     />
                //   ) : null
                // }
                // ListHeaderComponent={() => (

                // )}
                // ListEmptyComponent={() => (
                //   <EmptyState subtitle={"Comming soon!"} title="No Category" />
                // )}
                // refreshControl={
                //   <RefreshControl refreshing={refreshing} onRefresh={onReferesh} />
                // }
              />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default BrandDetal;

const styles = StyleSheet.create({
  main_title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 5,
    // marginLeft: 5,
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
    // marginLeft: 15,

    borderBottomColor: "lightgray",
  },
});
