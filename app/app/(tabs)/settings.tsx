import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView edges={['top']} style={styles.container}>
      <SettingsScreen onLogout={handleLogout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvasSoft,
  },
});
