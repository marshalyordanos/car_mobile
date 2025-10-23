import {
  Calendar,
  CreditCard,
  MapPin,
  MessageCircle,
  X,
} from 'lucide-react-native';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const mockBookings = [
  {
    id: '1',
    carId: 'cmfx1x55k0000lifipaliaw06',
    carName: 'Tesla Model 3',
    carModel: '2024',
    renterName: 'Premium Auto Rentals',
    status: 'approved',
    pickupDate: 'Dec 25, 2024',
    returnDate: 'Dec 28, 2024',
    pickupLocation: '123 Main St, Downtown',
    price: 450,
    isPaid: false,
  },
  {
    id: '2',
    carId: 'cmfx1x55k0000lifipaliaw07',
    carName: 'BMW X5',
    carModel: '2023',
    renterName: 'Elite Car Hire',
    status: 'pending',
    pickupDate: 'Dec 30, 2024',
    returnDate: 'Jan 3, 2025',
    pickupLocation: '456 Oak Ave, Airport',
    price: 650,
    isPaid: false,
  },
  {
    id: '3',
    carId: 'cmfx1x55k0000lifipaliaw08',
    carName: 'Mercedes C-Class',
    carModel: '2024',
    renterName: 'Luxury Drives',
    status: 'active',
    pickupDate: 'Dec 20, 2024',
    returnDate: 'Dec 24, 2024',
    pickupLocation: '789 Pine Rd, City Center',
    price: 550,
    isPaid: true,
  },
];

const styles = {
  cardTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardInfo: {
    flex: 1,
  },
  carTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  renterName: {
    fontSize: 14,
    color: '#6B7280',
  },
  badgePending: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeTextPending: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  badgeApproved: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeTextApproved: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  badgeActive: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFF',
  },
  payButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  buttonTextWhite: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 4,
  },
  iconMargin: {
    marginRight: 4,
  },
  paidStatus: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  paidText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingVertical: 80,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
};

const BookingCard = ({ booking, onOpenChat, onCancel, onPay, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }), []); // 🆕 ADDED EMPTY DEPS

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleCardPress = () => {
    onPress?.(booking);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <View style={styles.badgePending}>
            <Text style={styles.badgeTextPending}>Pending</Text>
          </View>
        );
      case 'approved':
        return (
          <View style={styles.badgeApproved}>
            <Text style={styles.badgeTextApproved}>Approved</Text>
          </View>
        );
      case 'active':
        return (
          <View style={styles.badgeActive}>
            <Text style={styles.badgeTextActive}>Active</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      style={styles.cardTouchable}
      onPress={handleCardPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.carTitle}>
              {booking.carName} {booking.carModel}
            </Text>
            <Text style={styles.renterName}>{booking.renterName}</Text>
          </View>
          {getStatusBadge(booking.status)}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Calendar color="#6B7280" size={16} />
            <Text style={styles.detailText}>
              {booking.pickupDate} - {booking.returnDate}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin color="#6B7280" size={16} />
            <Text style={styles.detailText} numberOfLines={1}>
              {booking.pickupLocation}
            </Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.priceValue}>${booking.price}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={(e) => {
              e.stopPropagation();
              onOpenChat(booking);
            }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <MessageCircle color="#6B7280" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={(e) => {
              e.stopPropagation();
              onCancel(booking.id);
            }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <X color="#6B7280" size={16} style={styles.iconMargin} />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          {booking.status === 'approved' && !booking.isPaid && (
            <TouchableOpacity
              style={[styles.actionButton, styles.payButton]}
              onPress={(e) => {
                e.stopPropagation();
                onPay(booking.id);
              }}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <CreditCard color="#FFF" size={16} style={styles.iconMargin} />
              <Text style={styles.buttonTextWhite}>Pay</Text>
            </TouchableOpacity>
          )}

          {booking.isPaid && (
            <View style={styles.paidStatus}>
              <Text style={styles.paidText}>Paid</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const BookingList = ({ onOpenChat, onBookingPress }) => {
  // ✅ useRouter() here is FINE - top level only

  const handleCancel = (bookingId) => {
    console.log('Cancel booking:', bookingId);
  };

  const handlePay = (bookingId) => {
    console.log('Pay for booking:', bookingId);
  };

  const activeBookings = mockBookings.filter(
    (booking) =>
      booking.status === 'pending' || booking.status === 'approved' || booking.status === 'active'
  );

  return (
    <FlatList
      data={activeBookings}
      renderItem={({ item }) => (
        <BookingCard
          booking={item}
          onOpenChat={onOpenChat}
          onCancel={handleCancel}
          onPay={handlePay}
          onPress={onBookingPress}
        />
      )}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Calendar color="#D1D5DB" size={64} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No active bookings</Text>
          <Text style={styles.emptySubtitle}>
            Your upcoming bookings will appear here
          </Text>
        </View>
      }
    />
  );
};

export default BookingList;