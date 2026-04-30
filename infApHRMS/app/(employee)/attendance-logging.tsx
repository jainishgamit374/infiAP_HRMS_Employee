import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { BottomNav } from '../../components/BottomNav';
import Header from '../../components/layout/Header';
import { submitEmployeePunch } from '../../services/auth';
import { getExactCurrentLocation, formatExactLocationLabel } from '../../utils/location';

const WORK_MODES = [
  { id: 'office', label: 'Office', icon: 'business-outline', activeIcon: 'business' },
  { id: 'wfh', label: 'WFH', icon: 'home-outline', activeIcon: 'home' },
  { id: 'meeting', label: 'Meeting', icon: 'people-outline', activeIcon: 'people' },
  { id: 'offsite', label: 'Offsite', icon: 'location-outline', activeIcon: 'location' },
];

type CurrentLocation = {
  latitude: number;
  longitude: number;
  addressLine: string;
  localityLine: string;
};

export default function AttendanceLogging() {
  const [selectedMode, setSelectedMode] = useState('office');
  const [isConfirming, setIsConfirming] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState('');

  // Animations
  const logoScale = useSharedValue(0);
  const rippleScale = useSharedValue(1);
  const rippleOpacity = useSharedValue(0.5);

  useEffect(() => {
    // Logo entrance with optimized spring
    logoScale.value = withSpring(1, { damping: 12, mass: 1, overshootClamping: false });

    // Ripple effect for map marker - smoother and more efficient
    rippleScale.value = withRepeat(withTiming(2.5, { duration: 1800 }), -1, false);
    rippleOpacity.value = withRepeat(withTiming(0, { duration: 1800 }), -1, false);
  }, [logoScale, rippleOpacity, rippleScale]);

  useEffect(() => {
    let isActive = true;

    const loadCurrentLocation = async () => {
      try {
        setLocationLoading(true);
        setLocationError('');

        const location = await getExactCurrentLocation();

        if (!isActive) {
          return;
        }

        setCurrentLocation({
          latitude: location.latitude,
          longitude: location.longitude,
          addressLine: formatExactLocationLabel(location),
          localityLine: location.localityLabel,
        });
      } catch (error: any) {
        if (isActive) {
          setCurrentLocation(null);
          const errorMsg = error?.message || 'Unable to fetch the current location.';
          setLocationError(errorMsg);
        }
      } finally {
        if (isActive) {
          setLocationLoading(false);
        }
      }
    };

    loadCurrentLocation();

    // Set up automatic location refresh every 30 seconds for live tracking
    const locationRefreshInterval = setInterval(() => {
      if (isActive) {
        loadCurrentLocation();
      }
    }, 30000);

    return () => {
      isActive = false;
      clearInterval(locationRefreshInterval);
    };
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const rippleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const handleRefreshLocation = async () => {
    setLocationLoading(true);
    try {
      const location = await getExactCurrentLocation();
      setCurrentLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        addressLine: formatExactLocationLabel(location),
        localityLine: location.localityLabel,
      });
      setLocationError('');
    } catch (error: any) {
      const errorMsg = error?.message || 'Unable to fetch the current location.';
      setLocationError(errorMsg);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!currentLocation) {
      setLocationError('Location is required to check-in.');
      return;
    }

    setIsConfirming(true);
    setLocationError(''); // Clear any previous errors
    
    try {
      const response = await submitEmployeePunch({
        PunchType: 1,
        Latitude: currentLocation.latitude,
        Longitude: currentLocation.longitude,
        WorkMode: selectedMode === 'wfh' ? 2 : selectedMode === 'meeting' ? 3 : selectedMode === 'offsite' ? 4 : 1,
      });
      
      // Check if response indicates success
      if (response && (response.status === 'Success' || response.status === 'success' || response.PunchTime)) {
        router.back();
      } else {
        setLocationError(response?.message || 'Unable to submit the check-in. Please try again.');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Unable to submit the check-in. Please check your internet connection and try again.';
      setLocationError(errorMessage);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <View style={styles.root}>
      <Header 
        title="Attendance Logging" 
        showBack={true} 
        rightElement={
          <TouchableOpacity 
            style={{ padding: 4 }}
            onPress={handleRefreshLocation}
            disabled={locationLoading}
          >
            <Ionicons 
              name={locationLoading ? "sync" : "refresh"} 
              size={24} 
              color="#1e293b" 
            />
          </TouchableOpacity>
        }
      />

      <ScrollView 
        style={styles.root} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Branding Section */}
          <Animated.View style={[styles.branding, logoAnimatedStyle]}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Ionicons name="flash" size={20} color="#fff" />
              </View>
              <Text style={styles.logoText}>InfiAP</Text>
            </View>
            <Text style={styles.sessionTitle}>Check-In Session</Text>
            <Text style={styles.sessionSub}>Please verify your location to proceed.</Text>
          </Animated.View>

          {/* Work Mode Selection */}
          <View style={styles.modeSection}>
            <Text style={styles.sectionLabel}>WORK MODE</Text>
            <View style={styles.modeGrid}>
              {WORK_MODES.map((mode) => {
                const isActive = selectedMode === mode.id;
                return (
                  <TouchableOpacity
                    key={mode.id}
                    style={[styles.modeCard, isActive && styles.modeCardActive]}
                    onPress={() => setSelectedMode(mode.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={(isActive ? mode.activeIcon : mode.icon) as any}
                      size={24}
                      color={isActive ? '#fff' : '#64748b'}
                    />
                    <Text style={[styles.modeLabel, isActive && styles.modeLabelActive]}>
                      {mode.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Map Section */}
          <View style={styles.mapContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=400&fit=crop' }}
              style={styles.mapImage}
            />
            <View style={styles.markerContainer}>
              <Animated.View style={[styles.ripple, rippleAnimatedStyle]} />
              <View style={styles.marker}>
                <Ionicons name="person" size={16} color="#fff" />
              </View>
            </View>
          </View>

          {/* Location Details Card */}
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Text style={styles.locationTitle}>CURRENT LOCATION</Text>
              <View style={styles.verifiedBadge}>
                {locationLoading ? (
                  <ActivityIndicator size="small" color="#16a34a" />
                ) : (
                  <Ionicons
                    name={locationError ? 'warning-outline' : 'shield-checkmark'}
                    size={14}
                    color={locationError ? '#dc2626' : '#16a34a'}
                  />
                )}
                <Text style={[styles.verifiedText, locationError && styles.errorText]}>
                  {locationLoading ? 'Fetching current location' : locationError || 'Location Verified'}
                </Text>
              </View>
            </View>

            {currentLocation ? (
              <>
                <View style={styles.coordRow}>
                  <View style={styles.coordItem}>
                    <Text style={styles.coordLabel}>Latitude</Text>
                    <Text style={styles.coordValue}>{currentLocation.latitude.toFixed(4)}°</Text>
                  </View>
                  <View style={styles.coordItem}>
                    <Text style={styles.coordLabel}>Longitude</Text>
                    <Text style={styles.coordValue}>{currentLocation.longitude.toFixed(4)}°</Text>
                  </View>
                </View>

                <View style={styles.addressRow}>
                  <View style={styles.addressIcon}>
                    <Ionicons name="location" size={20} color="#4f46e5" />
                  </View>
                  <View style={styles.addressTextWrap}>
                    <Text style={styles.addressMain}>{currentLocation.addressLine}</Text>
                    <Text style={styles.addressSub}>{currentLocation.localityLine}</Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.locationFallback}>
                <Text style={styles.locationFallbackText}>
                  {locationLoading ? 'Detecting your current location...' : 'Current location could not be detected.'}
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.confirmBtn, isConfirming && styles.confirmBtnDisabled]}
            onPress={handleConfirm}
            disabled={isConfirming}
            activeOpacity={0.9}
          >
            {isConfirming ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="log-in" size={24} color="#fff" />
                <Text style={styles.confirmBtnText}>Confirm Check-In</Text>
              </>
            )}
          </TouchableOpacity>
          <Text style={styles.securityFooter}>SECURE AI VERIFICATION ACTIVE</Text>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    padding: 24,
  },
  branding: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4f46e5',
  },
  sessionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  sessionSub: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  modeSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 16,
  },
  modeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modeCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modeCardActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 8,
  },
  modeLabelActive: {
    color: '#fff',
  },
  mapContainer: {
    height: 180,
    backgroundColor: '#e2e8f0',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  ripple: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(79, 70, 229, 0.4)',
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748b',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  errorText: {
    color: '#dc2626',
  },
  coordRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 32,
  },
  coordItem: {
    flex: 1,
  },
  coordLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  coordValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 12,
  },
  addressTextWrap: {
    flex: 1,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressMain: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  addressSub: {
    fontSize: 12,
    color: '#94a3b8',
  },
  locationFallback: {
    paddingVertical: 12,
  },
  locationFallbackText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  confirmBtn: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 10,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmBtnDisabled: {
    opacity: 0.7,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  securityFooter: {
    fontSize: 10,
    fontWeight: '800',
    color: '#cbd5e1',
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 1,
  },
});
