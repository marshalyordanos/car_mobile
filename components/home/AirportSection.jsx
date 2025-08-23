import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import images from "../../constants/images";

const AirportSection = ({ t, onPress }) => {
  return (
    <View style={styles.container}>
      <Image source={images.airportPickup} style={styles.illustration} />

      <Text style={styles.title}>{t("home_airportTitle")}</Text>
      <Text style={styles.subtitle}>{t("home_airportSubtitle")}</Text>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{t("home_airportButton")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AirportSection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: "center",
    backgroundColor: "#f9fafb",
    marginHorizontal: 20,
    borderRadius: 16,
  },
  illustration: {
    width: 250,
    height: 150,
    marginBottom: 24,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
