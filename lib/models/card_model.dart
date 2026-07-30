class CardModel {
  final String fullNumber;
  final String expiry;
  final String cvv;
  bool isDefault;
  bool isFrozen;
  double dailyLimit;

  CardModel({
    required this.fullNumber,
    required this.expiry,
    this.cvv = '123',
    this.isDefault = false,
    this.isFrozen = false,
    this.dailyLimit = 200000,
  });

  String get last4 => fullNumber.substring(fullNumber.length - 4);

  String get masked => '•••• •••• •••• $last4';
}
