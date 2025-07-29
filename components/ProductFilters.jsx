import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Platform } from 'react-native';
import Checkbox from 'expo-checkbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const ProductFilters = ({ t, onApplyFilters, category, subcategory, selectedCategoryId, selectedSubcategoryId }) => {
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const priceRanges = [
    { label: 'Under 1,000', min: 0, max: 1000 },
    { label: '1,000 - 2,500', min: 1000, max: 2500 },
    { label: '2,500 - 4,000', min: 2500, max: 4000 },
    { label: '4,000 - 5,500', min: 4000, max: 5500 },
    { label: 'Over 5,500', min: 5500, max: Infinity },
  ];

  const handleCheckboxChange = (index) => {
    setSelectedRanges((prevRanges) => {
      const newRanges = [...prevRanges];
      if (newRanges.includes(index)) {
        newRanges.splice(newRanges.indexOf(index), 1);
      } else {
        newRanges.push(index);
      }
      applyFilters(newRanges);
      return newRanges;
    });
  };

  const handleCustomRangeApply = () => {
    applyFilters(selectedRanges, true);
  };

  const applyFilters = (ranges, useCustomRange = false) => {
    let filters = {};
    let idToUse = selectedSubcategoryId || selectedCategoryId;

    if (useCustomRange) {
      filters.minPrice = minPrice ? parseInt(minPrice) : 0;
      filters.maxPrice = maxPrice ? parseInt(maxPrice) : Infinity;
    } else if (ranges.length > 0) {
      filters.minPrice = Math.min(...ranges.map((i) => priceRanges[i].min));
      filters.maxPrice = Math.max(...ranges.map((i) => priceRanges[i].max));
    }

    filters[idToUse ? `sub_category__id` : `category__id`] = idToUse;
    onApplyFilters(filters);
  };

  const clearAllFilters = () => {
    setSelectedRanges([]);
    setMinPrice('');
    setMaxPrice('');
    onApplyFilters({});
  };

  return (
    <LinearGradient
      colors={['#f6f7f9', '#e9ecf2']}
      style={styles.filtersContainer}
    >
      {/* <Text style={styles.filterTitle}>Filters</Text> */}
      <Text style={styles.filterTitle}>{t("filters")}</Text>


      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('categories')}</Text>
        <View style={styles.categoryBox}>
          <Text style={styles.categoryText}>
            {category} {subcategory ? ` → ${subcategory}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('price')} ({t('birr')})</Text>
        <View style={styles.checkboxGroup}>
          {priceRanges.map((range, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.checkboxContainer, selectedRanges.includes(index) && styles.checkboxContainerSelected]}
              onPress={() => handleCheckboxChange(index)}
            >
              <Checkbox
                value={selectedRanges.includes(index)}
                onValueChange={() => handleCheckboxChange(index)}
                color={selectedRanges.includes(index) ? '#6a11cb' : undefined}
                style={styles.checkbox}
              />
              <Text style={[styles.checkboxLabel, selectedRanges.includes(index) && styles.checkboxLabelSelected]}>
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customRangeContainer}>
          <TextInput
            style={styles.priceInput}
            placeholder="Min"
            placeholderTextColor="#aaa"
            value={minPrice}
            onChangeText={setMinPrice}
            keyboardType="numeric"
          />
          <Text style={styles.priceSeparator}>-</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="Max"
            placeholderTextColor="#aaa"
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={handleCustomRangeApply} style={styles.applyRangeButton}>
            <LinearGradient
              colors={['#6a11cb', '#2575fc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.applyRangeButtonGradient}
            >
              <Icon name="arrow-right" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={clearAllFilters} style={styles.clearAllButton}>
        <Text style={styles.clearAllButtonText}>{t('clear_all')}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  filterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
  },
  categoryBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    fontSize: 16,
    color: '#555',
  },
  checkboxGroup: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkboxContainerSelected: {
    backgroundColor: '#f0f4ff',
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  checkboxLabelSelected: {
    color: '#6a11cb',
    fontWeight: '600',
  },
  customRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#333',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  priceSeparator: {
    marginHorizontal: 10,
    fontSize: 18,
    color: '#666',
  },
  applyRangeButton: {
    marginLeft: 10,
  },
  applyRangeButtonGradient: {
    borderRadius: 10,
    padding: 12,
  },
  clearAllButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  clearAllButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductFilters;