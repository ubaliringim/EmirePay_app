class InternetProvider {
  final String name;
  final String serviceID;

  const InternetProvider({required this.name, required this.serviceID});
}

const List<InternetProvider> internetProviders = [
  InternetProvider(name: 'Smile', serviceID: 'smile-direct'),
  InternetProvider(name: 'Spectranet', serviceID: 'spectranet'),
];

/// A live VTpass data plan variation for a given internet provider.
class InternetPlan {
  final String variationCode;
  final String name;
  final double price;

  const InternetPlan({
    required this.variationCode,
    required this.name,
    required this.price,
  });
}

class SmileAccount {
  final String accountId;
  final String name;

  const SmileAccount({required this.accountId, required this.name});
}
