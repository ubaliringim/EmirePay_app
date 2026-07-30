import 'package:flutter/material.dart';

import '../../models/card_model.dart';
import '../../theme/app_theme.dart';
import 'add_bank_screen.dart';
import 'add_card_screen.dart';
import 'card_detail_screen.dart';

class _Bank {
  final String name;
  final String account;
  bool isDefault;

  _Bank({required this.name, required this.account, this.isDefault = false});
}

class CardsBanksScreen extends StatefulWidget {
  const CardsBanksScreen({super.key});

  @override
  State<CardsBanksScreen> createState() => _CardsBanksScreenState();
}

class _CardsBanksScreenState extends State<CardsBanksScreen> {
  final List<_Bank> _banks = [
    _Bank(name: 'Wema Bank', account: '1234567890', isDefault: true),
  ];

  final List<CardModel> _cards = [
    CardModel(fullNumber: '4242424242424242', expiry: '12/27', isDefault: true),
  ];

  Future<void> _addBank() async {
    final result = await Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(builder: (_) => const AddBankScreen()),
    );
    if (result == null) return;
    setState(() {
      _banks.add(_Bank(name: result['bank'] as String, account: result['account'] as String));
    });
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Bank account added')));
  }

  Future<void> _addCard() async {
    final result = await Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(builder: (_) => const AddCardScreen()),
    );
    if (result == null) return;
    setState(() {
      _cards.add(CardModel(
        fullNumber: result['fullNumber'] as String,
        expiry: result['expiry'] as String,
        cvv: result['cvv'] as String,
      ));
    });
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Card added successfully')));
  }

  void _showBankActions(int index) {
    final bank = _banks[index];
    showModalBottomSheet<void>(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (sheetContext) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 12),
            if (!bank.isDefault)
              ListTile(
                leading: const Icon(Icons.star_outline_rounded, color: AppColors.primary),
                title: const Text('Set as Default'),
                onTap: () {
                  Navigator.of(sheetContext).pop();
                  setState(() {
                    for (final b in _banks) {
                      b.isDefault = false;
                    }
                    bank.isDefault = true;
                  });
                },
              ),
            ListTile(
              leading: const Icon(Icons.delete_outline_rounded, color: AppColors.danger),
              title: const Text('Remove Bank', style: TextStyle(color: AppColors.danger)),
              onTap: () {
                Navigator.of(sheetContext).pop();
                setState(() => _banks.removeAt(index));
              },
            ),
          ],
        ),
      ),
    );
  }

  void _openCardDetail(int index) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => CardDetailScreen(
          card: _cards[index],
          onChanged: () {
            if (_cards[index].isDefault) {
              for (final c in _cards) {
                if (c != _cards[index]) c.isDefault = false;
              }
            }
            setState(() {});
          },
          onDeleted: () => setState(() => _cards.removeAt(index)),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Cards & Banks')),
      body: ListView(
        padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Linked Banks', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              TextButton.icon(
                onPressed: _addBank,
                icon: const Icon(Icons.add_rounded, size: 18),
                label: const Text('Add Bank'),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (_banks.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Text('No bank accounts linked yet.', style: TextStyle(color: AppColors.textSecondary)),
            )
          else
            for (int i = 0; i < _banks.length; i++) ...[
              _bankTile(_banks[i], i),
              const SizedBox(height: 10),
            ],
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Linked Cards', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              TextButton.icon(
                onPressed: _addCard,
                icon: const Icon(Icons.add_rounded, size: 18),
                label: const Text('Add Card'),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (_cards.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Text('No cards linked yet.', style: TextStyle(color: AppColors.textSecondary)),
            )
          else
            for (int i = 0; i < _cards.length; i++) ...[
              _cardTile(_cards[i], i),
              const SizedBox(height: 10),
            ],
        ],
      ),
    );
  }

  Widget _bankTile(_Bank bank, int index) {
    return InkWell(
      onTap: () => _showBankActions(index),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(color: AppColors.dataBg, borderRadius: BorderRadius.circular(12)),
              child: Icon(Icons.account_balance_rounded, color: AppColors.dataFg),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(bank.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                  Text(
                    '•••• •••• ${bank.account.substring(bank.account.length - 4)}',
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                  ),
                ],
              ),
            ),
            if (bank.isDefault)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: AppColors.success.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(20)),
                child: const Text('Default', style: TextStyle(color: AppColors.success, fontSize: 11, fontWeight: FontWeight.w600)),
              ),
            const Icon(Icons.more_vert_rounded, color: AppColors.textSecondary),
          ],
        ),
      ),
    );
  }

  Widget _cardTile(CardModel card, int index) {
    return InkWell(
      onTap: () => _openCardDetail(index),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: card.isFrozen
                ? [AppColors.textSecondary, AppColors.textPrimary]
                : AppColors.primaryGradient,
          ),
          borderRadius: BorderRadius.circular(18),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Icon(Icons.credit_card_rounded, color: Colors.white),
                if (card.isDefault)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(20)),
                    child: const Text('Default', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
                  ),
              ],
            ),
            const SizedBox(height: 24),
            Text(
              '•••• •••• •••• ${card.last4}',
              style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w600, letterSpacing: 2),
            ),
            const SizedBox(height: 14),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Exp ${card.expiry}', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                if (card.isFrozen)
                  const Text('FROZEN', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
