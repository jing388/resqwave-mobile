import { Avatar } from '@/components/avatar';
import { InfoSheet } from '@/components/info-sheet';
import { LayersButton } from '@/components/layers-button';
import { SearchField } from '@/components/search-field';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LocationButton } from '@/components/your-location-button';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { LocationObject } from 'expo-location';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, PermissionsAndroid, Platform, StatusBar, StyleSheet, View } from 'react-native';
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

  const handleMarkerPress = (marker: any) => {
    // Zoom to marker with smooth animation
    mapRef.current?.animateToRegion({
      latitude: marker.latitude,
      longitude: marker.longitude,
      latitudeDelta: 0.01, // Zoom in closer
      longitudeDelta: 0.01,
    }, 1000);

    // Show bottom sheet
    setSelectedMarker(marker);
    setSheetVisible(true);
  };

  const hideBottomSheet = () => {
    setSheetVisible(false);
    setSelectedMarker(null);
  };

  const handleGetDirections = (markerData: any) => {
    console.log('Get directions to:', markerData.neighborhoodID);
    // Implement directions logic here
  };

  const handleMoreInfo = (markerData: any) => {
    console.log('More info about:', markerData.neighborhoodID);
    // Implement more info logic here
  };

  const handleEdit = (markerData: any) => {
    console.log('Edit location:', markerData.neighborhoodID);
    // Implement edit logic here - could open edit form, navigate to edit screen, etc.
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
        
        {/* Sample Markers */}

        {/* Add more sample markers */}
        <Marker
          coordinate={{
            latitude: 14.765,
            longitude: 121.0392,
          }}
          title="Safe Zone"
          description="Evacuation center"
          onPress={() => handleMarkerPress({
            latitude: 14.765,
            longitude: 121.0392,
            neighborhoodID: "Safe Zone Alpha",
            terminalID: "RSQW-001",
            terminalAddress: "Barangay 175 Subdivision, Camarin, Caloocan City North",
            dateRegistered: "August 10, 2023",
            lastUpdatedAt: "September 25, 2023, 12:15",
            type: "safe-zone"
          })}
        >
          <View style={styles.markerContainer}>
            <View style={[styles.markerPin, { backgroundColor: '#34D399' }]}>
              <IconSymbol name="checkmark.shield.fill" size={16} color="white" />
            </View>
            <View style={[styles.markerArrow, { borderTopColor: '#34D399' }]} />
          </View>
        </Marker>
      </MapView>

      {/* Top Bar */}
      <View 
        className="absolute top-0 left-0 right-0 px-5 z-10 items-center"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center w-full">
          <SearchField 
            onPress={() => {
              // Handle search press - navigate to search screen or open search modal
              console.log('Search pressed');
            }}
          />
          <Avatar 
            size="md"
            imageSource={require('@/assets/images/sample-profile-picture.jpg')}
            onPress={() => {
              // Handle profile press - navigate to profile screen
              console.log('Profile pressed');
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
        <LayersButton onPress={() => {
          // Handle layers press - open layers menu
          console.log('Layers pressed');
        }} />
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
