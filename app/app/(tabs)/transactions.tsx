import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionList } from '../../components/transactions';
import { Colors } from '../../constants/colors';

export default function TransactionsScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <TransactionList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvasSoft,
  },
});
