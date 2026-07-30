class Recipient {
  final String name;
  final String phone;

  const Recipient({required this.name, required this.phone});

  String get initials {
    final parts = name.trim().split(' ');
    if (parts.length == 1) return parts.first.substring(0, 1).toUpperCase();
    return (parts.first.substring(0, 1) + parts.last.substring(0, 1)).toUpperCase();
  }
}

const List<Recipient> recentRecipients = [
  Recipient(name: 'Ibrahim Fatima', phone: '0802 771 2727'),
  Recipient(name: 'Adeyemi John', phone: '0810 234 5678'),
  Recipient(name: 'Chidinma Okafor', phone: '0703 456 1122'),
];
