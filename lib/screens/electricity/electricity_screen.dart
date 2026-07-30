import 'package:flutter/material.dart';

import '../../models/electricity_provider.dart';
import '../../services/vtpass_service.dart';
import '../../theme/app_theme.dart';
import '../../utils/formatters.dart';

enum _MeterType { prepaid, postpaid }

class _VerifiedCustomer {
  final String name;
  final String address;
  final String tariff;

  const _VerifiedCustomer({
    required this.name,
    required this.address,
    required this.tariff,
  });
}

class ElectricityScreen extends StatefulWidget {
  const ElectricityScreen({super.key});

  @override
  State<ElectricityScreen> createState() => _ElectricityScreenState();
}

class _ElectricityScreenState extends State<ElectricityScreen> {
  static const _presets = [1000, 2000, 5000, 10000];

  ElectricityProvider? _provider;
  _MeterType _meterType = _MeterType.prepaid;
  final _meterCtrl = TextEditingController();
  final _amountCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  bool _checkingBill = false;
  bool _paying = false;
  String? _verifyError;
  _VerifiedCustomer? _customer;
  bool _paid = false;
  String _reference = '';

  @override
  void initState() {
    super.initState();
    _meterCtrl.addListener(() => setState(() {}));
    _amountCtrl.addListener(() => setState(() {}));
    _phoneCtrl.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _meterCtrl.dispose();
    _amountCtrl.dispose();
    _phoneCtrl.dispose();
    super.dispose();
  }

  double get _amount => double.tryParse(_amountCtrl.text) ?? 0;

  bool get _canPay =>
      _provider != null &&
      _customer != null &&
      _amount > 0 &&
      _phoneCtrl.text.trim().length >= 10 &&
      !_paying;

  String get _meterTypeValue =>
      _meterType == _MeterType.prepaid ? 'prepaid' : 'postpaid';

  Future<void> _checkBill() async {
    final provider = _provider;
    if (provider == null || _meterCtrl.text.trim().isEmpty || _checkingBill) {
      return;
    }
    setState(() {
      _checkingBill = true;
      _verifyError = null;
      _customer = null;
    });
    try {
      final result = await VtpassService.verifyMeter(
        serviceID: provider.serviceID,
        meterNumber: _meterCtrl.text.trim(),
        meterType: _meterTypeValue,
      );
      if (!mounted) return;
      final succeeded = result['code']?.toString() == '000';
      if (!succeeded) {
        setState(() {
          _verifyError =
              result['response_description']?.toString() ??
              'Could not verify this meter number.';
        });
        return;
      }
      final content =
          (result['content'] as Map?)?.cast<String, dynamic>() ?? {};
      setState(() {
        _customer = _VerifiedCustomer(
          name: content['Customer_Name']?.toString() ?? 'Unknown',
          address: content['Address']?.toString() ?? '—',
          tariff: content['Meter_Type']?.toString() ?? _meterTypeValue,
        );
      });
    } catch (e) {
      if (!mounted) return;
      setState(
        () => _verifyError = e.toString().replaceFirst('Exception: ', ''),
      );
    } finally {
      if (mounted) setState(() => _checkingBill = false);
    }
  }

  void _selectPreset(int value) {
    setState(() => _amountCtrl.text = value.toString());
  }

