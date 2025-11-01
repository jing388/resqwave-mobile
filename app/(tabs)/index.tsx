import { InfoSheet } from '@/components/main/info-sheet';
import { LayersButton } from '@/components/main/layers-button';
import { getPinColors } from '@/components/main/pin';
import { LocationButton } from '@/components/main/your-location-button';
import { Avatar } from '@/components/ui/avatar';
import { SearchField } from '@/components/ui/location-search-field';
import { ThemedView } from '@/components/ui/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { LocationObject } from 'expo-location';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import MapView, { Circle, Marker, Region, UrlTile } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Marker data interface (this is what you'll get from your database)
interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  neighborhoodID: string;
  terminalID: string;
  terminalAddress: string;
  dateRegistered: string;
  lastUpdatedAt: string;
  type: 'emergency' | 'safe-zone' | 'default';
  title?: string;
  description?: string;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme() || 'light';
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const colors = Colors[colorScheme];
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 14.765,
    longitude: 121.0392,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  // Dynamic markers array - THIS IS WHERE YOU'LL PUT YOUR DATABASE DATA
  const [markers, setMarkers] = useState<MarkerData[]>([
    {
      id: '1',
      latitude: 14.5995,
      longitude: 120.9842,
      neighborhoodID: 'N-1',
      terminalID: 'TERM-001',
      terminalAddress: '123 Main Street, Barangay Centro',
      dateRegistered: 'September 15, 2023',
      lastUpdatedAt: 'September 25, 2023, 14:30',
      type: 'emergency',
      title: 'Emergency Report',
      description: 'Fire incident reported',
    },
    {
      id: '2',
      latitude: 14.765,
      longitude: 121.0392,
      neighborhoodID: 'Safe Zone Alpha',
      terminalID: 'RSQW-001',
      terminalAddress: 'Barangay 175 Subdivision, Camarin, Caloocan City North',
      dateRegistered: 'August 10, 2023',
      lastUpdatedAt: 'September 25, 2023, 12:15',
      type: 'safe-zone',
      title: 'Safe Zone',
      description: 'Evacuation center',
    },
  ]);

  // Pinned locations for search (derived from markers)
  const pinnedLocations = markers.map((marker) => ({
    id: marker.id,
    title: marker.neighborhoodID,
    address: marker.terminalAddress,
    latitude: marker.latitude,
    longitude: marker.longitude,
  }));

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

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

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

  const handleMarkerPress = (marker: MarkerData) => {
    setActiveMarkerId(marker.id);

    mapRef.current?.animateToRegion(
      {
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000,
    );

    setSelectedMarker(marker);
    setSheetVisible(true);
  };

  const hideBottomSheet = () => {
    setSheetVisible(false);
    setSelectedMarker(null);
    setActiveMarkerId(null);
  };

  const handleGetDirections = (markerData: MarkerData) => {
    console.log('Get directions to:', markerData.neighborhoodID);
  };

  const handleMoreInfo = (markerData: MarkerData) => {
    console.log('More info about:', markerData.neighborhoodID);
  };

  const handleLocationSelect = (location: any) => {
    // Find the marker from our markers array
    const marker = markers.find((m) => m.id === location.id);
    if (marker) {
      handleMarkerPress(marker);
    }
  };

  const handleEdit = (markerData: MarkerData) => {
    console.log('Edit location:', markerData.neighborhoodID);
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
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
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
          tileSize={256}
        />

        {/* Dynamically render all markers and their circles */}
        {markers.map((marker) => {
          const colors = getPinColors(marker.type);
          // Get marker color based on type
          const getMarkerColor = () => {
            switch (marker.type) {
              case 'emergency':
                return '#FF3B30';
              case 'safe-zone':
                return '#34D399';
              default:
                return '#007AFF';
            }
          };

          return (
            <React.Fragment key={marker.id}>
              {/* Range Circle - only show if this marker is active */}
              {activeMarkerId === marker.id && (
                <Circle
                  center={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                  }}
                  radius={100}
                  fillColor={colors.fill}
                  strokeColor={colors.stroke}
                  strokeWidth={2}
                />
              )}

              {/* Default Marker with custom color */}
              <Marker
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                onPress={() => handleMarkerPress(marker)}
                pinColor={getMarkerColor()}
              />
            </React.Fragment>
          );
        })}
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
              router.push('/profile');
            }}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View
        className="absolute right-5 items-end gap-3 pb-4"
        style={{ bottom: 0 }}
      >
        <LocationButton onPress={handleCenterOnUser} />
        <LayersButton
          onPress={() => {
            console.log('Layers pressed');
          }}
        />
      </View>

      {/* Info Sheet */}
      <InfoSheet
        visible={sheetVisible}
        markerData={selectedMarker}
        onClose={hideBottomSheet}
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
