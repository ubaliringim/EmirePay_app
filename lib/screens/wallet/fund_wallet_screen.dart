import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../services/vtpass_service.dart';
import '../../theme/app_theme.dart';
import '../../utils/formatters.dart';

enum _PaymentMethod { card, transfer, ussd }

class FundWalletScreen extends StatefulWidget {
  const FundWalletScreen({super.key});

  @override
  State<FundWalletScreen> createState() => _FundWalletScreenState();
}

class _FundWalletScreenState extends State<FundWalletScreen> {
  final _amountCtrl = TextEditingController();
  _PaymentMethod _method = _PaymentMethod.card;
  bool _paid = false;
  String _reference = '';

  static const _presets = [1000, 2000, 5000, 10000, 20000, 50000];
  static const _accountNumber = '1234567890';
  static const _ussdCode = '*966*000*0#';

  late Future<double> _balanceFuture;

  @override
  void initState() {
    super.initState();
    _amountCtrl.addListener(() => setState(() {}));
    _balanceFuture = VtpassService.fetchBalance();
  }

  @override
  void dispose() {
    _amountCtrl.dispose();
    super.dispose();
  }

  double get _amount => double.tryParse(_amountCtrl.text) ?? 0;

  bool get _canFund => _amount > 0;

  String get _methodLabel => switch (_method) {
    _PaymentMethod.card => 'Debit/Credit Card',
    _PaymentMethod.transfer => 'Bank Transfer',
    _PaymentMethod.ussd => 'USSD',
  };

  String get _channelLabel => switch (_method) {
    _PaymentMethod.card => 'Debit/Credit Card',
    _PaymentMethod.transfer => 'Wema Bank',
    _PaymentMethod.ussd => 'USSD',
  };

  void _selectPreset(int value) {
    setState(() => _amountCtrl.text = value.toString());
  }

