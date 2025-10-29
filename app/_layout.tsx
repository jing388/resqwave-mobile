import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Load Geist fonts
import {
  Geist_100Thin,
  Geist_200ExtraLight,
  Geist_300Light,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  Geist_800ExtraBold,
  Geist_900Black,
} from '@expo-google-fonts/geist';

// This is the root layout component that wraps all pages
// It's only rendered once when the app starts
// All other pages will be rendered as children of this component
export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    'Geist-100': Geist_100Thin as any,
    'Geist-200': Geist_200ExtraLight as any,
    'Geist-300': Geist_300Light as any,
    'Geist-400': Geist_400Regular as any,
    'Geist-500': Geist_500Medium as any,
    'Geist-600': Geist_600SemiBold as any,
    'Geist-700': Geist_700Bold as any,
    'Geist-800': Geist_800ExtraBold as any,
    'Geist-900': Geist_900Black as any,
  });

  // Show nothing while fonts are loading
  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login/index" options={{ headerShown: false }} />
            <Stack.Screen name="verification/index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="profile/index" 
              options={{ 
                headerShown: false,
                presentation: 'transparentModal',
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: 'transparent' }
              }} 
            />
            <Stack.Screen 
              name="profile/password" 
              options={{ 
                headerShown: false,
                presentation: 'transparentModal',
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: 'transparent' }
              }} 
            />
            <Stack.Screen 
              name="profile/first-and-last-name" 
              options={{ 
                headerShown: false,
                presentation: 'transparentModal',
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: 'transparent' }
              }} 
            />
            <Stack.Screen 
              name="profile/phone-number" 
              options={{ 
                headerShown: false,
                presentation: 'transparentModal',
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: 'transparent' }
              }} 
            />
            <Stack.Screen 
              name="profile/email" 
              options={{ 
                headerShown: false,
                presentation: 'transparentModal',
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: 'transparent' }
              }} 
            />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="light" hidden />
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
