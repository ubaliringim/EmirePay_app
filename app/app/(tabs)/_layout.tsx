import { Tabs } from 'expo-router';
import { Home, Receipt, PlusCircle, Settings } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.mute,
        tabBarStyle: {
          backgroundColor: Colors.canvas,
          borderTopWidth: 1,
          borderTopColor: Colors.canvasSoft,
          paddingBottom: Spacing.lg,
          paddingTop: Spacing.sm,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, size }) => <Receipt size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="purchase"
        options={{
          title: 'Purchase',
          tabBarIcon: ({ color, size }) => <PlusCircle size={size + 8} color={Colors.secondary} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
