import { Avatar } from '@/components/avatar';
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
