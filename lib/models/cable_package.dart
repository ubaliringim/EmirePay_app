class CableProvider {
  final String name;
  final String serviceID;

  const CableProvider({required this.name, required this.serviceID});
}

const List<CableProvider> cableProviders = [
  CableProvider(name: 'DStv', serviceID: 'dstv'),
  CableProvider(name: 'GOtv', serviceID: 'gotv'),
  CableProvider(name: 'StarTimes', serviceID: 'startimes'),
];

/// A live VTpass bouquet variation for a given cable TV provider.
class CablePackage {
  final String variationCode;
  final String name;
  final double price;

  const CablePackage({
    required this.variationCode,
    required this.name,
    required this.price,
  });
}
