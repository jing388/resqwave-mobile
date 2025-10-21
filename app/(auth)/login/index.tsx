import CustomButton from '@/components/custom-button';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  
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
    <LinearGradient
      colors={['#1F2937', '#171717']}
      start={{ x: 0.5, y: 0.2 }}
      end={{ x: 0.8, y: 0.8 }}
      className="flex-1"
    >
      <View className="flex-1 px-6 pt-16">
        {/* Header */}
        <View className="mb-12">
          <Text className="font-geist-bold text-white text-3xl mb-2">
            Welcome Back
          </Text>
          <Text className="font-geist text-white/70 text-base">
            Sign in to continue to ResQWave
          </Text>
        </View>

        {/* Form */}
        <View className="gap-6">
          {/* Phone Number Input */}
          <View>
            <Text className="font-geist-medium text-white text-sm mb-2">
              Phone Number
            </Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              placeholderTextColor="#64748B"
              keyboardType="phone-pad"
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-4 text-white font-geist text-base"
            />
          </View>

          {/* Password Input */}
          <View>
            <Text className="font-geist-medium text-white text-sm mb-2">
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#64748B"
              secureTextEntry
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-4 text-white font-geist text-base"
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={handleForgotPassword} className="self-end">
            <Text className="font-geist-medium text-light-primary text-sm">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <View className="mt-8">
            <CustomButton
              title="Next"
              onPress={handleLogin}
              variant={isFormValid ? "gradient-accent" : "primary"}
              size="lg"
              width="full"
              disabled={!isFormValid}
            />
          </View>
        </View>

        {/* Footer */}
        <View className="flex-1 justify-end pb-8">
          <View className="flex-row justify-center items-center">
            <Text className="font-geist text-white/70 text-sm">
              Do not have an account?
            </Text>
              <Text className="font-geist-medium text-light-primary text-sm ml-1">
                Sign Up
              </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
