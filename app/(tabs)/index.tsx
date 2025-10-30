import { InfoSheet } from '@/components/main/info-sheet';
import { LayersButton } from '@/components/main/layers-button';
import { Pin } from '@/components/main/pin';
import { LocationButton } from '@/components/main/your-location-button';
import { Avatar } from '@/components/ui/avatar';
import { SearchField } from '@/components/ui/search-field';
import { ThemedView } from '@/components/ui/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { LocationObject } from 'expo-location';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import MapView, { Marker, Region, UrlTile } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005; // More zoomed in for subdivision view
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function HomeScreen() {
  const colorScheme = useColorScheme() || 'light';
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const colors = Colors[colorScheme];
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 14.765, // Default to Barangay 175, Caloocan City
    longitude: 121.0392,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  // Pinned locations data
  const pinnedLocations = [
    {
      id: '1',
      title: 'N-1',
      address: '123 Main Street, Barangay Centro',
      latitude: 14.5995,
      longitude: 120.9842,
    },
    {
      id: '2',
      title: 'Safe Zone Alpha',
      address: '456 Evacuation Center Ave, Barangay Norte',
      latitude: 14.602,
      longitude: 120.985,
    },
  ];

  // Request location permission
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
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

  const handleMarkerPress = (marker: any) => {
    // Set active marker for throbbing animation
    setActiveMarkerId(marker.id || marker.neighborhoodID);

    // Zoom to marker with smooth animation
    mapRef.current?.animateToRegion(
      {
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: 0.01, // Zoom in closer
        longitudeDelta: 0.01,
      },
      1000,
    );

    // Show bottom sheet
    setSelectedMarker(marker);
    setSheetVisible(true);
  };

  const hideBottomSheet = () => {
    setSheetVisible(false);
    setSelectedMarker(null);
    setActiveMarkerId(null); // Clear active marker
  };

  const handleGetDirections = (markerData: any) => {
    console.log('Get directions to:', markerData.neighborhoodID);
    // Implement directions logic here
  };

  const handleMoreInfo = (markerData: any) => {
    console.log('More info about:', markerData.neighborhoodID);
    // Implement more info logic here
  };

  const handleLocationSelect = (location: any) => {
    // Set active marker for throbbing animation
    setActiveMarkerId(location.id);

    // Zoom to selected location
    mapRef.current?.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01, // Zoom in closer
        longitudeDelta: 0.01,
      },
      1000,
    );

    // Find and show the corresponding marker data
    const markerData = {
      latitude: location.latitude,
      longitude: location.longitude,
      neighborhoodID: location.title,
      terminalID: location.id === '1' ? 'TERM-001' : 'RSQW-001',
      terminalAddress: location.address,
      dateRegistered:
        location.id === '1' ? 'September 15, 2023' : 'August 10, 2023',
      lastUpdatedAt:
        location.id === '1'
          ? 'September 25, 2023, 14:30'
          : 'September 25, 2023, 12:15',
      type: location.id === '1' ? 'emergency' : 'safe-zone',
    };

    setSelectedMarker(markerData);
    setSheetVisible(true);
  };

  const handleEdit = (markerData: any) => {
    console.log('Edit location:', markerData.neighborhoodID);
    // Implement edit logic here - could open edit form, navigate to edit screen, etc.
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
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

        {/* Sample Markers */}
        <Marker
          coordinate={{
            latitude: 14.5995,
            longitude: 120.9842,
          }}
          title="Emergency Report"
          description="Fire incident reported"
          onPress={() =>
            handleMarkerPress({
              id: '1',
              latitude: 14.5995,
              longitude: 120.9842,
              neighborhoodID: 'N-1',
              terminalID: 'TERM-001',
              terminalAddress: '123 Main Street, Barangay Centro',
              dateRegistered: 'September 15, 2023',
              lastUpdatedAt: 'September 25, 2023, 14:30',
              type: 'emergency',
            })
          }
        >
          <Pin type="emergency" isActive={activeMarkerId === '1'} />
        </Marker>

        {/* Add more sample markers */}
        <Marker
          coordinate={{
            latitude: 14.765,
            longitude: 121.0392,
          }}
          title="Safe Zone"
          description="Evacuation center"
          onPress={() =>
            handleMarkerPress({
              id: '2',
              latitude: 14.602,
              longitude: 120.985,
              neighborhoodID: 'Safe Zone Alpha',
              terminalID: 'RSQW-001',
              terminalAddress:
                'Barangay 175 Subdivision, Camarin, Caloocan City North',
              dateRegistered: 'August 10, 2023',
              lastUpdatedAt: 'September 25, 2023, 12:15',
              type: 'safe-zone',
            })
          }
        >
          <Pin type="safe-zone" isActive={activeMarkerId === '2'} />
        </Marker>
      </MapView>

      {/* Top Bar */}
      <View
        className="absolute top-0 left-0 right-0 px-5 z-10 items-center"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center w-full">
          <SearchField
            placeholder="Search locations"
            locations={pinnedLocations}
            onLocationSelect={handleLocationSelect}
          />
          <Avatar
            size="md"
            imageSource={require('@/assets/images/sample-profile-picture.jpg')}
            onPress={() => {
              // Navigate to profile screen
              router.push('/profile');
            }}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View
        className="absolute right-5 items-end gap-3 pb-4"
        style={{ bottom: 0 }} // Push to bottom with padding
      >
        <LocationButton onPress={handleCenterOnUser} />
        <LayersButton
          onPress={() => {
            // Handle layers press - open layers menu
            console.log('Layers pressed');
          }}
        />
      </View>

      {/* Info Sheet */}
      <InfoSheet
        visible={sheetVisible}
        markerData={selectedMarker}
        onClose={hideBottomSheet}
        onGetDirections={handleGetDirections}
        onMoreInfo={handleMoreInfo}
        onEdit={handleEdit}
      />
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
});
