import { BottomButtonContainer } from '@/components/ui/bottom-button-container';
import CustomButton from '@/components/ui/custom-button';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    phone: false,
    password: false,
  });

  // Check if both fields are filled to enable the button
  const isFormValid =
    phoneNumber.trim().length >= 10 && password.trim().length >= 6;

  const handleLogin = () => {
    if (isFormValid) {
      // For now, we'll navigate to the verification page
      // In a real app, you would typically verify credentials first
      console.log('Navigating to verification page');
      router.push('/verification');
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log('Forgot password pressed');
  };

  const handleBack = () => {
    // Always navigate back to the landing page
    router.replace('/');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        {/* Gradient Background */}
        <LinearGradient
          colors={colors.gradients.background}
          className="absolute inset-0"
        />

        {/* Custom Header */}
        <View className="flex-row items-center justify-between p-5 pt-0 android:pt-5">
          <TouchableOpacity
            className="w-10 h-10 justify-center items-center"
            onPress={handleBack}
          >
            <Image
              source={require('@/assets/images/left-arrow.png')}
              className="w-6 h-6"
              style={{ tintColor: colors.icon.primary }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View className="w-10" />
        </View>

        <KeyboardAvoidingView
          className="flex-1 relative"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 px-6">
              {/* Logo and Title */}
              <View className="items-center mb-10">
                <View className="w-20 h-20 justify-center items-center">
                  <Image
                    source={require('@/assets/images/resqwave-logo.png')}
                    className="w-10 h-10"
                  />
                </View>
                <Text className="text-text-primary text-4xl font-geist-semibold mb-4 text-center">
                  Log in to ResQWave
                </Text>
              </View>

              {/* Form */}
              <View className="gap-8 mb-8">
                {/* Phone Number Input */}
                <View className="relative">
                  <View
                    className={`flex-row items-center bg-card-bg rounded-xl border h-16 ${isFocused.phone ? 'border-brand-primary' : 'border-card-border'}`}
                  >
                    <View className="flex-row items-center h-8 px-5 border-r border-card-border">
                      <Text className="text-text-primary text-base font-geist-medium mr-2">
                        🇵🇭
                      </Text>
                      <Text className="text-text-primary text-base font-geist-medium">
                        +63
                      </Text>
                    </View>
                    <TextInput
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      onFocus={() =>
                        setIsFocused((prev) => ({ ...prev, phone: true }))
                      }
                      onBlur={() =>
                        setIsFocused((prev) => ({ ...prev, phone: false }))
                      }
                      placeholder="Enter your phone number"
                      placeholderTextColor={colors.text.placeholder}
                      keyboardType="phone-pad"
                      className="flex-1 text-text-primary text-base h-full ml-3 font-geist-regular py-0 pr-3"
                      maxLength={11}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View className="relative">
                  <View
                    className={`flex-row items-center bg-card-bg rounded-xl h-16 px-4 border ${isFocused.password ? 'border-brand-primary' : 'border-card-border'}`}
                  >
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() =>
                        setIsFocused((prev) => ({ ...prev, password: true }))
                      }
                      onBlur={() =>
                        setIsFocused((prev) => ({ ...prev, password: false }))
                      }
                      placeholder="Enter your password"
                      placeholderTextColor={colors.text.placeholder}
                      secureTextEntry={!showPassword}
                      className="flex-1 text-text-primary text-base h-full pr-2 font-geist-regular py-0"
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="p-2"
                    >
                      <Text className="text-text-muted text-xs font-geist-semibold uppercase">
                        {showPassword ? (
                          <Ionicons
                            name="eye-off"
                            size={20}
                            color={colors.icon.secondary}
                          />
                        ) : (
                          <Ionicons
                            name="eye"
                            size={20}
                            color={colors.icon.secondary}
                          />
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  className="self-center mt-1 p-2"
                >
                  <Text className="text-foreground-muted text-md font-geist-medium">
                    Forgot your password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Bottom Area */}
          <BottomButtonContainer>
            <CustomButton
              title="Login"
              onPress={handleLogin}
              variant={isFormValid ? 'gradient-accent' : 'primary'}
              size="lg"
              width="full"
              disabled={!isFormValid}
            />
          </BottomButtonContainer>
        </KeyboardAvoidingView>
        <StatusBar style="light" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
