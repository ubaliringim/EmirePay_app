import 'dart:math';

String generateReference() {
  final rand = Random();
  return 'EMR-${10000000 + rand.nextInt(89999999)}';
}

String formatNaira(num amount) {
  final s = amount.toStringAsFixed(amount % 1 == 0 ? 0 : 2);
  final parts = s.split('.');
  final whole = parts[0];
  final buffer = StringBuffer();
  for (int i = 0; i < whole.length; i++) {
    final posFromEnd = whole.length - i;
    buffer.write(whole[i]);
    if (posFromEnd > 1 && posFromEnd % 3 == 1) {
      buffer.write(',');
    }
  }
  if (parts.length > 1) {
    return '₦${buffer.toString()}.${parts[1]}';
  }
  return '₦${buffer.toString()}';
}