  Future<void> _pay() async {
    final provider = _provider;
    if (provider == null || _customer == null) return;
    setState(() => _paying = true);
    try {
      final result = await VtpassService.purchaseElectricity(
        serviceID: provider.serviceID,
        meterNumber: _meterCtrl.text.trim(),
        meterType: _meterTypeValue,
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
      if (mounted) setState(() => _paying = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Electricity')),
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
              color: AppColors.electricityBg,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(
                color: AppColors.electricityFg.withValues(alpha: 0.25),
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppColors.electricityFg,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(
                    Icons.lightbulb_rounded,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Text(
                    'Pay your electricity bill in seconds',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Select Provider',
            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
          ),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButtonFormField<ElectricityProvider>(
                initialValue: _provider,
                isExpanded: true,
                icon: const Icon(Icons.keyboard_arrow_down_rounded),
                decoration: const InputDecoration(
                  hintText: 'Choose electricity provider',
                ),
                items: electricityProviders
                    .map((p) => DropdownMenuItem(value: p, child: Text(p.name)))
                    .toList(),
                onChanged: (value) => setState(() {
                  _provider = value;
                  _customer = null;
                  _verifyError = null;
                }),
              ),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Meter Type',
            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: const Color(0xFFE7EBE9),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              children: [
                _meterTypeSegment('Prepaid', _MeterType.prepaid),
                _meterTypeSegment('Postpaid', _MeterType.postpaid),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Meter Number',
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
                Expanded(
                  child: TextField(
                    controller: _meterCtrl,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      hintText: 'Enter meter number',
                      border: InputBorder.none,
                      filled: false,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: _checkingBill
                      ? const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 12),
                          child: SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          ),
                        )
                      : TextButton(
                          onPressed:
                              (_provider == null ||
                                  _meterCtrl.text.trim().isEmpty)
                              ? null
                              : _checkBill,
                          child: const Text('Check Bill'),
                        ),
                ),
              ],
            ),
          ),
          if (_verifyError != null) ...[
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.electricityBg,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Text(
                _verifyError!,
                style: const TextStyle(color: AppColors.electricityFg),
              ),
            ),
          ],
          if (_customer != null) ...[
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFDCF3E2),
                borderRadius: BorderRadius.circular(16),
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
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(
                          Icons.verified_user_rounded,
                          color: AppColors.success,
                          size: 18,
                        ),
                      ),
                      const SizedBox(width: 10),
                      const Expanded(
                        child: Text(
                          'Customer Verified',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: AppColors.success,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  _customerRow('Customer', _customer!.name),
                  const SizedBox(height: 6),
                  _customerRow('Address', _customer!.address),
                  const SizedBox(height: 6),
                  _customerRow('Meter Type', _customer!.tariff),
                ],
              ),
            ),
          ],
          const SizedBox(height: 24),
          const Text(
            'Phone Number',
            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _phoneCtrl,
            keyboardType: TextInputType.phone,
            decoration: const InputDecoration(
              hintText: 'Enter phone number for receipt',
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Amount (₦)',
            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _amountCtrl,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(hintText: 'Enter amount'),
          ),
          const SizedBox(height: 14),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: _presets.map((p) {
              final selected = _amountCtrl.text == p.toString();
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
                  side: BorderSide(
                    color: selected ? AppColors.primary : Colors.transparent,
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _canPay ? _pay : null,
            icon: _paying
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : const Icon(Icons.bolt_rounded, size: 18),
            label: Text(
              _paying ? 'Processing...' : 'Pay ${formatNaira(_amount)}',
            ),
          ),
        ],
      ),
    );
  }

  Widget _meterTypeSegment(String label, _MeterType type) {
    final selected = _meterType == type;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() {
          _meterType = type;
          _customer = null;
          _verifyError = null;
        }),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: selected ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            boxShadow: selected
                ? [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.06),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              color: selected ? AppColors.primary : AppColors.textSecondary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }

  Widget _customerRow(String label, String value) {
    return Row(
      children: [
        SizedBox(
          width: 90,
          child: Text(
            label,
            style: const TextStyle(color: AppColors.textSecondary),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
        ),
      ],
    );
  }

  Widget _successView() {
    final provider = _provider!;
    final customer = _customer!;
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
            'Electricity Bill of ${formatNaira(_amount)} was completed.',
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
                _summaryRow('Amount', formatNaira(_amount)),
                _divider(),
                _summaryRow('Provider', provider.name),
                _divider(),
                _summaryRow('Meter Number', _meterCtrl.text.trim()),
                _divider(),
                _summaryRow('Customer', customer.name),
                _divider(),
                _summaryRow('Reference', _reference),
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

  Widget _summaryRow(String label, String value) {
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
