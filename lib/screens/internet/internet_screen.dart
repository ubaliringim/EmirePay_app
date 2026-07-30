import 'package:flutter/material.dart';

import '../../models/internet_plan.dart';
import '../../services/vtpass_service.dart';
import '../../theme/app_theme.dart';
import '../../utils/formatters.dart';

class InternetScreen extends StatefulWidget {
  const InternetScreen({super.key});

  @override
  State<InternetScreen> createState() => _InternetScreenState();
}

class _InternetScreenState extends State<InternetScreen> {
  InternetProvider? _provider;

  final _emailCtrl = TextEditingController();
  bool _verifying = false;
  String? _verifyError;
  String? _customerName;
  List<SmileAccount> _accounts = [];
  SmileAccount? _selectedAccount;

  final _phoneCtrl = TextEditingController();

  List<InternetPlan> _plans = [];
  bool _loadingPlans = false;
  String? _plansError;
  int? _selectedPlan;

  bool _paying = false;
  bool _paid = false;
  String _reference = '';

  @override
  void initState() {
    super.initState();
    _emailCtrl.addListener(() => setState(() {}));
    _phoneCtrl.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    super.dispose();
  }

  bool get _isSmile => _provider?.serviceID == 'smile-direct';

  InternetPlan? get _plan =>
      _selectedPlan == null ? null : _plans[_selectedPlan!];

  String? get _billersCode =>
      _isSmile ? _selectedAccount?.accountId : _phoneCtrl.text.trim();

  bool get _canPay =>
      _provider != null &&
      _plan != null &&
      _phoneCtrl.text.trim().length >= 10 &&
      _billersCode != null &&
      _billersCode!.isNotEmpty &&
      !_paying;

  Future<void> _loadPlans() async {
    final provider = _provider;
    if (provider == null) return;
    setState(() {
      _loadingPlans = true;
      _plansError = null;
      _selectedPlan = null;
      _plans = [];
    });
    try {
      final plans = await VtpassService.fetchInternetPlans(provider.serviceID);
      if (!mounted) return;
      setState(() => _plans = plans);
    } catch (e) {
      if (!mounted) return;
      setState(
        () => _plansError = e.toString().replaceFirst('Exception: ', ''),
      );
    } finally {
      if (mounted) setState(() => _loadingPlans = false);
    }
  }

  Future<void> _verifyEmail() async {
    if (_emailCtrl.text.trim().isEmpty || _verifying) return;
    setState(() {
      _verifying = true;
      _verifyError = null;
      _customerName = null;
      _accounts = [];
      _selectedAccount = null;
    });
    try {
      final result = await VtpassService.verifySmileEmail(
        email: _emailCtrl.text.trim(),
      );
      if (!mounted) return;
      final succeeded = result['code']?.toString() == '000';
      if (!succeeded) {
        setState(() {
          _verifyError =
              result['response_description']?.toString() ??
              'Could not verify this email address.';
        });
        return;
      }
      final content =
          (result['content'] as Map?)?.cast<String, dynamic>() ?? {};
      final accountList =
          (content['AccountList'] as Map?)?.cast<String, dynamic>() ?? {};
      final rawAccounts = (accountList['Account'] as List?) ?? [];
      final accounts = rawAccounts
          .cast<Map>()
          .map(
            (a) => SmileAccount(
              accountId: a['AccountId']?.toString() ?? '',
              name: a['FriendlyName']?.toString() ?? '',
            ),
          )
          .toList();
      setState(() {
        _customerName = content['Customer_Name']?.toString() ?? 'Unknown';
        _accounts = accounts;
        _selectedAccount = accounts.length == 1 ? accounts.first : null;
      });
    } catch (e) {
      if (!mounted) return;
      setState(
        () => _verifyError = e.toString().replaceFirst('Exception: ', ''),
      );
    } finally {
      if (mounted) setState(() => _verifying = false);
    }
  }

