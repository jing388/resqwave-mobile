import CustomButton from '@/components/custom-button';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Text, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1F2937', '#171717']}
      start={{ x: 0.5, y: 0.2 }}
      end={{ x: 0.8, y: 0.8 }}
      className="flex-1"
    >
      <View className="flex-1 px-6">
        {/* Main content - centered */}
        <View className="flex-1 items-center justify-center">
          <Image 
            source={require('@/assets/images/resqwave-logo.png')}
            className="w-10 h-10 mb-8"
          />
          <Text className="font-geist-semibold text-white text-4xl leading-[1.5] text-center">
            Stronger Signals,{'\n'}Safer Communities.
          </Text>
        </View>
        
        {/* Buttons - at bottom */}
        <View className="w-full gap-4 pb-8">
          <CustomButton 
              title="Get Started" 
              onPress={() => router.push('/(tabs)')}
              variant="gradient-accent"
              size="lg"
              className="w-full"
          />
          <CustomButton
              title="Login"
              onPress={() => router.push('/(auth)/login')}
              variant="gradient-gray"
              size="lg"
              className="w-full"
          />
        </View>
      </View>
    </LinearGradient>
  );
}
