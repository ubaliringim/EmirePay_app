import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../theme/app_theme.dart';
import '../../utils/formatters.dart';

class _ReferralEntry {
  final String name;
  final String status;
  final double reward;

  const _ReferralEntry(this.name, this.status, this.reward);
}

const _referralHistory = [
  _ReferralEntry('Ibrahim Fatima', 'Completed', 500),
  _ReferralEntry('Adeyemi John', 'Completed', 500),
  _ReferralEntry('Chidinma Okafor', 'Pending', 500),
];

class ReferEarnScreen extends StatelessWidget {
  const ReferEarnScreen({super.key});

  static const _referralCode = 'MANNIR500';
  static const _referralLink = 'https://emirepay.app/r/MANNIR500';

  Future<void> _copyCode(BuildContext context) async {
    await Clipboard.setData(const ClipboardData(text: _referralCode));
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Referral code copied')),
    );
  }

  Future<void> _shareVia(BuildContext context, Uri uri, String failMessage) async {
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(failMessage)));
    }
  }

  @override
  Widget build(BuildContext context) {
    const shareText = 'Join me on EmirePay and get instant bill payments! Use my code $_referralCode: $_referralLink';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Refer & Earn')),
      body: ListView(
        padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: AppColors.primaryGradient,
              ),
              borderRadius: BorderRadius.circular(22),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.card_giftcard_rounded, color: Colors.white, size: 32),
                const SizedBox(height: 12),
                Text('Refer & Earn ${formatNaira(500)}', style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                const Text(
                  'Invite friends to EmirePay and earn ₦500 for every friend who funds their wallet.',
                  style: TextStyle(color: Colors.white70),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Your Referral Code', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
                        ),
                        alignment: Alignment.center,
                        child: const Text(
                          _referralCode,
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, letterSpacing: 2),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    InkWell(
                      onTap: () => _copyCode(context),
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(color: AppColors.bettingBg, borderRadius: BorderRadius.circular(12)),
                        child: const Icon(Icons.copy_rounded, color: AppColors.primary),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => _shareVia(
                          context,
                          Uri.parse('https://wa.me/?text=${Uri.encodeComponent(shareText)}'),
                          'Could not open WhatsApp',
                        ),
                        icon: const Icon(Icons.chat_rounded, size: 16),
                        label: const Text('WhatsApp'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => _shareVia(
                          context,
                          Uri(scheme: 'sms', queryParameters: {'body': shareText}),
                          'Could not open Messages',
                        ),
                        icon: const Icon(Icons.sms_outlined, size: 16),
                        label: const Text('SMS'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(child: _statTile('Total Referrals', '5')),
              const SizedBox(width: 10),
              Expanded(child: _statTile('Pending', formatNaira(500))),
              const SizedBox(width: 10),
              Expanded(child: _statTile('Earned', formatNaira(2000))),
            ],
          ),
          const SizedBox(height: 20),
          const Text('How it works', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
            child: Column(
              children: [
                _stepRow('1', 'Share your referral code or link with friends'),
                _stepRow('2', 'They sign up and fund their wallet for the first time'),
                _stepRow('3', 'You both get ₦500 credited automatically', isLast: true),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text('Referral History', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
            child: Column(
              children: _referralHistory.asMap().entries.map((entry) {
                final isLast = entry.key == _referralHistory.length - 1;
                final r = entry.value;
                final completed = r.status == 'Completed';
                return Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 18,
                            backgroundColor: AppColors.primary.withValues(alpha: 0.15),
                            child: Text(
                              r.name.substring(0, 1),
                              style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(r.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: (completed ? AppColors.success : AppColors.electricityFg).withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              r.status,
                              style: TextStyle(
                                color: completed ? AppColors.success : AppColors.electricityFg,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Text(formatNaira(r.reward), style: const TextStyle(fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                    if (!isLast) const Divider(height: 1),
                  ],
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'Referral Terms: Rewards are credited once your referred friend completes their first wallet funding of at least ₦1,000. EmirePay reserves the right to withhold rewards in cases of suspected fraud.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _statTile(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 10),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Column(
        children: [
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 4),
          Text(label, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
        ],
      ),
    );
  }

  Widget _stepRow(String number, String text, {bool isLast = false}) {
    return Padding(
      padding: EdgeInsets.only(bottom: isLast ? 0 : 14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 26,
            height: 26,
            decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
            alignment: Alignment.center,
            child: Text(number, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
          ),
          const SizedBox(width: 12),
          Expanded(child: Text(text)),
        ],
      ),
    );
  }
}
