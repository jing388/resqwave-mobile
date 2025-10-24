import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Gradient Background */}
      <LinearGradient
        colors={['#1F2937', '#171717']}
        className="absolute inset-0"
      />
      
      {/* Content */}
      <View className="flex-1 px-6 justify-center items-center">
        <Text className="text-white text-2xl font-geist-semibold text-center mb-4">
          Reports
        </Text>
        <Text className="text-gray-400 text-base font-geist-regular text-center">
          This page is under development
        </Text>
      </View>
    </SafeAreaView>
  );
}