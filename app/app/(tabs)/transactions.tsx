import { View, StyleSheet } from 'react-native';
import { TransactionList } from '../../components/transactions';
import { Colors } from '../../constants/colors';

export default function TransactionsScreen() {
  return (
    <View style={styles.container}>
      <TransactionList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvasSoft,
  },
});
