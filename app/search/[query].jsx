import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import ProductItem from "../../components/category/ProductItem";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/home/EmptyState";
import axios from "axios";
import { baseImage, baseurl } from "../../constants/global";
import { useSelector } from "react-redux";
import SearchInput from "../../components/home/SearchInput";
const screenWidth = Dimensions.get("window").width;

const itemWidth = (screenWidth - 10) / 2;

const Search = () => {
  const [data, setData] = useState([]);
  const lan = useSelector((state) => state.auth.lan);

  const { query } = useLocalSearchParams();
  // const { data: posts, refetch } = useAppwrite(() => searchPosts(query));
  const [isLoddingProduct, setLoddingProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const itemWidth = (screenWidth - 10) / 2;

  const searchData = async () => {
    try {
      setLoddingProduct(true);
      console.log("000000");
      const res = await axios.get(
        `https://search.kelatibeauty.com/api/search?q=${query}`
      );
      setData(res.data);
      console.log("res", res.data);
      setProducts(res.data.data);
      setLoddingProduct(false);
    } catch (error) {
      console.log(error);
      setLoddingProduct(false);
    }
  };

  useEffect(() => {
    // refetch();
    searchData();
  }, [query]);
  const handleOnendReached = async () => {
    // console.log("+++++++++++++++++");
    // try {
    //   if (data.next) {
    //     // setLastLoad(true);
    //     setLoadMore(true);
    //     // setLodding(true);
    //     let url = data.next;
    //     if (url.startsWith("http://")) {
    //       url = url.replace("http://", "https://");
    //     }
    //     const res = await axios.get(url);
    //     setProducts([...products, ...res.data.results]);
    //     setData(res.data);
    //     // setLastLoad(true);
    //     setLoadMore(false);
    //     setLoddingProduct(false);
    //   } else {
    //     setLastLoad(true);
    //     setLoadMore(false);
    //     // setLastLoad(false);
    //   }
    // } catch (err) {
    //   console.log("someeerrr", err);
    // } finally {
    //   setLastLoad(true);
    //   setLoadMore(false);
    // }
  };
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        height: "100%",
        backgroundColor: "#ffffff",
      }}
    >
      <View>
        {isLoddingProduct ? (
          <ActivityIndicator size="small" color="#393381" />
        ) : (
          <FlatList
            data={products.length > 0 ? products : []}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            numColumns={1}
            renderItem={({ item }) => (
              <View
                key={item.id}
                style={{
                  marginVertical: 0,
                  flex: 1,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("detail", { productId: item.id })
                  }
                  style={{
                    height: 170,
                    marginHorizontal: 10,
                    marginVertical: 10,
                    backgroundColor: "#ffffff",
                    borderRadius: 20,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
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
                >
                  <View
                    style={{
                      height: 170,
                      width: 170,
                      borderRadius: 20,

                      // borderWidth: 1,
                    }}
                  >
                    <Image
                      resizeMode="cover"
                      style={styles.img}
                      source={{ uri: baseImage + item?.image }}
                    />
                  </View>
                  <View
                    style={{
                      // borderWidth: 1,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{ fontSize: 16, maxWidth: 180, fontWeight: 400 }}
                    >
                      {lan == "am"
                        ? item.name.split("*+*")[1]
                        : item.name.split("*+*")[0]}
                    </Text>
                  </View>
                  {/* <Text>jk</Text> */}
                </TouchableOpacity>
              </View>
            )}
            ListHeaderComponent={() => (
              <>
                <View
                  style={{
                    display: "flex",
                    marginBottom: 24,
                    paddingHorizontal: 16,
                  }}
                >
                  <Text
                    // className="font-pmedium text-gray-100 text-sm"
                    style={{ color: "gray", fontSize: 10 }}
                  >
                    Search Results
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      // color: "white",
                      marginTop: 4,
                    }}
                  >
                    {query}
                  </Text>

                  <View className="mt-6 mb-8">
                    <SearchInput initialQuery={query} refetch={searchData} />
                  </View>
                </View>
              </>
            )}
            ListEmptyComponent={() => (
              <EmptyState
                title="No Products Found"
                subtitle="No products found for this search query"
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Search;
const styles = StyleSheet.create({
  img: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    // marginTop: 10,
    resizeMode: "cover",
  },
});
