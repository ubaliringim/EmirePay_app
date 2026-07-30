import 'package:flutter/material.dart';

import '../../models/bank.dart';
import '../../models/recipient.dart';
import '../../theme/app_theme.dart';
import '../../utils/formatters.dart';

enum _RecipientType { emirePayUser, bankAccount }

const double _walletBalance = 11080.50;
const double _bankTransferFee = 25;

class SendMoneyScreen extends StatefulWidget {
  const SendMoneyScreen({super.key});

  @override
  State<SendMoneyScreen> createState() => _SendMoneyScreenState();
}

class _SendMoneyScreenState extends State<SendMoneyScreen> {
  static const _presets = [1000, 2000, 5000, 10000, 20000, 50000];

  _RecipientType _type = _RecipientType.emirePayUser;

  final _phoneCtrl = TextEditingController();
  bool _findingRecipient = false;
  String? _recipientName;

  String? _selectedBank;
  final _accountCtrl = TextEditingController();
  bool _verifyingAccount = false;
  String? _resolvedAccountName;

  final _amountCtrl = TextEditingController();
  final _noteCtrl = TextEditingController();

  bool _paid = false;
  String _reference = '';

  @override
  void initState() {
    super.initState();
    _phoneCtrl.addListener(() => setState(() {}));
    _accountCtrl.addListener(() => setState(() {}));
    _amountCtrl.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _phoneCtrl.dispose();
    _accountCtrl.dispose();
    _amountCtrl.dispose();
    _noteCtrl.dispose();
    super.dispose();
  }

  double get _amount => double.tryParse(_amountCtrl.text) ?? 0;

  double get _fee => _type == _RecipientType.bankAccount ? _bankTransferFee : 0;

  double get _total => _amount + _fee;

  bool get _recipientVerified =>
      _type == _RecipientType.emirePayUser ? _recipientName != null : _resolvedAccountName != null;

  bool get _hasInsufficientBalance => _amount > 0 && _total > _walletBalance;

  bool get _canSend => _recipientVerified && _amount > 0 && !_hasInsufficientBalance;

  String get _recipientLabel =>
      _type == _RecipientType.emirePayUser ? (_recipientName ?? '—') : (_resolvedAccountName ?? '—');

  String get _methodLabel =>
      _type == _RecipientType.emirePayUser ? 'EmirePay Wallet' : (_selectedBank ?? '—');

  void _selectRecentRecipient(Recipient r) {
    setState(() {
      _phoneCtrl.text = r.phone;
      _recipientName = r.name;
    });
  }

  Future<void> _findRecipient() async {
    if (_phoneCtrl.text.trim().length < 10 || _findingRecipient) return;
    setState(() {
      _findingRecipient = true;
      _recipientName = null;
    });
    await Future.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;
    final match = recentRecipients.where(
      (r) => r.phone.replaceAll(' ', '') == _phoneCtrl.text.replaceAll(' ', ''),
    );
    setState(() {
      _findingRecipient = false;
      _recipientName = match.isNotEmpty ? match.first.name : 'Emeka Nwosu';
    });
  }

  Future<void> _verifyAccount() async {
    if (_selectedBank == null || _accountCtrl.text.trim().length < 10 || _verifyingAccount) return;
    setState(() {
      _verifyingAccount = true;
      _resolvedAccountName = null;
    });
    await Future.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;
    setState(() {
      _verifyingAccount = false;
      _resolvedAccountName = 'TUNDE BAKARE';
    });
  }

  void _selectPreset(int value) {
    setState(() => _amountCtrl.text = value.toString());
  }

