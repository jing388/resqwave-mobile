import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';

const TabBarIcon = ({ focused, source, style }: { focused: boolean; source: any; style?: any }) => (
  <View className={`w-15 h-15 rounded-lg justify-center items-center ${focused ? 'bg-blue-500/15' : ''}`}>  
    <Image 
      source={source} 
      className="w-10 h-10"
      style={[{ tintColor: '#FFFFFF' }, style]} 
      resizeMode="contain"
    />
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: 10,
          height: 80,
          backgroundColor: '#1A1A1A',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Barangay Map',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused}
              source={require('@/assets/images/map-navigator.png')}
              style={{ width: 60, height: 60 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about-neighborhood"
        options={{
          title: 'About Neighborhood',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused}
              source={require('@/assets/images/layer-menu-stack.png')}
              style={{ width: 22, height: 22 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
