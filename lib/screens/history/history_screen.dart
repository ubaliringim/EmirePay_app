import 'package:flutter/material.dart';

import '../../models/transaction.dart';
import '../../services/vtpass_service.dart';
import '../../theme/app_theme.dart';
import '../../utils/formatters.dart';
import '../../widgets/transaction_tile.dart';

enum _Filter { all, moneyIn, moneyOut }

enum _Period { today, thisWeek, thisMonth, last3Months, allTime }

const _periodLabels = {
  _Period.today: 'Today',
  _Period.thisWeek: 'This week',
  _Period.thisMonth: 'This month',
  _Period.last3Months: 'Last 3 months',
  _Period.allTime: 'All time',
};

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  _Filter _filter = _Filter.all;
  _Period _period = _Period.thisMonth;
  late Future<List<AppTransaction>> _future;

  @override
  void initState() {
    super.initState();
    _future = VtpassService.fetchTransactions();
  }

  Future<void> _refresh() async {
    final future = VtpassService.fetchTransactions();
    setState(() => _future = future);
    await future;
  }

  List<AppTransaction> _filteredFrom(List<AppTransaction> all) {
    Iterable<AppTransaction> result = all;

    switch (_filter) {
      case _Filter.all:
        break;
      case _Filter.moneyIn:
        result = result.where((t) => t.direction == TransactionDirection.in_);
      case _Filter.moneyOut:
        result = result.where((t) => t.direction == TransactionDirection.out);
    }

    switch (_period) {
      case _Period.today:
        result = result.where((t) => t.dateGroup == 'Today');
      case _Period.thisWeek:
        result = result.where((t) => t.dateGroup == 'Today' || t.dateGroup == 'Yesterday');
      case _Period.thisMonth:
      case _Period.last3Months:
      case _Period.allTime:
        break;
    }

    return result.toList();
  }

  (double, double) _monthTotals(List<AppTransaction> all) {
    final now = DateTime.now();
    double moneyIn = 0;
    double moneyOut = 0;
    for (final t in all) {
      final createdAt = t.createdAt;
      if (createdAt == null || createdAt.year != now.year || createdAt.month != now.month) continue;
      if (t.direction == TransactionDirection.in_) {
        moneyIn += t.amount;
      } else {
        moneyOut += t.amount;
      }
    }
    return (moneyIn, moneyOut);
  }

  static const _weekdayAbbrev = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  (List<String>, List<double>) _weeklyBars(List<AppTransaction> all) {
    final now = DateTime.now();
    final startDay = DateTime(now.year, now.month, now.day).subtract(const Duration(days: 5));
    final totals = List<double>.filled(6, 0);
    for (final t in all) {
      final createdAt = t.createdAt;
      if (createdAt == null) continue;
      final day = DateTime(createdAt.year, createdAt.month, createdAt.day);
      final idx = day.difference(startDay).inDays;
      if (idx >= 0 && idx < 6) totals[idx] += t.amount;
    }
    final maxVal = totals.fold<double>(0, (m, v) => v > m ? v : m);
    final heights = maxVal == 0
        ? List<double>.filled(6, 10.0)
        : totals.map((v) => 10.0 + (v / maxVal) * 36.0).toList();
    final labels = List.generate(6, (i) => _weekdayAbbrev[startDay.add(Duration(days: i)).weekday - 1]);
    return (labels, heights);
  }

  Future<void> _openFilterSheet() async {
    var tempFilter = _filter;
    var tempPeriod = _period;

    await showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (sheetContext) {
        return StatefulBuilder(
          builder: (sheetContext, setSheetState) {
            return Padding(
              padding: EdgeInsets.fromLTRB(20, 12, 20, 24 + MediaQuery.of(context).padding.bottom),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: AppColors.textSecondary.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Filter Transactions',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 20),
                  const Text('Type', style: TextStyle(color: AppColors.textSecondary)),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: _Filter.values.map((f) {
                      final label = switch (f) {
                        _Filter.all => 'All',
                        _Filter.moneyIn => 'Money In',
                        _Filter.moneyOut => 'Money Out',
                      };
                      final selected = tempFilter == f;
                      return _filterChip(
                        label: label,
                        selected: selected,
                        onTap: () => setSheetState(() => tempFilter = f),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),
                  const Text('Period', style: TextStyle(color: AppColors.textSecondary)),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: _Period.values.map((p) {
                      final selected = tempPeriod == p;
                      return _filterChip(
                        label: _periodLabels[p]!,
                        selected: selected,
                        onTap: () => setSheetState(() => tempPeriod = p),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => Navigator.of(sheetContext).pop(),
                          child: const Text('Cancel'),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            setState(() {
                              _filter = tempFilter;
                              _period = tempPeriod;
                            });
                            Navigator.of(sheetContext).pop();
                          },
                          child: const Text('Apply'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _filterChip({required String label, required bool selected, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary : const Color(0xFFE7EBE9),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (selected) ...[
              const Icon(Icons.check_rounded, color: Colors.white, size: 16),
              const SizedBox(width: 6),
            ],
            Text(
              label,
              style: TextStyle(
                color: selected ? Colors.white : AppColors.textSecondary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Map<String, List<AppTransaction>> _groupedFrom(List<AppTransaction> all) {
    final map = <String, List<AppTransaction>>{};
    for (final t in _filteredFrom(all)) {
      map.putIfAbsent(t.dateGroup, () => []).add(t);
    }
    return map;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Transactions'),
        actions: [
          IconButton(
            onPressed: _openFilterSheet,
            icon: const Icon(Icons.tune_rounded),
          ),
        ],
      ),
      body: FutureBuilder<List<AppTransaction>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return _errorView();
          }

          final all = snapshot.data ?? [];
          final grouped = _groupedFrom(all);
          final (moneyIn, moneyOut) = _monthTotals(all);
          final (weekLabels, weekHeights) = _weeklyBars(all);

          return RefreshIndicator(
            onRefresh: _refresh,
            child: ListView(
              padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
              children: [
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: AppColors.primaryGradient,
                    ),
                    borderRadius: BorderRadius.circular(22),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'This Month',
                        style: TextStyle(color: Colors.white70),
                      ),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          _summaryChip(Icons.arrow_downward_rounded, 'Money In', formatNaira(moneyIn)),
                          Container(
                            width: 1,
                            height: 36,
                            color: Colors.white24,
                            margin: const EdgeInsets.symmetric(horizontal: 16),
                          ),
                          _summaryChip(Icons.arrow_upward_rounded, 'Money Out', formatNaira(moneyOut)),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: List.generate(weekLabels.length, (i) {
                          return Container(
                            width: 6,
                            height: weekHeights[i],
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.8),
                              borderRadius: BorderRadius.circular(4),
                            ),
                          );
                        }),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      _filterTab('All', _Filter.all),
                      _filterTab('Money In', _Filter.moneyIn),
                      _filterTab('Money Out', _Filter.moneyOut),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                if (grouped.isEmpty) _emptyView(),
                for (final entry in grouped.entries) ...[
                  Text(
                    entry.key,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      children: entry.value
                          .map((t) => TransactionTile(transaction: t, showStatus: true))
                          .toList(),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _emptyView() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 60),
      child: Column(
        children: [
          Icon(Icons.receipt_long_rounded, size: 48, color: AppColors.textSecondary.withValues(alpha: 0.4)),
          const SizedBox(height: 12),
          const Text(
            'No transactions yet',
            style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _errorView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.error_outline_rounded, size: 40, color: AppColors.textSecondary.withValues(alpha: 0.6)),
            const SizedBox(height: 12),
            const Text(
              "Couldn't load your transactions.",
              style: TextStyle(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            OutlinedButton(
              onPressed: () => setState(() => _future = VtpassService.fetchTransactions()),
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _summaryChip(IconData icon, String label, String amount) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: Colors.white, size: 14),
              ),
              const SizedBox(width: 6),
              Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            amount,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _filterTab(String label, _Filter value) {
    final active = _filter == value;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _filter = value),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: active ? AppColors.primary : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: active ? Colors.white : AppColors.textSecondary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}
