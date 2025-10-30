import { Stack, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "../../constants/Colors";
import images from "../../constants/images";

function LogoTitle() {
  return <Image style={styles.image} source={{ uri: images.back }} />;
}

const AppLayout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="my-booking"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 5,
                // borderWidth: 1,
                flex: 1,
              }}
              onPress={router.back}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.dark} />
              <Text style={{ fontSize: 20 }}>Bookings</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="booking-detail"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 5,
                // borderWidth: 1,
                flex: 1,
              }}
              onPress={router.back}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.dark} />
              <></>
              <Text style={{ fontSize: 20 }}>Bookings detail</Text>
            </TouchableOpacity>
          ),
        }}
      />
      {/* <Stack.Screen name="index" options={{headerShown:false}}  /> */}
    </Stack>
  );
};

export default AppLayout;

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
