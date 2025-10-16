import axios from "axios";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import CarRentalDetail from "../../components/car/car-rental-detail";
import api from "../../redux/api";

export default function DetailPage() {
  const navigation = useNavigation();
  const { id, name } = useLocalSearchParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Search params:", { id, name });

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchCar = async () => {
      try {
        console.log("fetchCar started");
        // Validate id early
        if (!id || typeof id !== "string") {
          throw new Error("Invalid or missing car ID");
        }

        console.log("Fetching car with id:", id);
        const carResponse = await api.get(`/cars/${id}`, {
          cancelToken: source.token,
        });
        const carData = carResponse.data || {};
        console.log("Car response:", carData);
        if (
          !carData.success ||
          !carData.data ||
          typeof carData.data !== "object"
        ) {
          throw new Error(carData.message || "Invalid car data structure");
        }
        const apiCar = carData.data;

        // Fetch reviews
        const reviewsResponse = await api.get(`/reviews/car/${id}`, {
          cancelToken: source.token,
        });
        const reviewsData = reviewsResponse.data || {};
        console.log("Reviews response:", reviewsData);
        const reviews = Array.isArray(reviewsData.data) ? reviewsData.data : [];

        // Compute car name
        let carName = name || "";
        if (!carName || carName === (apiCar.year || "").toString()) {
          let makeName = apiCar.carType || apiCar.makeId || "Vehicle";
          let modelName = apiCar.description || apiCar.modelId || "";
          try {
            const [makeResponse, modelResponse] = await Promise.all([
              api
                .get(`/makes/${apiCar.makeId}`, { cancelToken: source.token })
                .catch(() => ({ data: { success: false } })),
              api
                .get(`/models/${apiCar.modelId}`, { cancelToken: source.token })
                .catch(() => ({ data: { success: false } })),
            ]);
            console.log("Make response:", makeResponse.data);
            console.log("Model response:", modelResponse.data);

            if (makeResponse.data.success && makeResponse.data.data?.name) {
              makeName = makeResponse.data.data.name;
            }
            if (modelResponse.data.success && modelResponse.data.data?.name) {
              modelName = modelResponse.data.data.name;
            }
          } catch (err) {
            console.warn("Failed to fetch make/model names:", err.message);
          }
          carName = `${makeName} ${modelName} ${apiCar.year || ""}`.trim();
        }

        if (!carName || carName === (apiCar.year || "").toString()) {
          carName = `Vehicle ${apiCar.year || ""}`.trim();
        }

        // Map reviews
        const mappedReviews = Array.isArray(reviews)
          ? reviews.map((review) => ({
              revieweeId: review.revieweeId || null,
              reviewerId: review.reviewerId || null,
              type: review.type || "unknown",
              carId: review.carId || id,
              rating: Number(review.rating) || 0,
              comment: review.comment || "No comment",
            }))
          : [];

        // Map car data
        const mappedCar = {
          name: carName || "Unknown Vehicle",
          owner: apiCar.hostId || "Unknown",
          image:
            Array.isArray(apiCar.photos) && apiCar.photos.length > 0
              ? apiCar.photos
              : ["https://via.placeholder.com/150"],
          location: apiCar.location?.city || apiCar.location || "Not specified",
          tripStart: null,
          tripEnd: null,
          rating: Number(apiCar.average_rating) || 0,
          trips: Number(apiCar.trips) || 0,
          trim: apiCar.description || "N/A",
          year: apiCar.year || "Unknown",
          color: apiCar.color || "Not specified",
          licensePlate: apiCar.licensePlate || "Not specified",
          vin: apiCar.vin || "Not specified",
          mileage: Number(apiCar.mileage) || 0,
          dailyRate: Number(apiCar.dailyRate || apiCar.rentalPricePerDay) || 0,
          longTermDiscount: Number(apiCar.longTermDiscount) || 0,
          seatingCapacity: apiCar.seatingCapacity || "Not specified",
          ecoFriendly: apiCar.ecoFriendly || "Not specified",
          carType: apiCar.carType || "Not specified",
          cancellation: {
            title: "Not specified",
            desc: "No details available",
          },
          payment: { title: "Not specified", desc: "No details available" },
          miles: {
            title: `${Number(apiCar.mileageLimit) || 0} miles included`,
            desc: "Per day",
          },
          insurance: {
            provider: apiCar.insurance?.provider || "Not specified",
          },
          features: Array.isArray(apiCar.features)
            ? apiCar.features.map((f) => ({
                icon: "check-circle",
                text: f || "Unknown feature",
              }))
            : [],
          safetyFeatures: Array.isArray(apiCar.safety) ? apiCar.safety : [],
          connectivity: Array.isArray(apiCar.connectivity)
            ? apiCar.connectivity
            : [],
          convenienceFeatures: Array.isArray(apiCar.convenienceFeatures)
            ? apiCar.convenienceFeatures
            : [],
          peaceOfMindFeatures: Array.isArray(apiCar.peaceOfMindFeatures)
            ? apiCar.peaceOfMindFeatures
            : [],
          ratingCategories: Array.isArray(apiCar.ratingCategories)
            ? apiCar.ratingCategories
            : [],
          reviews: mappedReviews,
          ratingCount: mappedReviews.length || Number(apiCar.review_count) || 0,
          host: {
            name: apiCar.hostId || "Unknown Host",
            rating: Number(apiCar.host?.rating) || 0,
            info: apiCar.host?.info || "No info available",
            image: apiCar.host?.image || null,
          },
          rules: Array.isArray(apiCar.rules)
            ? apiCar.rules.map((r) => ({
                title: r || "Unknown rule",
                desc: "No description available",
              }))
            : [],
          price: Number(apiCar.rentalPricePerDay) || 0,
          transmission: apiCar.transmission || "Not specified",
        };

        console.log("Mapped car:", mappedCar);
        setCar(mappedCar);
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

    // Wrap with timeout
    const fetchCarWithTimeout = async () => {
      try {
        console.log("Starting fetch with 15s timeout");
        await Promise.race([
          fetchCar(),
          new Promise((_, reject) =>
            setTimeout(() => {
              console.log("Timeout triggered after 15s");
              reject(new Error("Request timed out"));
            }, 15000)
          ),
        ]);
      } catch (err) {
        console.error("Fetch timeout or error:", err.message);
        setError(err.message || "Failed to fetch car details");
        setLoading(false);
      }
    };

    fetchCarWithTimeout();

    return () => {
      console.log("Cleaning up useEffect");
      source.cancel("Component unmounted");
    };
  }, [id, name]);
  //
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color="#2e2e2e" />
        <Text style={{ color: "#2f2f2f", fontSize: 18, marginTop: 10 }}>
          Loading...
        </Text>
      </View>
    );
  }
  if (error || !car) {
    console.log("Showing error screen:", error, "car:", car);
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Text style={{ color: "black", fontSize: 18, marginBottom: 20 }}>
          {error || "Car not found"}
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: "#469E70", padding: 10, borderRadius: 8 }}
          onPress={() => {
            console.log("Returning to shop");
            router.replace("/shop");
          }}
        >
          <Text style={{ color: "#000000", fontWeight: "bold" }}>
            Return to Shop
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  // return (
  //   <View>
  //     <Text>csjklm</Text>
  //     <Text>csjklm</Text>
  //     <Text>csjklm</Text>
  //     <Text>csjklm</Text>
  //     <Text>csjklm</Text>
  //     <Text>csjklm</Text>
  //   </View>
  // );
  // Remove header
  // useEffect(() => {
  //   navigation.setOptions({
  //     headerShown: false,
  //   });
  // }, [navigation]);

  // Handle user state

  console.log("Current state:", { loading, error, car: car?.name });

  console.log("Rendering CarRentalDetail with car:", car.name);
  return <CarRentalDetail car={car} />;
}
