import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";

const zoomIn = {
  0: {
    scale: 0.8,
  },
  1: {
    scale: 0.93,
  },
};

const zoomOut = {
  0: {
    scale: 0.93,
  },
  1: {
    scale: 0.8,
  },
};

const CardItem = ({ active, item, lan }) => {
  const viewableItemsChange = () => {};
  const navigation = useNavigation();
  return (
    <Animatable.View
      style={{ marginRight: 0 }}
      animation={active == item.id ? zoomIn : zoomOut}
      duration={500}
    >
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("detail", { productId: item.id })}
          style={{
            height: 350,
            width: 270,
            // borderWidth: 1,
            backgroundColor: "#ffffff",
            borderRadius: 20,
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
          <View>
            <View
              style={{
                height: 250,
                width: 270,
                borderRadius: 20,

                // borderWidth: 1,
              }}
            >
              <Image
                resizeMode="cover"
                style={styles.img}
                source={item.image}
              />
            </View>
            <View
              style={{
                // borderWidth: 1,
                paddingHorizontal: 10,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: 400 }}>
                {lan == "am" ? item.name : item.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Text style={{ fontSize: 18 }}>
                  {lan == "am" ? item.brand : item.brand}
                </Text>
                <Text style={{ fontSize: 18, color: "#5A8581" }}>
                  {item.price} {lan == "am" ? "ብር" : "ETB"}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
};

const CategoryCard = ({ posts, isLoadding, lan }) => {
  const [active, setActive] = useState(posts[0]);
  const viewableItemsChange = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActive(viewableItems[0].key);
    }
  };
  return (
    <FlatList
      //   style={{ , flex: 1 }}
      data={posts}
      keyExtractor={(item) => item.id}
      horizontal
      onViewableItemsChanged={viewableItemsChange}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <CardItem lan={lan} item={item} active={active} />
      )}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 270 }}
    />
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  card: {
    // width: 160,
    // height: 120,
    borderRadius: 15,
    backgroundColor: "lightgray",
    // margin: 10,
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
});
