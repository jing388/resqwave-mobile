import CustomButton from '@/components/custom-button';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Check if both fields are filled to enable the button
  const isFormValid = phoneNumber.trim().length > 0 && password.trim().length > 0;

  const handleLogin = () => {
    if (isFormValid) {
      // Handle login logic here
      console.log('Login attempted with:', { phoneNumber, password });
      // For now, navigate to tabs
      router.push('/(tabs)');
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log('Forgot password pressed');
  };

  return (
    <View className="flex-1 bg-neutral-900">
      {/* Background Ellipse */}
      <View className="absolute -left-[683px] w-[1366px] top-1/2 -translate-y-1/2">
        <View className="w-full h-full bg-neutral-800 rounded-full" />
      </View>

      <View className="flex-1 px-6 pt-16">
        {/* Logo and Title */}
        <View className="items-center mt-16 mb-12">
          <View className="w-[34px] h-[34px] mb-4">
            {/* Replace with your actual logo */}
            <View className="w-full h-full bg-blue-500 rounded-md" />
          </View>
          <Text className="font-geist-bold text-white text-xl mb-1">
            Log in to ResQWave
          </Text>
          <Text className="font-geist text-neutral-400 text-xs">
            Stronger Signals, Safer Communities.
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          {/* Phone Number Input with Country Code */}
          <View className="flex-row gap-3">
            {/* Country Code */}
            <View className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 h-[49px] flex-row items-center">
              <View className="w-4 h-3 mr-2 bg-red-500 rounded-sm" />
              <Text className="text-white text-xs">+63</Text>
            </View>
            
            {/* Phone Number */}
            <View className="flex-1">
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Phone Number"
                placeholderTextColor="#A3A3A3"
                keyboardType="phone-pad"
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 h-[49px] text-white font-geist text-sm flex-1"
              />
            </View>
          </View>

          {/* Password Input */}
          <View>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#A3A3A3"
              secureTextEntry={!showPassword}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 h-[49px] text-white font-geist text-sm"
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Text className="text-neutral-400">👁️</Text>
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity 
            onPress={handleForgotPassword} 
            className="self-center mt-2"
          >
            <Text className="font-geist-medium text-neutral-400 text-xs">
              Forgot your password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Button */}
      <View className="px-6 pb-10">
        <CustomButton
          title="Login"
          onPress={handleLogin}
          variant={isFormValid ? "gradient-accent" : "primary"}
          size="lg"
          width="full"
          disabled={!isFormValid}
        />
      </View>
      
      {/* Footer with Sign Up link */}
      <View className="flex-row justify-center items-center pb-8">
        <Text className="font-geist text-white/70 text-sm">
          Do not have an account?
        </Text>
        <TouchableOpacity onPress={() => console.log('Navigate to Sign Up')}>
          <Text className="font-geist-medium text-light-primary text-sm ml-1">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </View>
  );
}
