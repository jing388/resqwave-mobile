import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface SearchFieldProps {
  placeholder?: string;
  onPress?: () => void;
  className?: string;
}

export function SearchField({ 
  placeholder = "Search",
  onPress,
  className = ""
}: SearchFieldProps) {
  return (
    <TouchableOpacity 
      className={`flex-1 flex-row items-center bg-background rounded-xl px-4 py-3 mr-3 ${className}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <IconSymbol 
        name="magnifyingglass" 
        size={16} 
        color="#9CA3AF" 
        style={{ marginRight: 8 }}
      />
      <ThemedText className="text-gray-400 text-sm font-geist-regular">
        {placeholder}
      </ThemedText>
    </TouchableOpacity>
  );
}