  void _send() {
    setState(() {
      _reference = generateReference();
      _paid = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Send Money')),
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
                  child: const Icon(Icons.send_rounded, color: Colors.white),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Available Balance',
                        style: TextStyle(color: Colors.white70, fontSize: 13),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        formatNaira(_walletBalance),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: const Color(0xFFE7EBE9),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              children: [
                _typeSegment('EmirePay User', _RecipientType.emirePayUser),
                _typeSegment('Bank Account', _RecipientType.bankAccount),
              ],
            ),
          ),
          const SizedBox(height: 24),
          if (_type == _RecipientType.emirePayUser) ..._emirePayUserFields() else ..._bankAccountFields(),
          const SizedBox(height: 24),
          const Text('Amount (₦)', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          TextField(
            controller: _amountCtrl,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
            decoration: InputDecoration(
              prefixIcon: const Padding(
                padding: EdgeInsets.only(left: 16, right: 8),
                child: Text('₦', style: TextStyle(fontSize: 18)),
              ),
              prefixIconConstraints: const BoxConstraints(minWidth: 0, minHeight: 0),
              hintText: '0.00',
              errorText: _hasInsufficientBalance ? 'Insufficient balance' : null,
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
                  side: BorderSide(color: selected ? AppColors.primary : Colors.transparent),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
          const Text('Note (optional)', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          TextField(
            controller: _noteCtrl,
            decoration: const InputDecoration(hintText: "What's this for?"),
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
                        color: const Color(0xFFDCF3E2),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.receipt_long_rounded, color: AppColors.success, size: 16),
                    ),
                    const SizedBox(width: 10),
                    const Text('Transfer Summary', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: Divider(height: 1),
                ),
                _summaryRow('To', _recipientLabel),
                const SizedBox(height: 10),
                _summaryRow('Method', _methodLabel),
                const SizedBox(height: 10),
                _summaryRow('Amount', _amount > 0 ? formatNaira(_amount) : '—'),
                const SizedBox(height: 10),
                _summaryRow('Fee', _fee > 0 ? formatNaira(_fee) : 'Free'),
                const SizedBox(height: 10),
                _summaryRow('Total', _total > 0 ? formatNaira(_total) : '—', valueColor: AppColors.primary),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _canSend ? _send : null,
            icon: const Icon(Icons.send_rounded, size: 18),
            label: Text('Send ${formatNaira(_total)}'),
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

  List<Widget> _emirePayUserFields() {
    return [
      const Text('Recent Recipients', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
      const SizedBox(height: 12),
      SizedBox(
        height: 86,
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          itemCount: recentRecipients.length,
          separatorBuilder: (_, _) => const SizedBox(width: 14),
          itemBuilder: (context, i) {
            final r = recentRecipients[i];
            return GestureDetector(
              onTap: () => _selectRecentRecipient(r),
              child: SizedBox(
                width: 64,
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 26,
                      backgroundColor: AppColors.primary.withValues(alpha: 0.15),
                      child: Text(
                        r.initials,
                        style: const TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      r.name.split(' ').first,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 12),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
      const SizedBox(height: 20),
      const Text('Phone Number or Username', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
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
                controller: _phoneCtrl,
                decoration: const InputDecoration(
                  hintText: '0801 234 5678',
                  border: InputBorder.none,
                  filled: false,
                  prefixIcon: Icon(Icons.person_search_rounded),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(right: 6),
              child: _findingRecipient
                  ? const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 12),
                      child: SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      ),
                    )
                  : TextButton(
                      onPressed: _phoneCtrl.text.trim().length < 10 ? null : _findRecipient,
                      child: const Text('Find'),
                    ),
            ),
          ],
        ),
      ),
      if (_recipientName != null) ...[
        const SizedBox(height: 16),
        _verifiedCard(
          icon: Icons.person_rounded,
          title: 'EmirePay User',
          rows: [('Name', _recipientName!), ('Phone', _phoneCtrl.text.trim())],
        ),
      ],
    ];
  }

  List<Widget> _bankAccountFields() {
    return [
      const Text('Select Bank', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
      const SizedBox(height: 12),
      Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
        ),
        child: DropdownButtonHideUnderline(
          child: DropdownButtonFormField<String>(
            initialValue: _selectedBank,
            isExpanded: true,
            icon: const Icon(Icons.keyboard_arrow_down_rounded),
            decoration: const InputDecoration(hintText: 'Choose recipient bank'),
            items: nigerianBanks.map((b) => DropdownMenuItem(value: b, child: Text(b))).toList(),
            onChanged: (value) => setState(() {
              _selectedBank = value;
              _resolvedAccountName = null;
            }),
          ),
        ),
      ),
      const SizedBox(height: 24),
      const Text('Account Number', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
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
                controller: _accountCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  hintText: 'Enter 10-digit account number',
                  border: InputBorder.none,
                  filled: false,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(right: 6),
              child: _verifyingAccount
                  ? const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 12),
                      child: SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      ),
                    )
                  : TextButton(
                      onPressed: (_selectedBank == null || _accountCtrl.text.trim().length < 10)
                          ? null
                          : _verifyAccount,
                      child: const Text('Verify'),
                    ),
            ),
          ],
        ),
      ),
      if (_resolvedAccountName != null) ...[
        const SizedBox(height: 16),
        _verifiedCard(
          icon: Icons.account_balance_rounded,
          title: 'Account Verified',
          rows: [('Account Name', _resolvedAccountName!), ('Bank', _selectedBank!)],
        ),
      ],
      const SizedBox(height: 16),
      Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFFE8EEFB),
          borderRadius: BorderRadius.circular(14),
        ),
        child: const Row(
          children: [
            Icon(Icons.info_outline_rounded, color: Color(0xFF3B5FCB), size: 18),
            SizedBox(width: 10),
            Expanded(
              child: Text(
                'A ₦25 fee applies to transfers to external bank accounts.',
                style: TextStyle(color: Color(0xFF3B5FCB), fontSize: 12),
              ),
            ),
          ],
        ),
      ),
    ];
  }

  Widget _verifiedCard({
    required IconData icon,
    required String title,
    required List<(String, String)> rows,
  }) {
    return Container(
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
                child: Icon(icon, color: AppColors.success, size: 18),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.success),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  'Verified',
                  style: TextStyle(color: AppColors.success, fontSize: 12, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          for (var i = 0; i < rows.length; i++) ...[
            Row(
              children: [
                SizedBox(
                  width: 90,
                  child: Text(rows[i].$1, style: const TextStyle(color: AppColors.textSecondary)),
                ),
                Expanded(
                  child: Text(rows[i].$2, style: const TextStyle(fontWeight: FontWeight.w600)),
                ),
              ],
            ),
            if (i != rows.length - 1) const SizedBox(height: 6),
          ],
        ],
      ),
    );
  }

  Widget _typeSegment(String label, _RecipientType type) {
    final selected = _type == type;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _type = type),
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

  Widget _summaryRow(String label, String value, {Color? valueColor}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: AppColors.textSecondary)),
        Text(value, style: TextStyle(fontWeight: FontWeight.w600, color: valueColor)),
      ],
    );
  }

  Widget _successView() {
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
            'Money Sent',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            '${formatNaira(_amount)} sent to $_recipientLabel successfully.',
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
                _successRow('Recipient', _recipientLabel),
                _divider(),
                _successRow('Method', _methodLabel),
                _divider(),
                _successRow('Fee', _fee > 0 ? formatNaira(_fee) : 'Free'),
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
