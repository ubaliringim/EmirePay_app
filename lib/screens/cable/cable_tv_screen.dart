import 'package:flutter/material.dart';

import '../../models/cable_package.dart';
import '../../services/vtpass_service.dart';
import '../../theme/app_theme.dart';
import '../../utils/formatters.dart';

class _VerifiedAccount {
  final String customer;
  final String smartcard;
  final String status;

  const _VerifiedAccount({
    required this.customer,
    required this.smartcard,
    required this.status,
  });
}

class CableTvScreen extends StatefulWidget {
  const CableTvScreen({super.key});

  @override
  State<CableTvScreen> createState() => _CableTvScreenState();
}

class _CableTvScreenState extends State<CableTvScreen> {
  CableProvider? _provider;
  final _smartcardCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  bool _verifying = false;
  String? _verifyError;
  _VerifiedAccount? _account;

  List<CablePackage> _plans = [];
  bool _loadingPlans = false;
  String? _plansError;
  int? _selectedPackage;

  bool _paying = false;
  bool _paid = false;
  String _reference = '';

  @override
  void initState() {
    super.initState();
    _smartcardCtrl.addListener(() => setState(() {}));
    _phoneCtrl.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _smartcardCtrl.dispose();
    _phoneCtrl.dispose();
    super.dispose();
  }

  CablePackage? get _package => _selectedPackage == null ? null : _plans[_selectedPackage!];

  bool get _canPay =>
      _account != null && _package != null && _phoneCtrl.text.trim().length >= 10 && !_paying;

  Future<void> _loadPlans() async {
    final provider = _provider;
    if (provider == null) return;
    setState(() {
      _loadingPlans = true;
      _plansError = null;
      _selectedPackage = null;
      _plans = [];
    });
    try {
      final plans = await VtpassService.fetchCablePlans(provider.serviceID);
      if (!mounted) return;
      setState(() => _plans = plans);
    } catch (e) {
      if (!mounted) return;
      setState(() => _plansError = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loadingPlans = false);
    }
  }

  Future<void> _verify() async {
    final provider = _provider;
    if (provider == null || _smartcardCtrl.text.trim().isEmpty || _verifying) return;
    setState(() {
      _verifying = true;
      _verifyError = null;
      _account = null;
    });
    try {
      final result = await VtpassService.verifySmartcard(
        serviceID: provider.serviceID,
        smartcardNumber: _smartcardCtrl.text.trim(),
      );
      if (!mounted) return;
      final succeeded = result['code']?.toString() == '000';
      if (!succeeded) {
        setState(() {
          _verifyError = result['response_description']?.toString() ?? 'Could not verify this smartcard number.';
        });
        return;
      }
      final content = (result['content'] as Map?)?.cast<String, dynamic>() ?? {};
      setState(() {
        _account = _VerifiedAccount(
          customer: content['Customer_Name']?.toString() ?? 'Unknown',
          smartcard: _smartcardCtrl.text.trim(),
          status: content['Status']?.toString() ?? '—',
        );
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _verifyError = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _verifying = false);
    }
  }

  Future<void> _pay() async {
    final provider = _provider;
    final package = _package;
    if (provider == null || package == null || _account == null) return;
    setState(() => _paying = true);
    try {
      final result = await VtpassService.purchaseCableTv(
        serviceID: provider.serviceID,
        smartcardNumber: _account!.smartcard,
        variationCode: package.variationCode,
        amount: package.price,
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
        final description = result['response_description']?.toString() ?? 'Purchase could not be completed.';
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(description)));
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
      appBar: AppBar(title: const Text('Cable TV')),
      body: _paid ? _successView() : _formView(),
    );
  }

