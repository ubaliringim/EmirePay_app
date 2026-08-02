import { Tabs } from 'expo-router';
import { LayoutDashboard, ShoppingBag, ArrowLeftRight, Settings } from 'lucide-react-native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Rounded } from '../../constants/colors';

const TABS = [
  { name: 'index', label: 'Dashboard', icon: LayoutDashboard },
  { name: 'purchase', label: 'Purchase', icon: ShoppingBag },
  { name: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { name: 'settings', label: 'Settings', icon: Settings },
] as const;

function TabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        { paddingBottom: Math.max(insets.bottom, Spacing.sm) },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tab = TABS.find((t) => t.name === route.name);
        if (!tab) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const IconComponent = tab.icon;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View style={[styles.iconPill, isFocused && styles.iconPillActive]}>
              <IconComponent size={18} color={isFocused ? Colors.ink : Colors.body} />
            </View>
            <Text style={[styles.label, isFocused && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="purchase" options={{ title: 'Purchase' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: Spacing.sm,
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: Spacing.md,
  },
  iconPill: {
    height: 32,
    width: 48,
    borderRadius: Rounded.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPillActive: {
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.body,
  },
  labelActive: {
    color: Colors.secondary,
    fontWeight: '700',
  },
});
