import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
import DestinationCard from "../../components/home/DestinationCard";
import SearchInput from "../../components/home/SearchInput";
import icons from "../../constants/icons";
import images from "../../constants/images";
import {
  changeLanguageHandler,
  login,
  setcancellationPolicies,
} from "../../redux/authReducer";
import api from "../../redux/api";
import { setFavorites } from "../../redux/favoriteSlice";
const cars = [
  { id: 1, name: "Model S", price: 79999, brand: "Tesla", image: images.car1 },
  { id: 2, name: "Civic", price: 22000, brand: "Honda", image: images.car2 },
  { id: 3, name: "Mustang", price: 35000, brand: "Ford", image: images.car3 },
  { id: 4, name: "Corolla", price: 19000, brand: "Toyota", image: images.van1 },
  { id: 5, name: "A4", price: 40000, brand: "Audi", image: images.car1 },
  { id: 6, name: "Camry", price: 24000, brand: "Toyota", image: images.car2 },
];

const destinations = [
  { id: 1, name: "Adama", icon: icons.adama },
  { id: 2, name: "Addis Ababa", icon: icons.addisababa },
  { id: 3, name: "Bahirdar", icon: icons.bahirdar },
  { id: 4, name: "Aksum", icon: icons.aksum },
  { id: 5, name: "Bishoftu", icon: icons.bishoftu },
  { id: 6, name: "Diredawa", icon: icons.diredawa },
  { id: 7, name: "Gondar", icon: icons.gondar },
  { id: 8, name: "Harar", icon: icons.harar },
  { id: 9, name: "Hawassa", icon: icons.hawassa },
];

const Home = () => {
  const insets = useSafeAreaInsets();
  const [language, setLanguage] = useState("en");
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const fetchFavorites = async () => {
    try {
      const res = await api.get("users/wish-list");

      console.log("favorites: ", res.data);
      dispatch(setFavorites(res.data.data?.wishlist)); // adjust based on your API response
    } catch (error) {
      console.error("error:", error);
    } finally {
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
      // }
    }, [])
  );

  const fetchCancllectionPolicy = async () => {
    try {
      const res = await api.get("cancellation-policies?filter=userType:GUEST");
      console.log("cancellation-polsiciesl:", res.data);
      dispatch(setcancellationPolicies(res.data?.data));
    } catch (error) {
      console.log("cancellation-policies:", error);
    }
  };

  useEffect(() => {
    fetchCancllectionPolicy();
  }, []);

  const handleSearchPress = () => {
    router.push("/location-search");
  };

  const fetchData = useCallback(async () => {
    console.log("Fetching data...");
  }, []);
  const checkTheUser = useCallback(async () => {
    const data = await AsyncStorage.getItem("data");
    if (data) {
      dispatch(login(JSON.parse(data)));
    }
  }, [dispatch]);

  const getLanguage = useCallback(async () => {
    const lan = await AsyncStorage.getItem("locale");
    if (lan) {
      dispatch(changeLanguageHandler(lan));
      setLanguage(lan);
    }
  }, [dispatch, setLanguage]);

  useEffect(() => {
    fetchData();
    checkTheUser();
    getLanguage();
  }, [fetchData, checkTheUser, getLanguage]);

  const [refreshing, setRefreshing] = useState(false);

  const onReferesh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const toggleLanguage = async (lan) => {
    console.log("=====");
    if (lan === "en") {
      i18n.changeLanguage("am");
      setLanguage("am");
      dispatch(changeLanguageHandler("am"));

      await AsyncStorage.setItem("locale", "am");
    }
    if (lan === "am") {
      i18n.changeLanguage("en");
      setLanguage("en");
      dispatch(changeLanguageHandler("en"));

      await AsyncStorage.setItem("locale", "en");
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          paddingTop: insets.top,
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View style={{ backgroundColor: "white", flex: 1 }}>
          <View style={styles.staticHeaderContainer}>
            <View style={styles.topBar}>
              <View>
                <Text style={styles.mainTitle}>{t("home_mainTitle")}</Text>
                <Text style={styles.subTitle}>{t("home_subTitle")}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleLanguage(language)}>
                <View style={styles.lang_con}>
                  <Text style={styles.lang_text}>{language}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <SearchInput onPress={handleSearchPress} />
          </View>
          <FlatList
            keyExtractor={(item) => item.id}
            style={{ backgroundColor: "white" }}
            ListHeaderComponent={() => (
              <View
                style={{
                  paddingBottom: 50,
                }}
              >
                <View style={styles.occasionsContainer}>
                  <View style={styles.imageGrid}>
                    {cars.slice(0, 9).map((car) => (
                      <Image
                        key={car.id}
                        source={car.image}
                        style={styles.gridImage}
                      />
                    ))}
                  </View>
                  <Text style={styles.occasionsTitle}>
                    {t("home_occasionsTitle")}
                  </Text>
                  <Text style={styles.occasionsSubtitle}>
                    {t("home_occasionsSubtitle")}
                  </Text>
                  <TouchableOpacity
                    style={styles.exploreButton}
                    onPress={() => router.push("/shop")}
                  >
                    <Text style={styles.exploreButtonText}>
                      {t("home_exploreButton")}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* <View style={styles.carouselContainer}>
                <AirportSection t={t} onPress={() => router.push("/shop")} />
              </View> */}

                <View style={styles.carouselContainer}>
                  <Text style={styles.sectionTitle}>
                    {t("home_browseByDestination")}
                  </Text>
                  <FlatList
                    data={destinations}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <DestinationCard destination={item} />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                  />
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
  staticHeaderContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "black",
  },
  subTitle: {
    fontSize: 16,
    color: "#4b5563",
    marginTop: 4,
  },
  lang_con: {
    backgroundColor: "#1f2937",
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  lang_text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
  },

  occasionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    alignItems: "center",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  gridImage: {
    width: 100,
    height: 75,
    borderRadius: 12,
  },
  occasionsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 8,
  },
  occasionsSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  exploreButton: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  exploreButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  carouselContainer: {
    marginTop: 32,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
});
