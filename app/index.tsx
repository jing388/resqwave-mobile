import CustomButton from '@/components/custom-button';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Platform, Text, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1F2937', '#171717']}
      start={{ x: 0.5, y: 0.2 }}
      end={{ x: 0.8, y: 0.8 }}
      className="flex-1"
    >
      <View className="flex-1 px-6 relative">
        {/* Main content - centered */}
        <View className="flex-1 items-center justify-center">
          <Image 
            source={require('@/assets/images/resqwave-logo.png')}
            className="w-10 h-10 mb-4"
          />
          <Text className="font-geist-semibold text-white text-4xl leading-[1.5] text-center mb-12">
            Stronger Signals,{'\n'}Safer Communities.
          </Text>
        </View>
        
        {/* Fixed Bottom Area */}
        <View style={{ 
          padding: 20, 
          paddingBottom: Platform.OS === 'ios' ? 40 : 20,
          backgroundColor: '#171717',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0
        }}>
          <View className="mt-4 mb-2">
            <CustomButton
              title="Login"
              onPress={() => router.push('/login')}
              variant="gradient-accent"
              size="lg"
              width="full"
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}