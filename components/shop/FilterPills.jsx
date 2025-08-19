import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';

const filterOptions = [
  "Price", "Vehicle type", "Make & model", "Years", 
  "Seats", "Electric", "Deliver to me"
];

const FilterPills = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={filterOptions}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.pill}>
            <Text style={styles.pillText}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
      <TouchableOpacity style={styles.allFiltersButton}>
        <Icon name="options-outline" size={20} color="#111827" />
        <Text style={styles.allFiltersText}>All filters</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterPills;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  pill: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  allFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  allFiltersText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 6,
  },
});