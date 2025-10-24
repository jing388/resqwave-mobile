import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

interface LocationButtonProps {
  onPress?: () => void;
  className?: string;
}

export function LocationButton({ 
  onPress,
  className = ""
}: LocationButtonProps) {
  return (
    <TouchableOpacity
      className={`w-12 h-12 rounded-lg bg-gray-900/90 justify-center items-center border border-white/10 ${className}`}
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <Image 
        source={require('@/assets/images/target-location.png')} 
        className="w-6 h-6"
        style={{ tintColor: '#FFFFFF' }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}
