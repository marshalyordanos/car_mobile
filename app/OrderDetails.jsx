import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const OrderDetails = ({ route, navigation }) => {
    const routes = useRoute();
    const language = useSelector((state) => state.auth.lan);

  // Check if route and route.params exist, otherwise use default values
  const orderData = routes?.params?.orderData || {};
  const StatusBar = ({ status }) => (
    <View style={styles.statusBarContainer}>
      {['Pending', 'Paid', 'Ongoing', 'Delivered'].map((step, index) => (
        <View key={index} style={styles.statusStep}>
          <View style={[
            styles.statusDot,
            { backgroundColor: status === step ? '#4CAF50' : index < ['Pending', 'Paid', 'Ongoing', 'Delivered'].indexOf(status) ? '#4CAF50' : '#E0E0E0' }
          ]} />
          <Text style={[
            styles.statusText,
            { color: status === step ? '#4CAF50' : '#757575' }
          ]}>{step}</Text>
        </View>
      ))}
    </View>
  );

  if (!orderData || Object.keys(orderData).length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No order data available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <LinearGradient
          colors={['#554994', '#393381']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerText}>Order Details</Text>
          <Text style={styles.subHeaderText}>Track Number: {orderData.trackNumber || 'N/A'}</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Delivery Information</Text>
            <Text style={styles.infoText}>Status: {orderData.status || 'N/A'}</Text>
            <Text style={styles.infoText}>Type: {orderData.deliveryType || 'N/A'}</Text>
            <Text style={styles.infoText}>
              Address: {orderData.city || 'N/A'}, {orderData.country || 'N/A'}
            </Text>
          </View>

          <StatusBar status={orderData.status || 'Pending'} />

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <Text style={styles.infoText}>Name: {orderData.fullName || 'N/A'}</Text>
            <Text style={styles.infoText}>Phone: {orderData.phoneNumber || 'N/A'}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Order Information</Text>
            <Text style={styles.infoText}>Payment Method: {orderData.paymentMethod || 'N/A'}</Text>
            <Text style={styles.infoText}>Order Date: {orderData.created ? new Date(orderData.created).toLocaleDateString() : 'N/A'}</Text>
          </View>

          <View style={styles.productSection}>
            <Text style={styles.sectionTitle}>Ordered Products</Text>
            {(orderData.order_product_combinations || []).map((item, index) => (
              <View key={index} style={styles.productItem}>
                <Image
                  source={{ uri: item.productCombination?.image ? `https://api.kelatibeauty.com${item.productCombination.image}` : 'https://via.placeholder.com/80' }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>
                    {/* {item.productCombination?.product?.name || 'Unknown Product'} */}
                    {language === "am" ? item.productCombination?.product?.name.split("*+*")[1] : 
                    item.productCombination?.product?.name.split("*+*")[0]}

                    </Text>
                  <Text style={styles.productDetails}>
                    Quantity: {item.quantity || 'N/A'} 
                  </Text>
                  <Text style={styles.productDetails}>
                    Price: {item.price || 'N/A'} ETB
                  </Text>
                  <Text style={styles.productSku}>SKU: {item.productCombination?.sku || 'N/A'}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555555',
  },
  statusBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusStep: {
    alignItems: 'center',
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 12,
  },
  productSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  productDetails: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 3,
  },
  productSku: {
    fontSize: 12,
    color: '#888888',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
  },
});

export default OrderDetails;