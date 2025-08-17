import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DestinationCard = ({ destination }) => {
  const handleDestinationPress = () => {
    console.log("Navigating to destination:", destination.name);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleDestinationPress}>
      <View style={styles.iconContainer}>
        <Image source={destination.icon} style={styles.imageIcon} />
      </View>
      <Text style={styles.name}>{destination.name}</Text>
    </TouchableOpacity>
  );
};

export default DestinationCard;

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 140,
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  imageIcon: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
