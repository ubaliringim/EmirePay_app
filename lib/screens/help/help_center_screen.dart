import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../theme/app_theme.dart';
import 'raise_ticket_screen.dart';

class _Faq {
  final String question;
  final String answer;

  const _Faq(this.question, this.answer);
}

const _faqs = [
  _Faq(
    'How do I fund my wallet?',
    'Go to Wallet, choose an amount, then pay via card, bank transfer, or USSD. Card and bank transfer credit your wallet instantly.',
  ),
  _Faq(
    'Why did my transaction fail?',
    'Failed transactions are usually due to insufficient balance, network issues, or incorrect details (e.g. meter or smartcard number). Failed debits are automatically reversed within 24 hours.',
  ),
  _Faq(
    'How do I reset my transaction PIN?',
    'Go to More > Security & PIN > Change PIN. If you\'ve forgotten your PIN, use "Forgot PIN" on the sign-in screen to reset it via OTP.',
  ),
  _Faq(
    'How long does verification (KYC) take?',
    'BVN and NIN verification are usually instant. Higher KYC tiers that require document upload are reviewed within 24-48 hours.',
  ),
  _Faq(
    'Are there fees for sending money?',
    'Transfers to other EmirePay wallets are free. Transfers to external bank accounts attract a flat ₦25 fee.',
  ),
  _Faq(
    'Is my money safe with EmirePay?',
    'Yes. Your wallet is secured with PIN and biometric authentication, and all transactions are encrypted end-to-end.',
  ),
];

class HelpCenterScreen extends StatefulWidget {
  const HelpCenterScreen({super.key});

  @override
  State<HelpCenterScreen> createState() => _HelpCenterScreenState();
}

class _HelpCenterScreenState extends State<HelpCenterScreen> {
  final _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchCtrl.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  List<_Faq> get _filteredFaqs {
    final query = _searchCtrl.text.trim().toLowerCase();
    if (query.isEmpty) return _faqs;
    return _faqs.where((f) => f.question.toLowerCase().contains(query) || f.answer.toLowerCase().contains(query)).toList();
  }

  Future<void> _launch(Uri uri, String failMessage) async {
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(failMessage)));
    }
  }

  @override
  Widget build(BuildContext context) {
    final faqs = _filteredFaqs;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Help Center')),
      body: ListView(
        padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
        children: [
          TextField(
            controller: _searchCtrl,
            decoration: const InputDecoration(
              hintText: 'Search for help...',
              prefixIcon: Icon(Icons.search_rounded),
            ),
          ),
          const SizedBox(height: 20),
          const Text('Contact Us', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _contactTile(
                  icon: Icons.chat_bubble_outline_rounded,
                  label: 'Live Chat',
                  color: AppColors.primary,
                  bg: AppColors.bettingBg,
                  onTap: () => ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Live chat is coming soon')),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _contactTile(
                  icon: Icons.call_outlined,
                  label: 'Call Us',
                  color: AppColors.success,
                  bg: const Color(0xFFDCF3E2),
                  onTap: () => _launch(
                    Uri(scheme: 'tel', path: '+2348000000000'),
                    'Could not open the phone app',
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _contactTile(
                  icon: Icons.mail_outline_rounded,
                  label: 'Email',
                  color: AppColors.dataFg,
                  bg: AppColors.dataBg,
                  onTap: () => _launch(
                    Uri(scheme: 'mailto', path: 'support@emirepay.com'),
                    'Could not open the email app',
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: () => _launch(
              Uri.parse('https://wa.me/2348000000000'),
              'Could not open WhatsApp',
            ),
            icon: const Icon(Icons.chat_rounded, size: 18),
            label: const Text('Chat with us on WhatsApp'),
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Frequently Asked Questions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 12),
          if (faqs.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: Text('No results found. Try a different search term.', style: TextStyle(color: AppColors.textSecondary)),
            )
          else
            Container(
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
              child: Column(
                children: faqs.asMap().entries.map((entry) {
                  final isLast = entry.key == faqs.length - 1;
                  return Column(
                    children: [
                      Theme(
                        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                        child: ExpansionTile(
                          title: Text(entry.value.question, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                          childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                          expandedAlignment: Alignment.topLeft,
                          children: [
                            Text(entry.value.answer, style: const TextStyle(color: AppColors.textSecondary)),
                          ],
                        ),
                      ),
                      if (!isLast) const Divider(height: 1, indent: 16, endIndent: 16),
                    ],
                  );
                }).toList(),
              ),
            ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const RaiseTicketScreen()),
            ),
            icon: const Icon(Icons.confirmation_number_outlined, size: 18),
            label: const Text('Raise a Ticket'),
          ),
        ],
      ),
    );
  }

  Widget _contactTile({
    required IconData icon,
    required String label,
    required Color color,
    required Color bg,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
        child: Column(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: color),
            ),
            const SizedBox(height: 8),
            Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}
