import React, { useRef } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';

const filterOptions = [
  "Price", "Vehicle type", "Make & model", "Years", 
  "Seats", "Electric", "Deliver to me", "All filters"
];

const FilterPills = ({ onPillPress }) => {
  return (
     <View style={styles.container}>
      <FlatList
        data={filterOptions}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
          style={styles.pill}
          onPress={() => onPillPress(item)}>
            {item === 'All filters' && <Icon name="options-outline" size={16} color="#111827" />}
            <Text style={styles.pillText}>{item}</Text>
            {item !== 'All filters' && <Icon name="chevron-down-outline" size={16} color="#6b7280" />}
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </View>
  );
};

export default FilterPills;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    gap: 6,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
});