import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  className?: string;
  imageSource?: any; // For sample avatar image
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-11 h-11', // 44px (default from your design)
  lg: 'w-14 h-14'
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24
};

const innerSizeClasses = {
  sm: 'w-7 h-7',
  md: 'w-12 h-12', // 36px (inner container)
  lg: 'w-12 h-12'
};

export function Avatar({ 
  size = 'md', 
  onPress,
  className = "",
  imageSource
}: AvatarProps) {
  return (
    <TouchableOpacity 
      className={`${sizeClasses[size]} rounded-xl bg-white/10 justify-center items-center ${className}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className={`${innerSizeClasses[size]} rounded-xl bg-blue-500 justify-center items-center overflow-hidden`}>
        {imageSource ? (
          <Image 
            source={imageSource}
            className={`${innerSizeClasses[size]} rounded-xl`}
            resizeMode="cover"
          />
        ) : (
          <IconSymbol 
            name="person.fill" 
            size={iconSizes[size]} 
            color="#FFFFFF" 
          />
        )}
      </View>
    </TouchableOpacity>
  );
}