  Widget _formView() {
    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.cableBg,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.cableFg.withValues(alpha: 0.25)),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppColors.cableFg,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(Icons.tv_rounded, color: Colors.white),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Text(
                    'Renew your cable TV subscription instantly',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text('Select Provider', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButtonFormField<CableProvider>(
                initialValue: _provider,
                isExpanded: true,
                icon: const Icon(Icons.keyboard_arrow_down_rounded),
                decoration: const InputDecoration(hintText: 'Choose cable TV provider'),
                items: cableProviders
                    .map((p) => DropdownMenuItem(value: p, child: Text(p.name)))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _provider = value;
                    _account = null;
                    _verifyError = null;
                    _smartcardCtrl.clear();
                  });
                  _loadPlans();
                },
              ),
            ),
          ),
          const SizedBox(height: 24),
          const Text('Smartcard / IUC Number', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
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
                    controller: _smartcardCtrl,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      hintText: 'Enter smartcard number',
                      border: InputBorder.none,
                      filled: false,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: _verifying
                      ? const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 12),
                          child: SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          ),
                        )
                      : TextButton(
                          onPressed: (_smartcardCtrl.text.trim().isEmpty || _provider == null)
                              ? null
                              : _verify,
                          style: TextButton.styleFrom(foregroundColor: AppColors.cableFg),
                          child: const Text('Verify'),
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
                color: AppColors.cableBg,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Text(_verifyError!, style: const TextStyle(color: AppColors.cableFg)),
            ),
          ],
          if (_account != null) ...[
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.cableBg,
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
                        child: Icon(Icons.verified_user_rounded, color: AppColors.cableFg, size: 18),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          'Account Verified',
                          style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.cableFg),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.success.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          _account!.status,
                          style: const TextStyle(
                            color: AppColors.success,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  _infoRow('Customer', _account!.customer),
                  const SizedBox(height: 6),
                  _infoRow('Smartcard', _account!.smartcard),
                  const SizedBox(height: 6),
                  _infoRow('Provider', _provider!.name),
                ],
              ),
            ),
          ],
          const SizedBox(height: 24),
          const Text('Phone Number', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          TextField(
            controller: _phoneCtrl,
            keyboardType: TextInputType.phone,
            decoration: const InputDecoration(hintText: 'Enter phone number for receipt'),
          ),
          const SizedBox(height: 24),
          const Text('Select Package', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          if (_provider == null)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8),
              child: Text(
                'Choose a provider to see available packages',
                style: TextStyle(color: AppColors.textSecondary),
              ),
            )
          else if (_loadingPlans)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 32),
              child: Center(child: CircularProgressIndicator()),
            )
          else if (_plansError != null)
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.cableBg,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_plansError!, style: const TextStyle(color: AppColors.cableFg)),
                  const SizedBox(height: 10),
                  TextButton(onPressed: _loadPlans, child: const Text('Try Again')),
                ],
              ),
            )
          else if (_plans.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: Text('No packages available for this provider right now.'),
            )
          else if (_selectedPackage != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: const Color(0xFFDCF3E2),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primary, width: 1.5),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppColors.cableBg,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(Icons.tv_rounded, color: AppColors.cableFg),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        _plans[_selectedPackage!].name,
                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                      ),
                    ),
                    Text(
                      formatNaira(_plans[_selectedPackage!].price),
                      style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.success),
                    ),
                    const SizedBox(width: 8),
                    TextButton(
                      onPressed: () => setState(() => _selectedPackage = null),
                      child: const Text('Change'),
                    ),
                  ],
                ),
              ),
            )
          else
            ...List.generate(_plans.length, (i) {
              final package = _plans[i];
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: InkWell(
                  onTap: () => setState(() => _selectedPackage = i),
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.transparent, width: 1.5),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: AppColors.cableBg,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(Icons.tv_rounded, color: AppColors.cableFg),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Text(
                            package.name,
                            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                          ),
                        ),
                        Text(
                          formatNaira(package.price),
                          style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: _canPay ? _pay : null,
            icon: _paying
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                  )
                : const Icon(Icons.tv_rounded, size: 18),
            label: Text(
              _paying
                  ? 'Processing...'
                  : (_package == null ? 'Select a Package' : 'Pay ${formatNaira(_package!.price)}'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _successView() {
    final package = _package!;
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
            'Cable TV Subscription of ${formatNaira(package.price)} was completed.',
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
                _summaryRow('Amount', formatNaira(package.price)),
                _divider(),
                _summaryRow('Provider', _provider!.name),
                _divider(),
                _summaryRow('Smartcard', _account!.smartcard),
                _divider(),
                _summaryRow('Package', package.name),
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

  Widget _infoRow(String label, String value) {
    return Row(
      children: [
        SizedBox(
          width: 72,
          child: Text(label, style: const TextStyle(color: AppColors.textSecondary)),
        ),
        Expanded(
          child: Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
        ),
      ],
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
