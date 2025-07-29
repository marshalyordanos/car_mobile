import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import images from "../../constants/images";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

const AboutUs = () => {
  const { t, i18n } = useTranslation();

  const handlePressFacebook = async () => {
    const url = "https://www.facebook.com/kus27/";

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const handlePressInstagram = async () => {
    const url = "https://www.instagram.com/kelati_hair_and_cosmetics/";

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const handlePress = async () => {
    const url = "https://t.me/R_Kelati";

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <ScrollView>
        <View>
          <View style={styles.about_kelati}>
            <Text style={{ fontSize: 20, marginBottom: 15, fontWeight: "700" }}>
              {t("about_kelati")}
            </Text>
            <Text style={{ textAlign: "justify", color: "gray", fontSize: 17 }}>
              {t("about_kelati_desc")}
            </Text>
          </View>

          <View style={styles.about_kelati}>
            <Text style={{ fontSize: 20, marginBottom: 15, fontWeight: "700" }}>
              {t("other_title")}
            </Text>
            <Text style={{ textAlign: "justify", color: "gray", fontSize: 17 }}>
              {t("other_desc")}
            </Text>
          </View>

          <View style={styles.about_kelati}>
            <View style={styles.image_con}>
              <Image style={styles.image} source={images.mission} />
            </View>
            <Text style={{ fontSize: 20, marginBottom: 15, fontWeight: "700" }}>
              {t("mission")}
            </Text>
            <Text style={{ textAlign: "justify", color: "gray", fontSize: 17 }}>
              {t("mission_desc")}
            </Text>
          </View>

          <View style={styles.about_kelati}>
            <View style={styles.image_con}>
              <Image style={styles.image} source={images.values} />
            </View>
            <Text style={{ fontSize: 20, marginBottom: 15, fontWeight: "700" }}>
              {t("values")}
            </Text>
            <Text style={{ textAlign: "justify", color: "gray", fontSize: 17 }}>
              {t("values_desc")}
            </Text>
          </View>

          <View style={styles.about_kelati}>
            <View style={styles.image_con}>
              <Image style={styles.image} source={images.vision} />
            </View>
            <Text style={{ fontSize: 20, marginBottom: 15, fontWeight: "700" }}>
              {t("vision")}
            </Text>
            <Text style={{ textAlign: "justify", color: "gray", fontSize: 17 }}>
              {t("vision_desc")}
            </Text>
          </View>

          <View style={styles.about_kelati}>
            <Text style={{ fontSize: 20, marginBottom: 15, fontWeight: "700" }}>
              {t("why_you_love_shopping_with_us")}
            </Text>
            <Text
              style={{
                textAlign: "justify",
                color: "gray",
                marginBottom: 12,
                fontSize: 17,
              }}
            >
              {t("why_you_love_shopping_with_us_desc_one")}
            </Text>
            <Text style={{ textAlign: "justify", color: "gray", fontSize: 17 }}>
              {t("why_you_love_shopping_with_us_desc_two")}
            </Text>
          </View>

          <View style={styles.about_kelati}>
            <Text style={{ fontSize: 20, marginBottom: 15, fontWeight: "700" }}>
              {t("our_best_qualities")}
            </Text>
            <Text style={{ textAlign: "justify", color: "gray", fontSize: 17 }}>
              {t("our_best_qualities_desc")}
            </Text>
          </View>

          <View style={styles.about_kelati}>
            <Text style={{ fontSize: 20, marginBottom: 15, fontWeight: "700" }}>
              {t("unmachable_servies_that_we_offer")}
            </Text>
            <Text style={{ textAlign: "justify", color: "gray", fontSize: 17 }}>
              {t("unmachable_servies_that_we_offer_desc")}
            </Text>
          </View>

          <View
            style={[
              styles.about_kelati,
              {
                // height: 100,
                width: "auto",
                backgroundColor: "white",
                elevation: 5,
                shadowOffset: { width: 2, height: 10 },
                padding: 10,
                shadowOpacity: 1,
                shadowColor: "lightgray",
              },
            ]}
          >
            <Text style={{ fontSize: 20, marginBottom: 15, fontWeight: "700" }}>
              {t("our_best_spa")}
            </Text>
            <Text style={{ textAlign: "justify", color: "gray", fontSize: 17 }}>
              {t("our_best_spa_desc")}
            </Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                gap: 10,
                marginTop: 20,
              }}
            >
              <Text style={styles.txt_btn}>{t("spa")}</Text>
              <Text style={styles.txt_btn}>{t("massage")}</Text>
            </View>
          </View>

          <View
            style={[
              styles.about_kelati,
              {
                // height: 100,
                width: "auto",
                backgroundColor: "white",
                elevation: 5,
                shadowOffset: { width: 2, height: 10 },
                padding: 10,
                shadowOpacity: 1,
                shadowColor: "lightgray",
              },
            ]}
          >
            <Text style={{ fontSize: 20, marginBottom: 15, fontWeight: "700" }}>
              {t("hair_dressing")}
            </Text>
            <Text style={{ textAlign: "justify", color: "gray", fontSize: 17 }}>
              {t("hair_dressing_desc")}
            </Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                gap: 10,
                marginTop: 20,
              }}
            >
              <Text style={styles.txt_btn}>{t("styling")}</Text>
              <Text style={styles.txt_btn}>{t("coloring")}</Text>
            </View>
          </View>
          <View
            style={[
              styles.about_kelati,
              {
                // height: 100,
                width: "auto",
                backgroundColor: "white",
                elevation: 5,
                shadowOffset: { width: 2, height: 10 },
                padding: 10,
                shadowOpacity: 1,
                shadowColor: "lightgray",
              },
            ]}
          >
            <Text style={{ fontSize: 20, marginBottom: 15, fontWeight: "700" }}>
              {t("flawless_makeup")}
            </Text>
            <Text style={{ textAlign: "justify", color: "gray", fontSize: 17 }}>
              {t("flawless_makeup_desc")}
            </Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                gap: 10,
                marginTop: 20,
              }}
            >
              <Text style={styles.txt_btn}>{t("bridal")}</Text>
              <Text style={styles.txt_btn}>{t("casual")}</Text>
            </View>
          </View>

          <View
            style={[
              styles.about_kelati,
              {
                // height: 100,
                width: "auto",
                backgroundColor: "white",
                elevation: 5,
                shadowOffset: { width: 2, height: 10 },
                padding: 10,
                shadowOpacity: 1,
                shadowColor: "lightgray",
              },
            ]}
          >
            <Text style={{ fontSize: 20, marginBottom: 15, fontWeight: "700" }}>
              {t("skilled_nail_artists")}
            </Text>
            <Text style={{ textAlign: "justify", color: "gray", fontSize: 17 }}>
              {t("skilled_nail_artists_desc")}
            </Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                gap: 10,
                marginTop: 20,
              }}
            >
              <Text style={styles.txt_btn}>{t("gel")}</Text>
              <Text style={styles.txt_btn}>{t("shillac")}</Text>
            </View>
          </View>

          <View>
            <View
              style={{
                borderTopWidth: 3,
                borderColor: "lightgray",
                marginBottom: 15,
              }}
            ></View>
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
                marginBottom: 15,
                fontWeight: "700",
              }}
            >
              {t("social_media")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 30,
                marginBottom: 30,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity onPress={handlePressFacebook}>
                <AntDesign name="facebook-square" size={34} color="#0866FF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePressInstagram}>
                <AntDesign name="instagram" size={34} color="#FF0049" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePress}>
                <FontAwesome name="telegram" size={34} color="#14A4E7" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  about_kelati: {
    alignItems: "center",
    marginHorizontal: 25,
    marginVertical: 30,
  },
  image_con: {
    backgroundColor: "#EBF9F3",
    borderRadius: 100,
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  txt_btn: {
    backgroundColor: "#D1FAE5",
    color: "#047857",
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: 100,
  },
});
