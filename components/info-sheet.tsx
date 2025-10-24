import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MarkerData {
  latitude: number;
  longitude: number;
  title: string;
  lastUpdated?: string;
  description: string;
  type: string;
  reportedBy?: string;
  time?: string;
  capacity?: string;
  status?: string;
}

interface InfoSheetProps {
  visible: boolean;
  markerData: MarkerData | null;
  onClose: () => void;
  onGetDirections?: (markerData: MarkerData) => void;
  onMoreInfo?: (markerData: MarkerData) => void;
}

export function InfoSheet({ 
  visible, 
  markerData, 
  onClose, 
  onGetDirections, 
  onMoreInfo 
}: InfoSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // Define snap points
  const snapPoints = useMemo(() => ['40%', '70%'], []);

  // Handle sheet changes
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  // Control sheet visibility
  React.useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  if (!markerData) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      handleIndicatorStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
      backgroundStyle={{ backgroundColor: 'transparent' }}
    >
      <BottomSheetView className="bg-background flex-1 p-6">
        {/* Handle bar */}
        <View className="w-12 h-1 bg-white/30 rounded-full self-center mb-6" />
        
        {/* Content */}
        <View className="gap-4">
            {/* Title */}
            <Text className="text-white text-2xl font-geist-semibold">
              {markerData.title}
            </Text>

            {/* Last Updated */}
            {markerData.lastUpdated && (
              <View className="flex-row justify-between">
                <Text className="text-gray-400 text-sm font-geist-medium">Last Updated:</Text>
                <Text className="text-white text-sm font-geist-regular">{markerData.lastUpdated}</Text>
              </View>
            )}

            {/* Description */}
            <Text className="text-gray-300 text-base font-geist-regular">
              {markerData.description}
            </Text>
            
            {/* Details */}
            <View className="gap-2">
              {markerData.reportedBy && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-400 text-sm font-geist-medium">Reported by:</Text>
                  <Text className="text-white text-sm font-geist-regular">{markerData.reportedBy}</Text>
                </View>
              )}
              
              {markerData.time && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-400 text-sm font-geist-medium">Time:</Text>
                  <Text className="text-white text-sm font-geist-regular">{markerData.time}</Text>
                </View>
              )}
              
              {markerData.capacity && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-400 text-sm font-geist-medium">Capacity:</Text>
                  <Text className="text-white text-sm font-geist-regular">{markerData.capacity}</Text>
                </View>
              )}
              
              {markerData.status && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-400 text-sm font-geist-medium">Status:</Text>
                  <Text className={`text-sm font-geist-semibold ${
                    markerData.status === 'Available' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {markerData.status}
                  </Text>
                </View>
              )}
            </View>
            
            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity 
                className="flex-1 bg-blue-500 rounded-xl py-3 items-center"
                onPress={() => onGetDirections?.(markerData)}
              >
                <Text className="text-white font-geist-semibold">Get Directions</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 bg-gray-700 rounded-xl py-3 items-center"
                onPress={() => onMoreInfo?.(markerData)}
              >
                <Text className="text-white font-geist-semibold">More Info</Text>
              </TouchableOpacity>
            </View>
          </View>
      </BottomSheetView>
    </BottomSheet> 
  );
}