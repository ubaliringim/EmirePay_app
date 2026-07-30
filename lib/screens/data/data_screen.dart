import 'package:flutter/material.dart';

import '../../models/data_plan.dart';
import '../../models/network.dart';
import '../../services/vtpass_service.dart';
import '../../theme/app_theme.dart';
import '../../utils/formatters.dart';
import '../../widgets/network_selector.dart';
import '../../widgets/step_indicator.dart';

class DataScreen extends StatefulWidget {
  const DataScreen({super.key});

  @override
  State<DataScreen> createState() => _DataScreenState();
}

class _DataScreenState extends State<DataScreen> {
  // Maps networkProviders index (MTN, Airtel, Glo, 9mob) to VTpass serviceID.
  static const _serviceIds = ['mtn-data', 'airtel-data', 'glo-data', 'etisalat-data'];

  int _step = 0;
  int _selectedNetwork = 0;
  int? _selectedPlan;
  final _phoneCtrl = TextEditingController();
  String _reference = '';

  List<DataPlan> _plans = [];
  bool _loadingPlans = false;
  String? _plansError;
  bool _paying = false;

  @override
  void initState() {
    super.initState();
    _phoneCtrl.addListener(() => setState(() {}));
    _loadPlans();
  }

  @override
  void dispose() {
    _phoneCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadPlans() async {
    setState(() {
      _loadingPlans = true;
      _plansError = null;
      _selectedPlan = null;
      _plans = [];
    });
    try {
      final plans = await VtpassService.fetchDataPlans(_serviceIds[_selectedNetwork]);
      if (!mounted) return;
      setState(() => _plans = plans);
    } catch (e) {
      if (!mounted) return;
      setState(() => _plansError = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loadingPlans = false);
    }
  }

  DataPlan? get _plan =>
      (_selectedPlan == null || _selectedPlan! >= _plans.length) ? null : _plans[_selectedPlan!];

  void _goToDetails() {
    if (_selectedPlan == null) return;
    setState(() => _step = 1);
  }

  void _goToConfirm() {
    if (_phoneCtrl.text.trim().length < 10) return;
    setState(() => _step = 2);
  }

  Future<void> _pay() async {
    final plan = _plan;
    if (plan == null) return;
    setState(() => _paying = true);
    try {
      final result = await VtpassService.purchaseData(
        serviceID: _serviceIds[_selectedNetwork],
        variationCode: plan.variationCode,
        amount: plan.price,
        phone: _phoneCtrl.text.trim(),
      );
      if (!mounted) return;
      final succeeded = result['code']?.toString() == '000';
      if (succeeded) {
        setState(() {
          _reference = result['requestId']?.toString() ?? generateReference();
          _step = 3;
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

  void _handleBack() {
    if (_step == 0) {
      Navigator.of(context).pop();
    } else {
      setState(() => _step -= 1);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Buy Data'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          onPressed: _handleBack,
        ),
      ),
      body: Column(
        children: [
          if (_step <= 2)
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
              child: StepIndicator(
                steps: const ['Plan', 'Details', 'Confirm'],
                currentStep: _step,
              ),
            ),
          Expanded(child: _buildStep()),
        ],
      ),
    );
  }

  Widget _buildStep() {
    switch (_step) {
      case 0:
        return _planStep();
      case 1:
        return _detailsStep();
      case 2:
        return _confirmStep();
      default:
        return _successStep();
    }
  }

  Widget _planStep() {
    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Select Network', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          NetworkSelector(
            selectedIndex: _selectedNetwork,
            onSelected: (i) {
              setState(() => _selectedNetwork = i);
              _loadPlans();
            },
          ),
          const SizedBox(height: 24),
          const Text('Select Plan', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          if (_loadingPlans)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 32),
              child: Center(child: CircularProgressIndicator()),
            )
          else if (_plansError != null)
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.electricityBg,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_plansError!, style: const TextStyle(color: AppColors.electricityFg)),
                  const SizedBox(height: 10),
                  TextButton(onPressed: _loadPlans, child: const Text('Try Again')),
                ],
              ),
            )
          else if (_plans.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: Text('No data plans available for this network right now.'),
            )
          else if (_selectedPlan != null)
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
                        color: AppColors.dataBg,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(Icons.wifi_rounded, color: AppColors.dataFg),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        _plans[_selectedPlan!].name,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                    ),
                    Text(
                      formatNaira(_plans[_selectedPlan!].price),
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
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
                            color: const Color(0xFFECECEC),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.wifi_rounded, color: AppColors.textSecondary),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Text(
                            plan.name,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                          ),
                        ),
                        Text(
                          formatNaira(plan.price),
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: _selectedPlan != null ? _goToDetails : null,
            icon: const Icon(Icons.arrow_forward_rounded, size: 18),
            label: const Text('Continue'),
          ),
        ],
      ),
    );
  }

  Widget _detailsStep() {
    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(20, 16, 20, 24 + MediaQuery.of(context).padding.bottom),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFE8EEFB),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Row(
              children: [
                Icon(Icons.info_outline_rounded, color: Color(0xFF3B5FCB), size: 20),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Enter the phone number to receive data',
                    style: TextStyle(color: Color(0xFF3B5FCB), fontSize: 13),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text('Phone Number', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
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
                const Text('+234', style: TextStyle(fontWeight: FontWeight.w600)),
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
                  icon: const Icon(Icons.contact_page_rounded, color: AppColors.primary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _phoneCtrl.text.trim().length >= 10 ? _goToConfirm : null,
            icon: const Icon(Icons.arrow_forward_rounded, size: 18),
            label: const Text('Continue'),
          ),
        ],
      ),
    );
  }

  Widget _confirmStep() {
    final plan = _plan!;
    final network = networkProviders[_selectedNetwork];
    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(20, 16, 20, 24 + MediaQuery.of(context).padding.bottom),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 28),
            decoration: BoxDecoration(
              color: AppColors.dataBg,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.dataFg.withValues(alpha: 0.2)),
            ),
            child: Column(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [AppColors.dataFg, AppColors.dataFg.withValues(alpha: 0.7)],
                    ),
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: const Icon(Icons.wifi_rounded, color: Colors.white, size: 28),
                ),
                const SizedBox(height: 16),
                Text(
                  plan.name,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
            ),
            child: Column(
              children: [
                _summaryRow('Network', network.name, valueColor: network.color),
                _divider(),
                _summaryRow('Plan', plan.name),
                _divider(),
                _summaryRow('Phone', _phoneCtrl.text.trim()),
                _divider(),
                _summaryRow('Amount', formatNaira(plan.price), valueColor: AppColors.primary),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _paying ? null : _pay,
            icon: _paying
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                  )
                : const Icon(Icons.lock_rounded, size: 18),
            label: Text(_paying ? 'Processing...' : 'Pay ${formatNaira(plan.price)}'),
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

  Widget _successStep() {
    final plan = _plan!;
    final network = networkProviders[_selectedNetwork];
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
            'Data Purchase of ${formatNaira(plan.price)} was completed.',
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
                _summaryRow('Amount', formatNaira(plan.price)),
                _divider(),
                _summaryRow('Network', network.name),
                _divider(),
                _summaryRow('Plan', plan.name),
                _divider(),
                _summaryRow('Phone', _phoneCtrl.text.trim()),
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

  Widget _summaryRow(String label, String value, {Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary)),
          Text(
            value,
            style: TextStyle(fontWeight: FontWeight.w600, color: valueColor),
          ),
        ],
      ),
    );
  }

  Widget _divider() => const Divider(height: 1);
}
