import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../models/card_model.dart';
import '../../theme/app_theme.dart';
import '../../utils/formatters.dart';

class CardDetailScreen extends StatefulWidget {
  final CardModel card;
  final VoidCallback onChanged;
  final VoidCallback onDeleted;

  const CardDetailScreen({
    super.key,
    required this.card,
    required this.onChanged,
    required this.onDeleted,
  });

  @override
  State<CardDetailScreen> createState() => _CardDetailScreenState();
}

class _CardDetailScreenState extends State<CardDetailScreen> {
  bool _revealed = false;
  late double _limit = widget.card.dailyLimit;

  CardModel get card => widget.card;

  void _toggleFrozen() {
    setState(() => card.isFrozen = !card.isFrozen);
    widget.onChanged();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(card.isFrozen ? 'Card frozen' : 'Card unfrozen')),
    );
  }

  Future<void> _replaceCard() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Replace this card?'),
        content: const Text(
          'This card will be frozen immediately and a new virtual card will be issued instantly.',
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(context).pop(false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.of(context).pop(true), child: const Text('Replace')),
        ],
      ),
    );
    if (confirmed != true) return;
    setState(() => card.isFrozen = true);
    widget.onChanged();
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Card frozen. Your replacement card is on its way.')),
    );
    Navigator.of(context).pop();
  }

  Future<void> _deleteCard() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Delete this card?'),
        content: const Text('This can\'t be undone. You\'ll need to add it again to use it here.'),
        actions: [
          TextButton(onPressed: () => Navigator.of(context).pop(false), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(foregroundColor: AppColors.danger),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (confirmed != true) return;
    widget.onDeleted();
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Card deleted')));
    Navigator.of(context).pop();
  }

  void _setDefault() {
    setState(() => card.isDefault = true);
    widget.onChanged();
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Default card updated')));
  }

  void _saveLimit(double value) {
    setState(() => card.dailyLimit = value);
    widget.onChanged();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Card Details')),
      body: ListView(
        padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
        children: [
          GestureDetector(
            onLongPressStart: (_) => setState(() => _revealed = true),
            onLongPressEnd: (_) => setState(() => _revealed = false),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: card.isFrozen
                      ? [AppColors.textSecondary, AppColors.textPrimary]
                      : AppColors.primaryGradient,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('EmirePay', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      if (card.isFrozen)
                        const Text('FROZEN', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 28),
                  Text(
                    _revealed
                        ? card.fullNumber.replaceAllMapped(
                            RegExp(r'.{4}'), (m) => '${m.group(0)} ')
                        : card.masked,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 19,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Exp ${card.expiry}', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                      Text(
                        _revealed ? 'CVV ${card.cvv}' : 'CVV •••',
                        style: const TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          Center(
            child: Text(
              'Hold the card to reveal the full number',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
            ),
          ),
          const SizedBox(height: 20),
          if (_revealed)
            Center(
              child: TextButton.icon(
                onPressed: () async {
                  await Clipboard.setData(ClipboardData(text: card.fullNumber));
                  if (!context.mounted) return;
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Card number copied')),
                  );
                },
                icon: const Icon(Icons.copy_rounded, size: 16),
                label: const Text('Copy number'),
              ),
            ),
          Container(
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
            child: Column(
              children: [
                ListTile(
                  leading: Icon(
                    card.isFrozen ? Icons.ac_unit_rounded : Icons.severe_cold_outlined,
                    color: AppColors.dataFg,
                  ),
                  title: Text(card.isFrozen ? 'Unfreeze Card' : 'Freeze Card'),
                  subtitle: const Text('Instant, reversible — no PIN needed', style: TextStyle(fontSize: 12)),
                  trailing: Switch(
                    value: !card.isFrozen,
                    activeThumbColor: AppColors.primary,
                    onChanged: (_) => _toggleFrozen(),
                  ),
                ),
                const Divider(height: 1, indent: 16, endIndent: 16),
                ListTile(
                  enabled: !card.isDefault,
                  leading: const Icon(Icons.star_outline_rounded, color: AppColors.primary),
                  title: const Text('Set as Default Card'),
                  trailing: card.isDefault
                      ? const Text('Default', style: TextStyle(color: AppColors.success, fontWeight: FontWeight.w600))
                      : const Icon(Icons.chevron_right_rounded, color: AppColors.textSecondary),
                  onTap: card.isDefault ? null : _setDefault,
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Daily Spend Limit', style: TextStyle(fontWeight: FontWeight.w600)),
                    Text(formatNaira(_limit), style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
                  ],
                ),
                Slider(
                  value: _limit,
                  min: 10000,
                  max: 500000,
                  divisions: 49,
                  activeColor: AppColors.primary,
                  label: formatNaira(_limit),
                  onChanged: (v) => setState(() => _limit = v),
                  onChangeEnd: _saveLimit,
                ),
                const Text(
                  'Applies to card purchases only, capped by your account\'s KYC tier limit.',
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          OutlinedButton.icon(
            onPressed: _replaceCard,
            icon: const Icon(Icons.autorenew_rounded, size: 18),
            label: const Text('Replace Card'),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: _deleteCard,
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.danger,
              side: const BorderSide(color: AppColors.danger),
            ),
            icon: const Icon(Icons.delete_outline_rounded, size: 18),
            label: const Text('Delete Card'),
          ),
        ],
      ),
    );
  }
}
