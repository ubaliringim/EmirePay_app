import 'package:flutter/material.dart';

import '../../models/betting_platform.dart';
import '../../theme/app_theme.dart';
import '../../utils/formatters.dart';

class FundBettingScreen extends StatefulWidget {
  const FundBettingScreen({super.key});

  @override
  State<FundBettingScreen> createState() => _FundBettingScreenState();
}

class _FundBettingScreenState extends State<FundBettingScreen> {
  static const _presets = [500, 1000, 2000, 5000];

  int _selectedPlatform = 0;
  final _userIdCtrl = TextEditingController();
  final _customAmountCtrl = TextEditingController();
  int? _selectedPreset;
  bool _paid = false;
  String _reference = '';

  @override
  void initState() {
    super.initState();
    _userIdCtrl.addListener(() => setState(() {}));
    _customAmountCtrl.addListener(() {
      final parsed = int.tryParse(_customAmountCtrl.text);
      if (parsed != _selectedPreset) {
        setState(() => _selectedPreset = _presets.contains(parsed) ? parsed : null);
      } else {
        setState(() {});
      }
    });
  }

  @override
  void dispose() {
    _userIdCtrl.dispose();
    _customAmountCtrl.dispose();
    super.dispose();
  }

  double get _amount => double.tryParse(_customAmountCtrl.text) ?? 0;

  bool get _canFund => _userIdCtrl.text.trim().isNotEmpty && _amount > 0;

  void _selectPreset(int value) {
    setState(() {
      _selectedPreset = value;
      _customAmountCtrl.text = value.toString();
    });
  }

  void _fund() {
    setState(() {
      _reference = generateReference();
      _paid = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Fund Betting Account')),
      body: _paid ? _successView() : _formView(),
    );
  }

  Widget _formView() {
    final platform = bettingPlatforms[_selectedPlatform];
    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.bettingBg,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.primary.withValues(alpha: 0.25)),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(Icons.sports_esports_rounded, color: Colors.white),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Betting Wallet', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      SizedBox(height: 2),
                      Text(
                        'Fund your account instantly',
                        style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text('Select Platform', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 2.6,
            children: List.generate(bettingPlatforms.length, (i) {
              final p = bettingPlatforms[i];
              final selected = _selectedPlatform == i;
              return InkWell(
                onTap: () => setState(() => _selectedPlatform = i),
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  decoration: BoxDecoration(
                    color: selected ? p.color.withValues(alpha: 0.12) : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: selected ? p.color : Colors.transparent,
                      width: 1.5,
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: p.color.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(p.icon, color: p.color, size: 18),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              p.name,
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                color: selected ? p.color : AppColors.textPrimary,
                              ),
                            ),
                            if (selected)
                              Text(
                                'Selected',
                                style: TextStyle(fontSize: 11, color: p.color),
                              ),
                          ],
                        ),
                      ),
                      if (selected)
                        Container(
                          width: 20,
                          height: 20,
                          decoration: BoxDecoration(color: p.color, shape: BoxShape.circle),
                          child: const Icon(Icons.check_rounded, color: Colors.white, size: 14),
                        ),
                    ],
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 24),
          const Text('User ID / Account ID', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          TextField(
            controller: _userIdCtrl,
            decoration: const InputDecoration(
              hintText: 'Enter your betting account ID',
              prefixIcon: Icon(Icons.person_outline_rounded),
            ),
          ),
          const SizedBox(height: 24),
          const Text('Quick Amount', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: _presets.map((p) {
              final selected = _selectedPreset == p;
              return ChoiceChip(
                label: Text(formatNaira(p)),
                selected: selected,
                onSelected: (_) => _selectPreset(p),
                selectedColor: AppColors.primary.withValues(alpha: 0.12),
                backgroundColor: Colors.white,
                labelStyle: TextStyle(
                  color: selected ? AppColors.primary : AppColors.textPrimary,
                  fontWeight: FontWeight.w600,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: BorderSide(color: selected ? AppColors.primary : Colors.transparent),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
          const Text('Custom Amount (₦)', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          TextField(
            controller: _customAmountCtrl,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(
              prefixIcon: Padding(
                padding: EdgeInsets.only(left: 16, right: 8),
                child: Text('₦', style: TextStyle(fontSize: 16)),
              ),
              prefixIconConstraints: BoxConstraints(minWidth: 0, minHeight: 0),
              hintText: 'Enter amount',
            ),
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: AppColors.bettingBg,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.receipt_long_rounded, color: AppColors.primary, size: 16),
                    ),
                    const SizedBox(width: 10),
                    const Text('Order Summary', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: Divider(height: 1),
                ),
                _summaryRow('Platform', platform.name, valueColor: platform.color),
                const SizedBox(height: 10),
                _summaryRow('User ID', _userIdCtrl.text.trim().isEmpty ? '—' : _userIdCtrl.text.trim()),
                const SizedBox(height: 10),
                _summaryRow(
                  'Amount',
                  _amount > 0 ? formatNaira(_amount) : '—',
                  valueColor: _amount > 0 ? AppColors.primary : null,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _canFund ? _fund : null,
            icon: const Icon(Icons.account_balance_wallet_rounded, size: 18),
            label: Text('Fund Account ${formatNaira(_amount)}'),
          ),
          const SizedBox(height: 12),
          const Center(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.shield_outlined, size: 14, color: AppColors.textSecondary),
                SizedBox(width: 6),
                Text(
                  'Secured & encrypted transaction',
                  style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _successView() {
    final platform = bettingPlatforms[_selectedPlatform];
    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(20, 32, 20, 24 + MediaQuery.of(context).padding.bottom),
      child: Column(
        children: [
          Container(
            width: 130,
            height: 130,
            decoration: BoxDecoration(
              color: AppColors.success.withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            alignment: Alignment.center,
            child: Container(
              width: 90,
              height: 90,
              decoration: const BoxDecoration(
                color: AppColors.success,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_rounded, color: Colors.white, size: 44),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Payment Successful',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            'Betting Wallet Funding of ${formatNaira(_amount)} was completed.',
            textAlign: TextAlign.center,
            style: const TextStyle(color: AppColors.textSecondary, fontSize: 15),
          ),
          const SizedBox(height: 24),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
            ),
            child: Column(
              children: [
                _successRow('Amount', formatNaira(_amount)),
                _divider(),
                _successRow('Platform', platform.name),
                _divider(),
                _successRow('User ID', _userIdCtrl.text.trim()),
                _divider(),
                _successRow('Type', 'Wallet Top-up'),
                _divider(),
                _successRow('Reference', _reference),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.ios_share_rounded, size: 16),
                  label: const Text('Share'),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('Done'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _summaryRow(String label, String value, {Color? valueColor}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: AppColors.textSecondary)),
        Text(value, style: TextStyle(fontWeight: FontWeight.w600, color: valueColor)),
      ],
    );
  }

  Widget _successRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _divider() => const Divider(height: 1);
}