  Future<void> _copyToClipboard(String value) async {
    await Clipboard.setData(ClipboardData(text: value));
    if (!mounted) return;
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Copied to clipboard')));
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
      appBar: AppBar(title: const Text('Fund Wallet')),
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
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: AppColors.primaryGradient,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(
                    Icons.account_balance_wallet_rounded,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Current Balance',
                        style: TextStyle(color: Colors.white70, fontSize: 13),
                      ),
                      const SizedBox(height: 4),
                      FutureBuilder<double>(
                        future: _balanceFuture,
                        builder: (context, snapshot) {
                          if (snapshot.connectionState ==
                              ConnectionState.waiting) {
                            return const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            );
                          }
                          if (snapshot.hasError) {
                            return GestureDetector(
                              onTap: () => setState(
                                () => _balanceFuture =
                                    VtpassService.fetchBalance(),
                              ),
                              child: const Text(
                                "Couldn't load — tap to retry",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 13,
                                ),
                              ),
                            );
                          }
                          return Text(
                            formatNaira(snapshot.data ?? 0),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text(
                    'Wallet',
                    style: TextStyle(color: Colors.white, fontSize: 12),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Amount (₦)',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _amountCtrl,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
            decoration: const InputDecoration(
              prefixIcon: Padding(
                padding: EdgeInsets.only(left: 16, right: 8),
                child: Text('₦', style: TextStyle(fontSize: 18)),
              ),
              prefixIconConstraints: BoxConstraints(minWidth: 0, minHeight: 0),
              hintText: '0.00',
            ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: _presets.map((p) {
              final selected = _amountCtrl.text == p.toString();
              return ChoiceChip(
                label: Text(formatNaira(p)),
                selected: selected,
                onSelected: (_) => _selectPreset(p),
                selectedColor: AppColors.primary.withValues(alpha: 0.15),
                labelStyle: TextStyle(
                  color: selected ? AppColors.primary : AppColors.textPrimary,
                  fontWeight: FontWeight.w600,
                ),
                backgroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: BorderSide(
                    color: selected ? AppColors.primary : Colors.transparent,
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 28),
          const Text(
            'Payment Method',
            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
          ),
          const SizedBox(height: 12),
          _methodTile(
            method: _PaymentMethod.card,
            icon: Icons.credit_card_rounded,
            title: 'Debit / Credit Card',
            subtitle: 'Powered by Flutterwave',
          ),
          const SizedBox(height: 10),
          _methodTile(
            method: _PaymentMethod.transfer,
            icon: Icons.account_balance_rounded,
            title: 'Bank Transfer',
            subtitle: 'Transfer via your bank app',
          ),
          const SizedBox(height: 10),
          _methodTile(
            method: _PaymentMethod.ussd,
            icon: Icons.dialpad_rounded,
            title: 'USSD',
            subtitle: 'Dial a short code to pay',
          ),
          if (_method == _PaymentMethod.transfer) ...[
            const SizedBox(height: 16),
            _detailCard(
              icon: Icons.account_balance_rounded,
              title: 'Wema Bank',
              rows: [
                _CardRow('Account Name', 'EMIREPAY / Mannir Ahmad'),
                _CardRow('Account Number', _accountNumber, copyable: true),
              ],
              footnote:
                  'Transfer the exact amount; wallet credits instantly (demo)',
            ),
          ],
          if (_method == _PaymentMethod.ussd) ...[
            const SizedBox(height: 16),
            _detailCard(
              icon: Icons.dialpad_rounded,
              title: 'Dial this USSD code',
              rows: [_CardRow('', _ussdCode, copyable: true, big: true)],
              footnote:
                  'Dial the code above on your phone. Your wallet will be credited automatically.',
            ),
          ],
          const SizedBox(height: 18),
          Container(
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
                    'Card payments will be processed securely via Flutterwave once integrated.',
                    style: TextStyle(color: Color(0xFF3B5FCB), fontSize: 13),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _canFund ? _fund : null,
            icon: const Icon(Icons.account_balance_wallet_rounded, size: 18),
            label: Text('Fund Wallet ${formatNaira(_amount)}'),
          ),
        ],
      ),
    );
  }

  Widget _successView() {
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
            'Wallet Funded of ${formatNaira(_amount)} was completed.',
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
                _summaryRow('Method', _methodLabel),
                _divider(),
                _summaryRow('Channel', _channelLabel),
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

  Widget _detailCard({
    required IconData icon,
    required String title,
    required List<_CardRow> rows,
    required String footnote,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: AppColors.primary, size: 18),
              ),
              const SizedBox(width: 10),
              Text(
                title,
                style: const TextStyle(
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
          for (final row in rows) ...[
            if (row.label.isNotEmpty)
              Text(
                row.label,
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 13,
                ),
              ),
            if (row.label.isNotEmpty) const SizedBox(height: 4),
            Row(
              children: [
                Expanded(
                  child: Text(
                    row.value,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: row.big ? 20 : 16,
                    ),
                  ),
                ),
                if (row.copyable)
                  InkWell(
                    onTap: () => _copyToClipboard(row.value),
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.bettingBg,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.copy_rounded,
                        color: AppColors.primary,
                        size: 16,
                      ),
                    ),
                  ),
              ],
            ),
            if (row != rows.last) const SizedBox(height: 14),
          ],
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(
                  Icons.info_outline_rounded,
                  size: 16,
                  color: AppColors.textSecondary,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    footnote,
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _methodTile({
    required _PaymentMethod method,
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    final selected = _method == method;
    return InkWell(
      onTap: () => setState(() => _method = method),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: selected
              ? AppColors.primary.withValues(alpha: 0.1)
              : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: selected ? AppColors.primary : Colors.transparent,
            width: 1.5,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: AppColors.textPrimary, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              selected
                  ? Icons.radio_button_checked_rounded
                  : Icons.radio_button_off_rounded,
              color: selected ? AppColors.primary : AppColors.textSecondary,
            ),
          ],
        ),
      ),
    );
  }
}

class _CardRow {
  final String label;
  final String value;
  final bool copyable;
  final bool big;

  const _CardRow(
    this.label,
    this.value, {
    this.copyable = false,
    this.big = false,
  });
}
