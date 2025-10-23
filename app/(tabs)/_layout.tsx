import { Tabs } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TabBarIcon = ({ focused, source, style }: { focused: boolean; source: any; style?: any }) => (
  <View style={[styles.tabIconContainer, focused && styles.activeTab]}>  
    <Image 
      source={source} 
      style={[styles.tabIcon, style]} 
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
          height: 80,
          backgroundColor: '#1A1A1A',
          borderTopWidth: 1,
          borderTopColor: '#2D2D2D',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused}
              source={require('@/assets/images/map-navigator.png')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="layers"
        options={{
          title: 'Layers',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused}
              source={require('@/assets/images/layer-menu-stack.png')}
              style={{ width: 22, height: 22 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused}
              source={require('@/assets/images/clipboard-navigator.png')}
              style={{ width: 20, height: 20 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'rgba(58, 130, 247, 0.15)',
  },
  tabIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
});
