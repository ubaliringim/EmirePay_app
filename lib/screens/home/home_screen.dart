import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import '../../models/service.dart';
import '../../models/transaction.dart';
import '../../services/vtpass_service.dart';
import '../../theme/app_theme.dart';
import '../../theme/theme_controller.dart';
import '../../widgets/profile_avatar.dart';
import '../../widgets/promo_banner.dart';
import '../../widgets/section_header.dart';
import '../../widgets/service_tile.dart';
import '../../widgets/transaction_tile.dart';
import '../../widgets/wallet_card.dart';
import '../../widgets/weekly_spend_card.dart';
import '../../utils/service_navigation.dart';
import '../history/history_screen.dart';
import '../notifications/notifications_screen.dart';
import '../wallet/fund_wallet_screen.dart';

class HomeScreen extends StatelessWidget {
  final ValueChanged<int>? onNavigate;

  const HomeScreen({super.key, this.onNavigate});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: EdgeInsets.fromLTRB(
          20,
          16,
          20,
          24 + MediaQuery.of(context).padding.bottom,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const _GreetingHeader(),
            const SizedBox(height: 16),
            const _LiveWalletCard(),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const FundWalletScreen(),
                      ),
                    ),
                    icon: const Icon(Icons.add_rounded, size: 18),
                    label: const Text('Fund Wallet'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const HistoryScreen()),
                    ),
                    icon: const Icon(Icons.receipt_long_rounded, size: 18),
                    label: const Text('Transactions'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 28),
            SectionHeader(
              title: 'Quick Actions',
              actionLabel: 'See All',
              onAction: () {},
            ),
            const SizedBox(height: 16),
            GridView.count(
              crossAxisCount: 4,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 16,
              crossAxisSpacing: 8,
              childAspectRatio: 0.8,
              children: quickActionServices
                  .map(
                    (s) => ServiceTile(
                      icon: s.icon,
                      label: s.label,
                      background: s.background,
                      foreground: s.foreground,
                      onTap: () => openService(
                        context,
                        s.label,
                        onMore: () => onNavigate?.call(4),
                      ),
                    ),
                  )
                  .toList(),
            ),
            const SizedBox(height: 28),
            const SectionHeader(title: 'Pay Bills'),
            const SizedBox(height: 16),
            GridView.count(
              crossAxisCount: 4,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 16,
              crossAxisSpacing: 8,
              childAspectRatio: 0.8,
              children: payBillsServices
                  .map(
                    (s) => ServiceTile(
                      icon: s.icon,
                      label: s.label,
                      background: s.background,
                      foreground: s.foreground,
                      onTap: () => openService(
                        context,
                        s.label,
                        onMore: () => onNavigate?.call(4),
                      ),
                    ),
                  )
                  .toList(),
            ),
            const SizedBox(height: 24),
            const PromoBannerCarousel(),
            const SizedBox(height: 24),
            const SectionHeader(title: 'This Week'),
            const SizedBox(height: 16),
            const WeeklySpendCard(
              totalSpent: 42800,
              changeLabel: '+18% vs last',
              dayValues: [30, 55, 20, 62, 45, 78, 40],
            ),
            const SizedBox(height: 24),
            SectionHeader(
              title: 'Recent Transactions',
              actionLabel: 'See All',
              onAction: () => onNavigate?.call(1),
            ),
            const SizedBox(height: 8),
            const _RecentTransactionsCard(),
          ],
        ),
      ),
    );
  }
}

class _GreetingHeader extends StatelessWidget {
  const _GreetingHeader();

