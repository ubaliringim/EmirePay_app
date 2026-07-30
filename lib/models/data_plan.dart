/// A live VTpass data bundle variation for a given network.
class DataPlan {
  final String variationCode;
  final String name;
  final double price;

  const DataPlan({
    required this.variationCode,
    required this.name,
    required this.price,
  });
}
