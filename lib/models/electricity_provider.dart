class ElectricityProvider {
  final String name;
  final String serviceID;

  const ElectricityProvider({required this.name, required this.serviceID});
}

const List<ElectricityProvider> electricityProviders = [
  ElectricityProvider(name: 'Ikeja Electric', serviceID: 'ikeja-electric'),
  ElectricityProvider(name: 'Eko Electric (EKEDC)', serviceID: 'eko-electric'),
  ElectricityProvider(name: 'Abuja Electric (AEDC)', serviceID: 'abuja-electric'),
  ElectricityProvider(name: 'Port Harcourt Electric', serviceID: 'portharcourt-electric'),
  ElectricityProvider(name: 'Kaduna Electric', serviceID: 'kaduna-electric'),
];
