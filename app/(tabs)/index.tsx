import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, StatusBar, Platform, PermissionsAndroid, Image } from 'react-native';
import * as Location from 'expo-location';
import type { LocationObject } from 'expo-location';
import MapView, { Marker, Region, UrlTile } from 'react-native-maps';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function HomeScreen() {
  const colorScheme = useColorScheme() || 'light';
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const colors = Colors[colorScheme];
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 14.5995, // Default to Manila coordinates
    longitude: 120.9842,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  // Request location permission
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Permission to access location was denied');
          return;
        }
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Update map region to current location
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    })();
  }, []);

  const onRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);
  }, []);


  const handleCenterOnUser = () => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {/* Map View */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        rotateEnabled={false}
        loadingEnabled={true}
        loadingIndicatorColor={colors.tint}
        loadingBackgroundColor={colors.background}
      >
        {/* OpenStreetMap Tile Layer */}
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
          tileSize={256}
        />
        
        {/* You can add markers here */}
        <Marker
          coordinate={{
            latitude: 14.5995,
            longitude: 120.9842,
          }}
          title="Sample Location"
          description="This is a sample location"
        >
          <View style={styles.markerContainer}>
            <View style={styles.markerPin}>
              <IconSymbol name="exclamationmark.triangle.fill" size={16} color="white" />
            </View>
            <View style={[styles.markerArrow, { borderTopColor: colors.tint }]} />
          </View>
        </Marker>
      </MapView>

      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <IconSymbol name="magnifyingglass" size={16} color="#9CA3AF" style={styles.searchIcon} />
            <ThemedText style={styles.searchText}>Search location or address</ThemedText>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileIcon}>
              <IconSymbol name="person.fill" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
      </View>


      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        {/* Location Button */}
        <TouchableOpacity
          style={styles.squareButton}
          onPress={handleCenterOnUser}
          activeOpacity={0.8}
        >
          <Image 
            source={require('@/assets/images/target-location.png')} 
            style={styles.buttonIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Layers Button */}
        <TouchableOpacity
          style={[styles.squareButton, { marginTop: 12 }]}
          onPress={() => {}}
          activeOpacity={0.8}
        >
          <Image 
            source={require('@/assets/images/layer-menu-stack.png')} 
            style={[styles.buttonIcon, { width: 20, height: 20 }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 10,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Geist-Regular',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonsContainer: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    alignItems: 'flex-end',
  } as const,
  squareButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  } as const,
  buttonIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  } as const,
  markerContainer: {
    alignItems: 'center',
  } as const,
  markerPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  } as const,
  markerArrow: {
    width: 0,
    height: 0,
    marginTop: -2,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF3B30',
  } as const,
});
