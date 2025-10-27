import axios from "axios";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import CarRentalDetail from "../../components/car/car-rental-detail";
import api from "../../redux/api";

export default function DetailPage() {
  const navigation = useNavigation();
  const { id, name, photos, startDate, endDate, selectedLocation } =
    useLocalSearchParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("Search parasdlsaams:", { id, name, photos });

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchCar = async () => {
      try {
        console.log("fetchCar started");
        if (!id || typeof id !== "string") {
          throw new Error("Invalid or missing car ID");
        }

        setLoading(true);

        console.log("Fetching car with id:", id);
        const params = { startDate, endDate };
        const carResponse = await api.get(`/cars/${id}`, { params: params });
        const carData = carResponse.data.data || {};
        console.log("Car response:", carData?.totalPrice);

        setCar(carData);
        console.log("fetchCar completed successfully");
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request cancelled");
          return;
        }
        console.error("Error in fetchCar:", err.message);
        setError(err.message || "Failed to fetch car details");
      } finally {
        console.log("fetchCar finally block - setting loading to false");
        setLoading(false);
      }
    };

    fetchCar();
    return () => {
      console.log("Cleaning up useEffect");
      source.cancel("Component unmounted");
    };
  }, [id, name]);

  // if (loading) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: "center",
  //         alignItems: "center",
  //         backgroundColor: "white",
  //       }}
  //     >
  //       <ActivityIndicator size="large" color="#2e2e2e" />
  //       <Text style={{ color: "#2f2f2f", fontSize: 18, marginTop: 10 }}>
  //         Loading...
  //       </Text>
  //     </View>
  //   );
  // }
  // if (error || !car) {
  //   console.log("Showing error screen:", error, "car:", car);
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: "center",
  //         alignItems: "center",
  //         backgroundColor: "white",
  //       }}
  //     >
  //       <Text style={{ color: "black", fontSize: 18, marginBottom: 20 }}>
  //         {error || "Car not found"}
  //       </Text>
  //       <TouchableOpacity
  //         style={{ backgroundColor: "#469E70", padding: 10, borderRadius: 8 }}
  //         onPress={() => {
  //           console.log("Returning to shop");
  //           router.replace("/shop");
  //         }}
  //       >
  //         <Text style={{ color: "#000000", fontWeight: "bold" }}>
  //           Return to Shop
  //         </Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  // console.log("Current state:", { loading, error, car });
  console.log("Rendering CarRentalDetail with car:", car);
  return (
    <CarRentalDetail
      endDate={endDate}
      startDate={startDate}
      loading={loading}
      name={name}
      photos={JSON.parse(photos)}
      car={car}
      selectedLocation={selectedLocation}
    />
  );
}
