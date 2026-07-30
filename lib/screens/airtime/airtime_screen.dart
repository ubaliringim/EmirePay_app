import 'package:flutter/material.dart';

import '../../models/network.dart';
import '../../services/vtpass_service.dart';
import '../../theme/app_theme.dart';
import '../../utils/formatters.dart';
import '../../widgets/network_selector.dart';

class AirtimeScreen extends StatefulWidget {
  const AirtimeScreen({super.key});

  @override
  State<AirtimeScreen> createState() => _AirtimeScreenState();
}

class _AirtimeScreenState extends State<AirtimeScreen> {
  static const _presets = [100, 200, 500, 1000, 2000, 5000];

  // Maps networkProviders index (MTN, Airtel, Glo, 9mob) to VTpass serviceID.
  // VTpass still uses the legacy "etisalat" serviceID for 9mobile.
  static const _serviceIds = ['mtn', 'airtel', 'glo', 'etisalat'];

  int _selectedNetwork = 3;
  final _phoneCtrl = TextEditingController();
  final _customAmountCtrl = TextEditingController();
  int? _selectedPreset = 100;
  bool _busy = false;
  bool _paid = false;
  String _reference = '';

  @override
  void initState() {
    super.initState();
    _customAmountCtrl.text = _selectedPreset.toString();
    _phoneCtrl.addListener(() => setState(() {}));
    _customAmountCtrl.addListener(() {
      final parsed = int.tryParse(_customAmountCtrl.text);
      if (parsed != _selectedPreset) {
        setState(
          () => _selectedPreset = _presets.contains(parsed) ? parsed : null,
        );
      }
    });
  }

  @override
  void dispose() {
    _phoneCtrl.dispose();
    _customAmountCtrl.dispose();
    super.dispose();
  }

  void _selectPreset(int value) {
    setState(() {
      _selectedPreset = value;
      _customAmountCtrl.text = value.toString();
    });
  }

  double get _amount => double.tryParse(_customAmountCtrl.text) ?? 0;

  bool get _canSubmit => _phoneCtrl.text.trim().length >= 10 && _amount > 0;

  Future<void> _submit() async {
    setState(() => _busy = true);
    try {
      final result = await VtpassService.purchaseAirtime(
        serviceID: _serviceIds[_selectedNetwork],
        amount: _amount,
        phone: _phoneCtrl.text.trim(),
      );
      if (!mounted) return;
      final succeeded = result['code']?.toString() == '000';
      if (succeeded) {
        setState(() {
          _reference = result['requestId']?.toString() ?? generateReference();
          _paid = true;
        });
      } else {
        final description =
            result['response_description']?.toString() ??
            'Purchase could not be completed.';
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(description)));
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString().replaceFirst('Exception: ', ''))),
      );
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Buy Airtime')),
      body: _paid ? _successView() : _formView(),
    );
  }

  Widget _formView() {
    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(
        20,
        0,
        20,
        24 + MediaQuery.of(context).padding.bottom,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.airtimeBg,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(
                color: AppColors.airtimeFg.withValues(alpha: 0.25),
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppColors.airtimeFg,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(
                    Icons.phone_android_rounded,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Airtime Top-Up',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Top up any number instantly',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Select Network',
            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
          ),
          const SizedBox(height: 12),
          NetworkSelector(
            selectedIndex: _selectedNetwork,
            onSelected: (i) => setState(() => _selectedNetwork = i),
          ),
          const SizedBox(height: 24),
          const Text(
            'Phone Number',
            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
          ),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              children: [
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 14),
                  child: Text('🇳🇬', style: TextStyle(fontSize: 20)),
                ),
                const Text(
                  '+234',
                  style: TextStyle(fontWeight: FontWeight.w600),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: _phoneCtrl,
                    keyboardType: TextInputType.phone,
                    decoration: const InputDecoration(
                      hintText: '0801 234 5678',
                      border: InputBorder.none,
                      filled: false,
                    ),
                  ),
                ),
                IconButton(
                  onPressed: () {},
                  icon: const Icon(
                    Icons.contact_page_rounded,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Quick Amount',
            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: _presets.map((p) {
              final selected = _selectedPreset == p;
              return ChoiceChip(
                label: Text('${formatNaira(p)}.00'),
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
                  side: BorderSide(
                    color: selected ? AppColors.primary : Colors.transparent,
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
          const Text(
            'Custom Amount (₦)',
            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
          ),
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
                        color: AppColors.airtimeBg,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        Icons.receipt_long_rounded,
                        color: AppColors.airtimeFg,
                        size: 16,
                      ),
                    ),
                    const SizedBox(width: 10),
                    const Text(
                      'Order Summary',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: Divider(height: 1),
                ),
                _summaryRow(
                  'Network',
                  networkProviders[_selectedNetwork].name,
                  valueColor: AppColors.primary,
                ),
                const SizedBox(height: 10),
                _summaryRow(
                  'Phone',
                  _phoneCtrl.text.trim().isEmpty ? '—' : _phoneCtrl.text.trim(),
                ),
                const SizedBox(height: 10),
                _summaryRow(
                  'Amount',
                  formatNaira(_amount),
                  valueColor: AppColors.primary,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: (_canSubmit && !_busy) ? _submit : null,
            icon: _busy
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : const Icon(Icons.phone_android_rounded, size: 18),
            label: Text(
              _busy ? 'Processing...' : 'Buy Airtime ${formatNaira(_amount)}',
            ),
          ),
        ],
      ),
    );
  }

  Widget _successView() {
    final network = networkProviders[_selectedNetwork];
    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(
        20,
        32,
        20,
        24 + MediaQuery.of(context).padding.bottom,
      ),
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
              child: const Icon(
                Icons.check_rounded,
                color: Colors.white,
                size: 44,
              ),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Payment Successful',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            'Airtime Purchase of ${formatNaira(_amount)} was completed.',
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: AppColors.textSecondary,
              fontSize: 15,
            ),
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
                _paddedRow('Amount', formatNaira(_amount)),
                _divider(),
                _paddedRow('Network', network.name),
                _divider(),
                _paddedRow('Phone', _phoneCtrl.text.trim()),
                _divider(),
                _paddedRow('Reference', _reference),
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
        Text(
          value,
          style: TextStyle(fontWeight: FontWeight.w600, color: valueColor),
        ),
      ],
    );
  }

  Widget _paddedRow(String label, String value, {Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: _summaryRow(label, value, valueColor: valueColor),
    );
  }

  Widget _divider() => const Divider(height: 1);
}
