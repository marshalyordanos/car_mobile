import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    MapPin
} from 'lucide-react-native';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  carCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  carTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    marginBottom: 8,
  },
  carSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  renterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  renterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  section: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  priceCard: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#0EA5E9',
    padding: 24,
    borderRadius: 20,
    marginBottom: 32,
  },
  priceTitle: {
    fontSize: 16,
    color: '#0284C7',
    marginBottom: 12,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
  },
  actionButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#000',
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  buttonTextSecondary: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
  },
};

const BookingDetail = () => {
  const router = useRouter();
  const { booking } = useLocalSearchParams();
  
  const parsedBooking = booking ? JSON.parse(decodeURIComponent(booking)) : null;

  // 🆕 DEBUG: Log the data
  console.log('🧑‍💻 Parsed Booking:', parsedBooking);

  if (!parsedBooking) {
    return (
      <View style={styles.container}>
        <Text style={{ flex: 1, textAlign: 'center', marginTop: 100 }}>Booking not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🆕 HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#6B7280" size={20} />
          </TouchableOpacity>
          <Text style={styles.title}>Booking Details</Text>
        </View>

        <View style={styles.content}>
          {/* 🆕 CAR INFO */}
          <View style={styles.carCard}>
            <Text style={styles.carTitle}>
              {parsedBooking.data?.make?.name || 'Car'} {parsedBooking.data?.model?.name || parsedBooking.data?.carName}
            </Text>
            <Text style={styles.carSubtitle}>
              {parsedBooking.data?.hostId ? 'Hosted by Owner' : parsedBooking.renterName || 'Rental Company'}
            </Text>
          </View>

          {/* 🆕 RENTER & STATUS */}
          <View style={styles.renterInfo}>
            <View style={{ flex: 1 }}>
              <Text style={styles.renterName}>Booking</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>

          {/* 🆕 DATES */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trip Dates</Text>
            <View style={styles.detailRow}>
              <Calendar color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                {parsedBooking.startDate ? 
                  new Date(parsedBooking.startDate).toLocaleDateString() : 
                  'Date TBD'
                } - {
                  parsedBooking.endDate ? 
                  new Date(parsedBooking.endDate).toLocaleDateString() : 
                  'Date TBD'
                }
              </Text>
            </View>
          </View>

          {/* 🆕 PICKUP LOCATION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup</Text>
            <View style={styles.detailRow}>
              <MapPin color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>{parsedBooking.pickupName || 'Location TBD'}</Text>
            </View>
          </View>

          {/* 🆕 DROPOFF LOCATION */}
          {parsedBooking.dropoffName && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dropoff</Text>
              <View style={styles.detailRow}>
                <MapPin color="#0284C7" size={24} />
                <Text style={styles.detailLabel}>{parsedBooking.dropoffName}</Text>
              </View>
            </View>
          )}

          {/* 🆕 TOTAL PRICE */}
          <View style={styles.priceCard}>
            <Text style={styles.priceTitle}>Total Price</Text>
            <Text style={styles.priceValue}>${parsedBooking.totalPrice || parsedBooking.price || 0}</Text>
          </View>

          {/* 🆕 WITH DRIVER */}
          {parsedBooking.withDriver && (
            <View style={[styles.section, { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0' }]}>
              <View style={styles.detailRow}>
                <CheckCircle color="#166534" size={24} />
                <Text style={[styles.detailLabel, { color: '#166534', fontWeight: '700' }]}>
                  Includes Driver
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 🆕 ACTION BUTTONS */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => {
            console.log('Pay/View receipt');
          }}
          activeOpacity={0.95}
        >
          <Text style={styles.buttonText}>View Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => router.back()}
          activeOpacity={0.95}
        >
          <Text style={styles.buttonTextSecondary}>Back to Bookings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingDetail;