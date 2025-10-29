import CustomButton from '@/components/custom-button';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerificationScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [resendTime, setResendTime] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const scale = useSharedValue(1);
  
  const isCodeComplete = code.length === 6;

  const handleBack = () => {
    router.replace('/login');
  };

  const handleVerify = async () => {
    if (!isCodeComplete || isVerifying) return;
    
    setIsVerifying(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success state
      setVerificationSuccess(true);
      
      // Animate the OTP inputs to green
      scale.value = withTiming(1.1, { duration: 200 });
      
      // Redirect to home after animation
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1000);
      
    } catch (error) {
      console.error('Verification failed:', error);
      // Handle error state here
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCodeChange = (text: string) => {
    setCode(text);
  };

  const handleResend = () => {
    if (isResendDisabled) return;
    
    // Reset timer to 30 seconds
    setResendTime(30);
    setIsResendDisabled(true);
    
    // Here you would typically trigger the resend code API call
    console.log('Resending verification code...');
  };

  useEffect(() => {
    let timer: number;
    
    if (resendTime > 0 && isResendDisabled) {
      timer = window.setTimeout(() => {
        setResendTime(prev => prev - 1);
      }, 1000);
    } else if (resendTime === 0) {
      setIsResendDisabled(false);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [resendTime, isResendDisabled]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView className="flex-1 bg-zinc-900" edges={['top', 'left', 'right']}>
        {/* Gradient Background */}
        <LinearGradient
          colors={['#1F2937', '#171717']}
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
              style={{ tintColor: 'white' }}
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
            <View className="flex-1 pt-5">
              {/* Verification Content */}
              <View className="items-center mb-10">
                {/* Email Icon */}
                <View className="w-12 h-12 rounded-full bg-blue-500/10 justify-center items-center mb-5">
                  <Ionicons name="mail" size={24} color="#3B82F6" />
                </View>
                
                {/* Title and Description */}
                <Text className="text-white text-4xl font-geist-semibold text-center mb-4">
                  Enter verification code
                </Text>
                <Text className="text-background-muted text-md text-center font-geist-regular leading-[2] px-4 mb-[-10]">
                  Please enter the verification code we sent to your registered number/email to continue.
                </Text>
              </View>

              {/* OTP Input Fields */}
              <View className="mb-8">
                {verificationSuccess ? (
                  <Animated.View 
                    className="flex-row justify-center gap-2"
                    style={{ transform: [{ scale: scale }] }}
                  >
                    {[...Array(6)].map((_, index) => (
                      <View 
                        key={index}
                        className="w-[46] h-[60] rounded-lg bg-green justify-center items-center"
                      >
                        <Ionicons name="checkmark" size={20} color="white" />
                      </View>
                    ))}
                  </Animated.View>
                ) : (
                  <OtpInput
                    numberOfDigits={6}
                    focusColor="#3B82F6"
                    focusStickBlinkingDuration={500}
                    onTextChange={handleCodeChange}
                    onFilled={(text) => {
                      console.log('OTP Filled:', text);
                      setCode(text);
                    }}
                    textInputProps={{
                      accessibilityLabel: "One-Time Password",
                    }}
                    theme={{
                      containerStyle: {
                        width: '100%',
                      },
                      inputsContainerStyle: {
                        gap: 8,
                        justifyContent: 'center',
                      },
                      pinCodeContainerStyle: {
                        backgroundColor: '#1F2937',
                        borderColor: isCodeComplete ? '#3B82F6' : '#374151',
                        borderWidth: 1,
                        borderRadius: 8,
                        width: 46,
                        height: 60,
                      },
                      pinCodeTextStyle: {
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                      },
                      focusStickStyle: {
                        backgroundColor: '#3B82F6',
                        width: 2,
                        height: 32,
                      },
                      focusedPinCodeContainerStyle: {
                        borderColor: '#3B82F6',
                        backgroundColor: '#1F2937',
                      },
                    }}
                  />
                )}
              </View>
              
              {/* Resend Code */}
              <View className="items-center mt-2">
                <Text className="text-background-muted text-md text-center font-geist-regular">
                  Didn't receive any code?{' '}
                  <Text 
                    className={`${isResendDisabled ? 'text-gray-500' : 'text-primary underline'}`}
                    onPress={isResendDisabled ? undefined : handleResend}
                  >
                    Resend
                  </Text>
                  {isResendDisabled && (
                    <Text className="text-background-muted"> ({resendTime}s)</Text>
                  )}
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        
        {/* Fixed Bottom Area */}
        <View style={{ 
          padding: 20, 
          paddingBottom: Platform.OS === 'ios' ? 40 : 20,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0
        }}>
          <View className="mt-4 mb-2">
            <CustomButton
              title={isVerifying ? 'Verifying...' : verificationSuccess ? 'Success!' : 'Verify'}
              onPress={handleVerify}
              variant={isCodeComplete ? "gradient-accent" : "primary"}
              size="lg"
              width="full"
              disabled={!isCodeComplete || isVerifying || verificationSuccess}
            />
            {isVerifying && (
              <ActivityIndicator 
                className="absolute right-5 top-1/2" 
                style={{ transform: [{ translateY: -10 }] }}
                color="white" 
              />
            )}
          </View>
        </View>
        
        <StatusBar style="light" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}


