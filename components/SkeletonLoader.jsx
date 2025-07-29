import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SkeletonLoader = () => {
  return (
    <View style={styles.container}>
      {[...Array(6)].map((_, index) => (
        <View key={index} style={styles.skeletonItem}>
          <LinearGradient
            colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  skeletonItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  gradient: {
    flex: 1,
  },
});

export default SkeletonLoader;