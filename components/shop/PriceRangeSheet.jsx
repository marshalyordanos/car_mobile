import React,{useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const PriceRangeSheet = React.forwardRef((props, ref) => {
  const snapPoints = ['40%']; 
  const [priceRange, setPriceRange] = useState([10, 500]); 
  const handleValuesChange = (values) => {
    setPriceRange(values);
  };
  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={styles.modalBackground}
      handleIndicatorStyle={{ backgroundColor: '#d1d5db' }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => ref.current?.close()}>
            <Text style={styles.headerButton}>X</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Price range</Text>
          <TouchableOpacity onPress={() => setPriceRange([10, 500])}>
            <Text style={styles.headerButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.rangeText}> ${priceRange[0]} - ${priceRange[1]}{priceRange[1] >= 500 ? '+' : ''}/day </Text>
        
         <View style={styles.sliderContainer}>
          <MultiSlider
            values={[priceRange[0], priceRange[1]]}
            sliderLength={280} 
            onValuesChange={handleValuesChange}
            min={10}
            max={500}
            step={5}
            allowOverlap={false}
            snapped
            minMarkerOverlapDistance={40}
            trackStyle={{
              height: 4,
              backgroundColor: '#e5e7eb', 
            }}
            selectedStyle={{
              backgroundColor: '#393381', 
            }}
            markerStyle={{
              height: 24,
              width: 24,
              borderRadius: 12,
              backgroundColor: '#393381',
              borderWidth: 2,
              borderColor: 'white',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          />
        </View>
        <TouchableOpacity style={styles.resultsButton} onPress={() => ref.current?.close()}>
          <Text style={styles.resultsButtonText}>View 200+ results</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

PriceRangeSheet.displayName = "PriceRangeSheet";
export default PriceRangeSheet;

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: 'white', 
    borderRadius: 24,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerButton: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  rangeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sliderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  resultsButton: {
    backgroundColor: '#111827', 
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});