  Future<void> _pay() async {
    final provider = _provider;
    final plan = _plan;
    final billersCode = _billersCode;
    if (provider == null ||
        plan == null ||
        billersCode == null ||
        billersCode.isEmpty) {
      return;
    }
    setState(() => _paying = true);
    try {
      final result = await VtpassService.purchaseInternet(
        serviceID: provider.serviceID,
        billersCode: billersCode,
        variationCode: plan.variationCode,
        amount: plan.price,
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
      appBar: AppBar(title: const Text('Internet')),
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
              color: AppColors.internetBg,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(
                color: AppColors.internetFg.withValues(alpha: 0.25),
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppColors.internetFg,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(Icons.router_rounded, color: Colors.white),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Text(
                    'Stay connected with fast internet top-up',
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
              child: DropdownButtonFormField<InternetProvider>(
                initialValue: _provider,
                isExpanded: true,
                icon: const Icon(Icons.keyboard_arrow_down_rounded),
                decoration: const InputDecoration(
                  hintText: 'Choose internet provider',
                ),
                items: internetProviders
                    .map((p) => DropdownMenuItem(value: p, child: Text(p.name)))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _provider = value;
                    _emailCtrl.clear();
                    _verifyError = null;
                    _customerName = null;
                    _accounts = [];
                    _selectedAccount = null;
                  });
                  _loadPlans();
                },
              ),
            ),
          ),
          if (_provider != null) ...[
            const SizedBox(height: 24),
            if (_isSmile)
              ..._smileVerificationSection()
            else
              ..._spectranetSection(),
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
            'Choose Plan',
            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
          ),
          const SizedBox(height: 12),
          if (_provider == null)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8),
              child: Text(
                'Choose a provider to see available plans',
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
                color: AppColors.internetBg,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _plansError!,
                    style: const TextStyle(color: AppColors.internetFg),
                  ),
                  const SizedBox(height: 10),
                  TextButton(
                    onPressed: _loadPlans,
                    child: const Text('Try Again'),
                  ),
                ],
              ),
            )
          else if (_plans.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: Text('No plans available for this provider right now.'),
            )
          else if (_selectedPlan != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 14,
                ),
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
                        color: AppColors.internetBg,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        Icons.wifi_rounded,
                        color: AppColors.internetFg,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        _plans[_selectedPlan!].name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                    ),
                    Text(
                      formatNaira(_plans[_selectedPlan!].price),
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(width: 8),
                    TextButton(
                      onPressed: () => setState(() => _selectedPlan = null),
                      child: const Text('Change'),
                    ),
                  ],
                ),
              ),
            )
          else
            ...List.generate(_plans.length, (i) {
              final plan = _plans[i];
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: InkWell(
                  onTap: () => setState(() => _selectedPlan = i),
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 14,
                    ),
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
                            color: const Color(0xFFECECEC),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.wifi_rounded,
                            color: AppColors.textSecondary,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Text(
                            plan.name,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                        ),
                        Text(
                          formatNaira(plan.price),
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                          ),
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
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : const Icon(Icons.router_rounded, size: 18),
            label: Text(
              _paying
                  ? 'Processing...'
                  : (_plan == null
                        ? 'Select a Plan'
                        : 'Pay ${formatNaira(_plan!.price)}'),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _smileVerificationSection() {
    return [
      const Text(
        'Smile Account Email',
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
                controller: _emailCtrl,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                  hintText: 'Enter Smile account email',
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
                      onPressed: _emailCtrl.text.trim().isEmpty
                          ? null
                          : _verifyEmail,
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
            color: AppColors.internetBg,
            borderRadius: BorderRadius.circular(14),
          ),
          child: Text(
            _verifyError!,
            style: const TextStyle(color: AppColors.internetFg),
          ),
        ),
      ],
      if (_customerName != null) ...[
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
                  Expanded(
                    child: Text(
                      _customerName!,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.success,
                      ),
                    ),
                  ),
                ],
              ),
              if (_accounts.isNotEmpty) ...[
                const SizedBox(height: 14),
                const Text(
                  'Select Account',
                  style: TextStyle(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8),
                ..._accounts.map((account) {
                  final selected = identical(_selectedAccount, account);
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: InkWell(
                      onTap: () => setState(() => _selectedAccount = account),
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 10,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: selected
                                ? AppColors.primary
                                : Colors.transparent,
                            width: 1.5,
                          ),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    account.name.isEmpty
                                        ? account.accountId
                                        : account.name,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  Text(
                                    account.accountId,
                                    style: const TextStyle(
                                      color: AppColors.textSecondary,
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (selected)
                              const Icon(
                                Icons.check_circle_rounded,
                                color: AppColors.success,
                              ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
              ],
            ],
          ),
        ),
      ],
    ];
  }

  List<Widget> _spectranetSection() {
    return [
      Container(
        width: double.infinity,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: const Color(0xFFE8EEFB),
          borderRadius: BorderRadius.circular(14),
        ),
        child: const Row(
          children: [
            Icon(
              Icons.info_outline_rounded,
              color: Color(0xFF3B5FCB),
              size: 20,
            ),
            SizedBox(width: 10),
            Expanded(
              child: Text(
                'Enter the Spectranet-registered phone number below to top up.',
                style: TextStyle(color: Color(0xFF3B5FCB), fontSize: 13),
              ),
            ),
          ],
        ),
      ),
    ];
  }

  Widget _successView() {
    final provider = _provider!;
    final plan = _plan!;
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
            'Internet Subscription of ${formatNaira(plan.price)} was completed.',
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
                _summaryRow('Amount', formatNaira(plan.price)),
                _divider(),
                _summaryRow('Provider', provider.name),
                _divider(),
                _summaryRow('Account', _billersCode ?? '—'),
                _divider(),
                _summaryRow('Plan', plan.name),
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
