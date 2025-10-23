import CustomButton from '@/components/custom-button';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Animated, { FadeIn, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerificationScreen() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendTime, setResendTime] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const scale = useSharedValue(1);
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null)
  ];
  
  // Check if all 6 digits are entered
  const isCodeComplete = code.every(digit => digit !== '');

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  // Handle verification
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

  // Handle code input change
  const handleCodeChange = (text: string, index: number) => {
    // Only allow numbers and limit to 1 character
    const numericValue = text.replace(/[^0-9]/g, '');
    
    if (numericValue === '') {
      // If backspace, move to previous input if current is empty
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      
      if (index > 0) {
        inputRefs[index - 1].current?.focus();
      }
      return;
    }
    
    // Update the code with the new digit
    const newCode = [...code];
    newCode[index] = numericValue[0]; // Only take the first character
    setCode(newCode);

    // Auto focus next input if not the last one
    if (index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handle backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };
  
  // Handle paste from clipboard
  const handlePaste = async (index: number) => {
    try {
      const text = await Clipboard.getStringAsync();
      const digits = text.replace(/[^0-9]/g, '').split('').slice(0, 6);
      
      if (digits.length === 6) {
        const newCode = [...code];
        digits.forEach((digit: string, i: number) => {
          if (index + i < 6) {
            newCode[index + i] = digit;
          }
        });
        setCode(newCode);
        
        // Focus the last input
        const lastIndex = Math.min(index + digits.length - 1, 5);
        inputRefs[lastIndex].current?.focus();
      }
    } catch (error) {
      console.error('Error pasting from clipboard:', error);
    }
  };

  // Handle resend code
  const handleResend = () => {
    if (isResendDisabled) return;
    
    // Reset timer to 30 seconds
    setResendTime(30);
    setIsResendDisabled(true);
    
    // Here you would typically trigger the resend code API call
    console.log('Resending verification code...');
  };

  // Countdown timer for resend
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
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Gradient Background */}
        <LinearGradient
          colors={['#1F2937', '#171717']}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.contentContainer}
        >
          {/* Verification Content */}
          <View style={styles.verificationContainer}>
            {/* Email Icon */}
            <View style={styles.iconContainer}>
              <Ionicons name="mail" size={24} color="#3B82F6" />
            </View>
            
            {/* Title and Description */}
            <Text style={styles.title}>Enter verification code</Text>
            <Text style={styles.description}>
              Please enter the verification code we sent to your registered number/email to continue.
            </Text>
            
            {/* OTP Input Fields */}
            <View style={styles.otpContainer}>
              {code.map((digit, index) => {
                const inputStyle = [
                  styles.otpInputContainer,
                  isCodeComplete && styles.otpInputContainerComplete,
                  verificationSuccess && styles.otpInputContainerSuccess,
                  isVerifying && styles.otpInputContainerVerifying,
                ];
                
                return (
                  <Animated.View 
                    key={index} 
                    style={[
                      inputStyle,
                      verificationSuccess && {
                        transform: [{ scale: scale }],
                        backgroundColor: '#10B981',
                      },
                    ]}
                    entering={verificationSuccess ? FadeIn.delay(index * 100) : undefined}
                  >
                    {verificationSuccess ? (
                      <Ionicons name="checkmark" size={24} color="white" />
                    ) : (
                      <TextInput
                        ref={inputRefs[index]}
                        style={[styles.otpInput, verificationSuccess && { color: 'white' }]}
                        value={digit}
                        onChangeText={(text) => handleCodeChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        onFocus={() => {
                          inputRefs[index].current?.setNativeProps({
                            selection: { start: 0, end: 1 }
                          });
                        }}
                        onPressIn={() => {
                          if (digit === '' && index > 0) {
                            const firstEmptyIndex = code.findIndex(d => d === '');
                            const targetIndex = firstEmptyIndex === -1 ? index : Math.min(firstEmptyIndex, index);
                            inputRefs[targetIndex].current?.focus();
                          }
                        }}
onSubmitEditing={() => {
                          if (index < 5) {
                            inputRefs[index + 1].current?.focus();
                          } else if (isCodeComplete) {
                            handleVerify();
                          }
                        }}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                        textAlign="center"
                        autoFocus={index === 0}
                        selectionColor="#3B82F6"
                        cursorColor="#3B82F6"
                        editable={!isVerifying && !verificationSuccess}
                      />
                    )}
                  </Animated.View>
                );
              })}
            </View>
            
            {/* Resend Code */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Never received any code?{' '}
                <Text 
                  style={[
                    styles.resendLink, 
                    isResendDisabled && styles.resendLinkDisabled
                  ]}
                  onPress={handleResend}
                >
                  Resend
                </Text>
                {isResendDisabled && (
                  <Text style={styles.timerText}> ({resendTime}s)</Text>
                )}
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
        
        {/* Verify Button */}
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <CustomButton
              title={isVerifying ? 'Verifying...' : verificationSuccess ? 'Success!' : 'Verify'}
              onPress={handleVerify}
              variant={verificationSuccess ? 'gradient-accent' : 'gradient-accent'}
              width="full"
              disabled={!isCodeComplete || isVerifying || verificationSuccess}
            />
            {isVerifying && <ActivityIndicator style={styles.loadingIndicator} color="white" />}
          </View>
        </View>
        
        <StatusBar style="light" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(38, 38, 38, 0.7)',
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Geist-Bold',
  },
  description: {
    color: '#BABABA',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Geist-Regular',
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  otpInputContainer: {
    width: 50,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#374151',
    marginHorizontal: 4,
  },
  otpInputContainerSuccess: {
    backgroundColor: '#10B981',
  },
  otpInputContainerVerifying: {
    backgroundColor: 'rgba(16, 185, 129, 0.5)',
  },
  otpInputContainerComplete: {
    borderColor: '#3B82F6',
  },
  otpInput: {
    flex: 1,
    width: '100%',
    height: '100%',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Geist-Bold',
    padding: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  resendContainer: {
    marginTop: 10,
  },
  resendText: {
    color: '#BABABA',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Geist-Regular',
  },
  resendLink: {
    color: '#E5E7EB',
    textDecorationLine: 'underline',
  },
  resendLinkDisabled: {
    color: '#6B7280',
    textDecorationLine: 'none',
  },
  timerText: {
    color: '#BABABA',
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  buttonWrapper: {
    position: 'relative',
    width: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  verifyButton: {
    width: '100%',
  },
});
