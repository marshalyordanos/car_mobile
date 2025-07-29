import React, { Component, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import api from "../../redux/api";

const PurchaseHistory = () => {
  const [data, setData] = useState([]);
  const [isLodding, setLodding] = useState(false);

  const fetchData = async () => {
    setLodding(true);

    try {
      console.log("starting");
      const response = await api.get(
        "/api/v1/orders/?page=1&pageSize=10&sort=created"
      );

      setData(response.data);
      console.log(JSON.stringify(response.data, null, 2));

      setLodding(false);
    } catch (error) {
      console.log(error); //
      console.log(error?.message);
      setLodding(false);
    }
  };

  const handleNext = async () => {
    try {
      if (data.next) {
        console.log("starting");
        const response = await api.get(data.next);

        setData(response.data);
        // console.log(response.data);

        setLodding(false);
      }
    } catch (error) {
      console.log(error); //
      console.log(error?.message);
      setLodding(false);
    }
  };
  const handlePrev = async () => {
    try {
      if (data.previous) {
        console.log("starting");
        const response = await api.get(data.previous);

        setData(response.data);
        // console.log(response.data);

        setLodding(false);
      }
    } catch (error) {
      console.log(error); //
      console.log(error?.message);
      setLodding(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <View>
      {/* <Text> {JSON.stringify(data)} </Text> */}
      <View style={{ marginTop: 30 }}>
        {data.results?.map((d, i) => (
          <View
            key={i}
            style={{
              borderWidth: 1,
              marginHorizontal: 25,
              borderRadius: 5,
              padding: 15,
              marginBottom: 20,
            }}
          >
            <View style={{ justifyContent: "space-evenly" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.text}>Date: </Text>
                <Text style={styles.text2}>
                  {new Date(d.created).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.text}>Payment Method: </Text>
                <Text style={styles.text2}>{d.paymentMethod}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.text}>Status: </Text>
                <Text
                  style={{
                    paddingVertical: 4,
                    paddingHorizontal: 20,
                    backgroundColor:
                      d.payment_status == "success"
                        ? "#3B82F6"
                        : d.payment_status == "pending"
                        ? "#A855F7"
                        : "red",
                    color: "white",
                  }}
                >
                  {d.payment_status}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.text}>Delivery Type: </Text>
                <Text style={styles.text2}>{d.deliveryType}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.text}>Track number: </Text>
                <Text style={styles.text2}>{d.trackNumber}</Text>
              </View>
            </View>

            {/* <Text>{d.paymentMethod}</Text> */}
          </View>
        ))}

        <View
          style={{
            justifyContent: "flex-end",
            flexDirection: "row",
            marginHorizontal: 30,
          }}
        >
          <TouchableOpacity
            disabled={!data.previous}
            onPress={handlePrev}
            style={[
              styles.button,
              { backgroundColor: data.previous ? "black" : "lightgray" },
            ]}
          >
            <Text style={{ color: "white", fontSize: 15 }}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!data.next}
            onPress={handleNext}
            style={[
              styles.button,
              { backgroundColor: data.next ? "black" : "lightgray" },
            ]}
          >
            <Text style={{ color: "white", fontSize: 15 }}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 5,
  },
  text2: {
    fontSize: 17,
    marginVertical: 5,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    // backgroundColor: "#404040",
    color: "white",
    width: 100,
    margin: 10,
  },
});

export default PurchaseHistory;
