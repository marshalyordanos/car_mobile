import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SimpleLocationDisplay = ({ latitude, longitude }) => {
  return (
    <View style={styles.locationContainer}>
      <Text style={styles.locationText}>Location:</Text>
      <Text style={styles.coordinateText}>Latitude: {latitude}</Text>
      <Text style={styles.coordinateText}>Longitude: {longitude}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  locationContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  coordinateText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default SimpleLocationDisplay;