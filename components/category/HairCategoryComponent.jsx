import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const HairCategoryComponent = ({ categoryData, onSelectSubcategory }) => {
  const { width: screenWidth } = Dimensions.get('window');
  const itemWidth = screenWidth / 4 - 20; // 4 items per row with some margin

  return (
    <View style={styles.container}>
      {categoryData.map((item) => (
        <TouchableOpacity 
          key={item.id}
          style={[styles.categoryItem, { width: itemWidth }]}
          onPress={() => onSelectSubcategory(item.id)}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: `https://api.kelatibeauty.com${item.image}` }} 
              style={styles.categoryImage} 
            />
          </View>
          <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 1000,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HairCategoryComponent;