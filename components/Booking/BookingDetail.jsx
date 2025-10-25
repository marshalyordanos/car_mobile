import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Car,
  CheckCircle,
  FileText,
  MapPin,
} from 'lucide-react-native';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearBooking, fetchBookingById } from '../../redux/bookingSlice';
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  badgePending: {
    backgroundColor: '#F3F4F6',
  },
  badgeTextPending: {
    color: '#374151',
  },
  badgeApproved: {
    backgroundColor: '#000',
  },
  badgeActive: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  badgeTextActive: {
    color: '#166534',
  },
  badgeCancelled: {
    backgroundColor: '#FDE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  badgeTextCancelled: {
    color: '#B00020',
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const BookingDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { booking, loading, error } = useSelector((state) => state.booking);

  // Fetch booking data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchBookingById(id));
    }
    // Clean up booking state when component unmounts
    return () => {
      dispatch(clearBooking());
    };
  }, [id, dispatch]);

  // Handle loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" style={{ flex: 1, justifyContent: 'center' }} />
      </View>
    );
  }

  // Handle error state or booking not found
  if (error || !booking) {
    return (
      <View style={styles.container}>
        <Text style={{ flex: 1, textAlign: 'center', marginTop: 100 }}>
          {error ? `Error: ${error}` : 'Booking not found'}
        </Text>
      </View>
    );
  }

  // Map status for display
  const statusMap = {
    confirmed: 'approved',
    completed: 'active',
    cancelled_by_guest: 'cancelled',
    cancelled_by_host: 'cancelled',
  };
  const displayStatus = statusMap[booking.status.toLowerCase()] || booking.status.toLowerCase();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <View style={[styles.statusBadge, styles.badgePending]}>
            <Text style={[styles.statusText, styles.badgeTextPending]}>Pending</Text>
          </View>
        );
      case 'approved':
        return (
          <View style={[styles.statusBadge, styles.badgeApproved]}>
            <Text style={styles.statusText}>Approved</Text>
          </View>
        );
      case 'active':
        return (
          <View style={[styles.statusBadge, styles.badgeActive]}>
            <Text style={[styles.statusText, styles.badgeTextActive]}>Active</Text>
          </View>
        );
      case 'cancelled':
        return (
          <View style={[styles.statusBadge, styles.badgeCancelled]}>
            <Text style={[styles.statusText, styles.badgeTextCancelled]}>Cancelled</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.statusBadge, styles.badgePending]}>
            <Text style={[styles.statusText, styles.badgeTextPending]}>{status}</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
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
          {/* Car Info */}
          <View style={styles.carCard}>
            <Text style={styles.carTitle}>
              {booking.car?.make?.name || 'Unknown Make'} {booking.car?.model?.name || 'Unknown Model'}
            </Text>
            <Text style={styles.carSubtitle}>
              Hosted by {booking.host?.firstName} {booking.host?.lastName}
            </Text>
          </View>

          {/* Renter & Status */}
          <View style={styles.renterInfo}>
            <View style={{ flex: 1 }}>
              <Text style={styles.renterName}>
                Booked by {booking.guest?.firstName} {booking.guest?.lastName}
              </Text>
            </View>
            {getStatusBadge(displayStatus)}
          </View>

          {/* Booking Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Info</Text>
            <View style={styles.detailRow}>
              <FileText color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                Booking ID: {booking.id}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <FileText color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                Created: {booking.createdAt ? formatDate(booking.createdAt) : 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <FileText color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                Updated: {booking.updatedAt ? formatDate(booking.updatedAt) : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Trip Dates */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trip Dates</Text>
            <View style={styles.detailRow}>
              <Calendar color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                {booking.startDate ? formatDate(booking.startDate) : 'Date TBD'} -{' '}
                {booking.endDate ? formatDate(booking.endDate) : 'Date TBD'}
              </Text>
            </View>
          </View>

          {/* Pickup Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup</Text>
            <View style={styles.detailRow}>
              <MapPin color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                {booking.pickupLocation?.split('+*+')[2] || 'Location TBD'}
              </Text>
            </View>
          </View>

          {/* Dropoff Location */}
          {booking.dropoffLocation && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dropoff</Text>
              <View style={styles.detailRow}>
                <MapPin color="#0284C7" size={24} />
                <Text style={styles.detailLabel}>
                  {booking.dropoffLocation?.split('+*+')[2] || 'Location TBD'}
                </Text>
              </View>
            </View>
          )}

          {/* Car Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Car Details</Text>
            <View style={styles.detailRow}>
              <Car color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                Year: {booking.car?.year || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Car color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                Color: {booking.car?.color || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Car color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                Transmission: {booking.car?.transmission || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Car color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                Car Type: {booking.car?.carType || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Car color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                Eco-Friendly: {booking.car?.ecoFriendly || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Car color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                License Plate: {booking.car?.licensePlate || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Car color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                VIN: {booking.car?.vin || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Car color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                Seating Capacity: {booking.car?.seatingCapacity || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Car color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                Mileage Limit: {booking.car?.mileageLimit || 'N/A'} miles/day
              </Text>
            </View>
          </View>

          {/* Inspections */}
          {booking.inspections?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Inspections</Text>
              {booking.inspections.map((inspection, index) => (
                <View key={inspection.id} style={{ marginBottom: index < booking.inspections.length - 1 ? 24 : 0 }}>
                  <Text style={[styles.sectionTitle, { fontSize: 16, marginBottom: 12 }]}>
                    {inspection.type} Inspection
                  </Text>
                  <View style={styles.detailRow}>
                    <FileText color="#0284C7" size={24} />
                    <Text style={styles.detailLabel}>
                      Fuel Level: {inspection.fuelLevel || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <FileText color="#0284C7" size={24} />
                    <Text style={styles.detailLabel}>
                      Mileage: {inspection.mileage || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <FileText color="#0284C7" size={24} />
                    <Text style={styles.detailLabel}>
                      Approved: {inspection.approved ? 'Yes' : 'No'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <FileText color="#0284C7" size={24} />
                    <Text style={styles.detailLabel}>
                      Submitted: {inspection.createdAt ? formatDate(inspection.createdAt) : 'N/A'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Payment Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.detailRow}>
              <FileText color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                Total Amount: {booking.payment?.currency || 'USD'} {booking.payment?.amount || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <FileText color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                Platform Fee: {booking.payment?.currency || 'USD'} {booking.payment?.platformFee || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <FileText color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                Host Earnings: {booking.payment?.currency || 'USD'} {booking.payment?.hostEarnings || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <FileText color="#0284C7" size={24} />
              <Text style={styles.detailLabel}>
                Payment Status: {booking.payment?.status || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Total Price */}
          <View style={styles.priceCard}>
            <Text style={styles.priceTitle}>Total Price</Text>
            <Text style={styles.priceValue}>
              {booking.payment?.currency || 'USD'} {booking.totalPrice || 0}
            </Text>
          </View>

          {/* Driver Inclusion */}
          {booking.withDriver && (
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

      {/* Action Buttons */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => {
            console.log(booking.payment?.status === 'PENDING' ? 'Initiate Payment' : 'View Receipt');
          }}
          activeOpacity={0.95}
        >
          <Text style={styles.buttonText}>
            {booking.payment?.status === 'PENDING' ? 'Pay Now' : 'View Receipt'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => router.back()}
          activeOpacity={0.95}
        >
          <Text style={styles.buttonTextSecondary}>Make a complaint</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingDetail;