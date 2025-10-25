import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Radio } from 'lucide-react-native';
import React, { useCallback, useMemo, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MarkerData {
  latitude: number;
  longitude: number;
  neighborhoodID: string;
  terminalID: string;
  terminalAddress: string;
  dateRegistered: string;
  lastUpdatedAt: string;
  type?: string;
}

interface InfoSheetProps {
  visible: boolean;
  markerData: MarkerData | null;
  onClose: () => void;
  onGetDirections?: (markerData: MarkerData) => void;
  onMoreInfo?: (markerData: MarkerData) => void;
}

const DetailRow = ({ label, value, valueStyle }: { 
  label: string; 
  value: string; 
  valueStyle?: string 
}) => (
  <View className="flex-row justify-between gap-4">
    <Text className="text-white text-md font-geist-medium flex-shrink-0" style={{ width: '35%' }}>
      {label}
    </Text>
    <Text className={`text-md font-geist-regular flex-1 text-right ${valueStyle || 'text-white'}`}>
      {value}
    </Text>
  </View>
);

const ActionButton = ({ title, onPress, style }: {
  title: string;
  onPress: () => void;
  style?: string;
}) => (
  <TouchableOpacity 
    className={`flex-1 rounded-xl py-3 items-center ${style || 'bg-blue-500'}`}
    onPress={onPress}
  >
    <Text className="text-white font-geist-semibold">{title}</Text>
  </TouchableOpacity>
);

export function InfoSheet({ 
  visible, 
  markerData, 
  onClose, 
  onGetDirections, 
  onMoreInfo 
}: InfoSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // Define snap points - single point for fixed height, only closable
  const snapPoints = useMemo(() => ['17%'], []);

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
      enableOverDrag={false}
      maxDynamicContentSize={400}
      handleIndicatorStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
      backgroundStyle={{ backgroundColor: 'transparent' }}
    >
      <BottomSheetView className="bg-background flex-1 p-6">
        {/* Handle bar */}
        <View className="w-12 h-1 bg-white/30 rounded-full self-center mb-6" />
        
        {/* Content */}
        <View className="gap-4 mb-2">
          {/* Title - Neighborhood ID */}
          <View className="flex-row items-center gap-3 mb-4">
            <View className="bg-gray-700 rounded-lg p-3">
              <Radio size={22} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-2xl font-geist-semibold">
                {markerData.neighborhoodID}
              </Text>
              <Text className="text-gray-400 text-sm font-geist-regular mt-1">
                {markerData.latitude}, {markerData.longitude}
              </Text>
            </View>
          </View>

          {/* Terminal ID */}
          <DetailRow label="Terminal ID" value={markerData.terminalID} />

          {/* Terminal Address */}
          <DetailRow label="Terminal Address" value={markerData.terminalAddress} />

          {/* Date Registered */}
          <DetailRow label="Date Registered" value={markerData.dateRegistered} />

          {/* Last Updated At */}
          <DetailRow label="Last Updated At" value={markerData.lastUpdatedAt} />
        </View>
      </BottomSheetView>
    </BottomSheet> 
  );
}