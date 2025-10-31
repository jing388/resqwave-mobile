import React from 'react';
import { View } from 'react-native';

interface PinProps {
  isActive?: boolean;
  type?: 'emergency' | 'safe-zone' | 'default';
  size?: number;
}

export function Pin({ 
  isActive = false, 
  type = 'default', 
  size = 20 
}: PinProps) {
  // Determine colors based on type
  const getColors = () => {
    switch (type) {
      case 'emergency':
        return {
          background: '#FF3B30',
          range: 'rgba(255, 59, 48, 0.2)'
        };
      case 'safe-zone':
        return {
          background: '#34D399',
          range: 'rgba(52, 211, 153, 0.2)'
        };
      default:
        return {
          background: '#007AFF',
          range: 'rgba(0, 122, 255, 0.2)'
        };
    }
  };

  const colors = getColors();

  return (
    <View className="items-center justify-center">
      {/* Range circle when active */}
      {isActive && (
        <View
          style={{
            position: 'absolute',
            width: size * 6, // Range diameter
            height: size * 6,
            borderRadius: (size * 6) / 2, // Proper circle calculation
            backgroundColor: colors.range,
            borderWidth: 1,
            borderColor: colors.background,
            top: -(size * 6 - size) / 2, // Center the range circle
            left: -(size * 6 - size) / 2,
          }}
        />
      )}
      
      {/* Main pin - simple circle */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.background,
          borderWidth: 2,
          borderColor: 'white',
          // Add shadow for better visibility
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      />
    </View>
  );
}
