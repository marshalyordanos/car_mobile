import { useNavigation } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const VideoCard = ({ data, lan }) => {
  const naviget = useNavigation();
  return (
    <View style={styles.con}>
      <TouchableOpacity
        onPress={() =>
          naviget.navigate("shop", {
            mainId: data.id,
            mainName: lan == "am" ? data.name : data.name,
          })
        }
        style={{
          width: "100%",
          height: 250,
          marginTop: 0,

          position: "relative",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* <View style={styles.img_con}> */}
        <Image resizeMode="cover" style={styles.img} source={data.image} />
        {/* </View> */}
        <View style={styles.image_text}>
          <Text
            style={{
              fontSize: 19,
              fontWeight: "bold",
              justifyContent: "center",
              color: "#5a8581",
              marginTop: 10,
            }}
          >
            {lan == "am" ? data.name : data.name}
          </Text>
        </View>
      </TouchableOpacity>

      {/* <View style={styles.card_con}>
        <View style={styles.card_con_sec}>
          
        </View>
      </View> */}
    </View>
  );
};

export default VideoCard;

const styles = StyleSheet.create({
  con: {
    flexDirection: "col",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#dbdbdb",

    width: "100%",
    height: 310,
    borderRadius: 20,

    // justifyContent: "space-between",
    // marginRight: 10,
  },
  card_con: {
    display: "flex",
    gap: 5,
    alignItems: "flex-start",
  },
  card_con_sec: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",

    // flex: 1,
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
  image_text: {
    // justifyContent: "center",
    // marginLeft: 20,
    // flex: 1,
    // alignContent: "center",
    // borderWidth: 1,
    marginTop: 15,

    marginLeft: 15,
    width: "100%",
  },
});
