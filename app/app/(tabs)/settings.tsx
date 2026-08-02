import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SettingsScreen } from '../../components/settings';
import { Colors } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';

export default function SettingsTab() {
  const router = useRouter();
  const { logout } = useUserStore();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <SettingsScreen onLogout={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvasSoft,
  },
});