  String get _greeting {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  String get _firstName {
    final name = FirebaseAuth.instance.currentUser?.displayName?.trim();
    if (name == null || name.isEmpty) return 'there';
    return name.split(RegExp(r'\s+')).first;
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const ProfileAvatar(radius: 22),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _greeting,
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 13,
                ),
              ),
              Text(
                '$_firstName 👋',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
        ValueListenableBuilder<ThemeMode>(
          valueListenable: ThemeController.mode,
          builder: (context, mode, _) {
            final isDark = mode == ThemeMode.dark;
            return IconButton(
              onPressed: () => ThemeController.mode.value = isDark
                  ? ThemeMode.light
                  : ThemeMode.dark,
              icon: Icon(
                isDark ? Icons.light_mode_rounded : Icons.dark_mode_rounded,
              ),
            );
          },
        ),
        IconButton(
          onPressed: () => Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const NotificationsScreen()),
          ),
          icon: const Icon(Icons.notifications_none_rounded),
        ),
      ],
    );
  }
}

class _LiveWalletCard extends StatefulWidget {
  const _LiveWalletCard();

  @override
  State<_LiveWalletCard> createState() => _LiveWalletCardState();
}

class _LiveWalletCardState extends State<_LiveWalletCard> {
  late Future<(double, double)> _summaryFuture;

  @override
  void initState() {
    super.initState();
    _summaryFuture = _loadSummary();
  }

  static Future<(double, double)> _loadSummary() async {
    final results = await Future.wait([
      VtpassService.fetchBalance(),
      VtpassService.fetchTransactions(),
    ]);
    final balance = results[0] as double;
    final transactions = results[1] as List<AppTransaction>;

    final now = DateTime.now();
    final weekStart = DateTime(
      now.year,
      now.month,
      now.day,
    ).subtract(const Duration(days: 6));
    var weeklySpend = 0.0;
    for (final t in transactions) {
      final createdAt = t.createdAt;
      if (createdAt == null || t.direction != TransactionDirection.out) {
        continue;
      }
      final day = DateTime(createdAt.year, createdAt.month, createdAt.day);
      if (!day.isBefore(weekStart)) weeklySpend += t.amount;
    }

    return (balance, weeklySpend);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<(double, double)>(
      future: _summaryFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Container(
            width: double.infinity,
            height: 220,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: AppColors.primaryGradient,
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            alignment: Alignment.center,
            child: const CircularProgressIndicator(color: Colors.white),
          );
        }
        if (snapshot.hasError) {
          return Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: AppColors.primaryGradient,
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                const Expanded(
                  child: Text(
                    "Couldn't load balance",
                    style: TextStyle(color: Colors.white),
                  ),
                ),
                TextButton(
                  onPressed: () =>
                      setState(() => _summaryFuture = _loadSummary()),
                  style: TextButton.styleFrom(foregroundColor: Colors.white),
                  child: const Text('Retry'),
                ),
              ],
            ),
          );
        }
        final (balance, weeklySpend) = snapshot.data ?? (0.0, 0.0);
        return WalletCard(balance: balance, trend: weeklySpend, trendUp: false);
      },
    );
  }
}

class _RecentTransactionsCard extends StatefulWidget {
  const _RecentTransactionsCard();

  @override
  State<_RecentTransactionsCard> createState() =>
      _RecentTransactionsCardState();
}

class _RecentTransactionsCardState extends State<_RecentTransactionsCard> {
  late Future<List<AppTransaction>> _future;

  @override
  void initState() {
    super.initState();
    _future = VtpassService.fetchTransactions();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
      ),
      child: FutureBuilder<List<AppTransaction>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Padding(
              padding: EdgeInsets.symmetric(vertical: 24),
              child: Center(child: CircularProgressIndicator()),
            );
          }
          if (snapshot.hasError) {
            return const Padding(
              padding: EdgeInsets.symmetric(vertical: 24),
              child: Center(
                child: Text(
                  "Couldn't load recent transactions.",
                  style: TextStyle(color: AppColors.textSecondary),
                ),
              ),
            );
          }
          final recent = (snapshot.data ?? []).take(3).toList();
          if (recent.isEmpty) {
            return const Padding(
              padding: EdgeInsets.symmetric(vertical: 24),
              child: Center(
                child: Text(
                  'No transactions yet',
                  style: TextStyle(color: AppColors.textSecondary),
                ),
              ),
            );
          }
          return Column(
            children: recent
                .map((t) => TransactionTile(transaction: t))
                .toList(),
          );
        },
      ),
    );
  }
}
