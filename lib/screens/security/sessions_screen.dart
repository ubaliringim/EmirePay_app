import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';

class _Session {
  final String device;
  final String location;
  final String lastActive;
  final IconData icon;
  final bool isCurrent;

  const _Session({
    required this.device,
    required this.location,
    required this.lastActive,
    required this.icon,
    this.isCurrent = false,
  });
}

class SessionsScreen extends StatefulWidget {
  const SessionsScreen({super.key});

  @override
  State<SessionsScreen> createState() => _SessionsScreenState();
}

class _SessionsScreenState extends State<SessionsScreen> {
  final List<_Session> _sessions = [
    const _Session(
      device: 'This Device — Chrome on Windows',
      location: 'Lagos, Nigeria',
      lastActive: 'Active now',
      icon: Icons.computer_rounded,
      isCurrent: true,
    ),
    const _Session(
      device: 'iPhone 13 Pro',
      location: 'Lagos, Nigeria',
      lastActive: 'Active 2 hours ago',
      icon: Icons.phone_iphone_rounded,
    ),
    const _Session(
      device: 'Samsung Galaxy S23',
      location: 'Abuja, Nigeria',
      lastActive: 'Active 3 days ago',
      icon: Icons.android_rounded,
    ),
  ];

  void _logOutSession(int index) {
    setState(() => _sessions.removeAt(index));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Device logged out')),
    );
  }

  void _logOutAllOthers() {
    setState(() => _sessions.removeWhere((s) => !s.isCurrent));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Logged out from all other devices')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final hasOtherSessions = _sessions.any((s) => !s.isCurrent);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Active Sessions')),
      body: ListView(
        padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
        children: [
          const Text(
            'These are the devices currently signed in to your account.',
            style: TextStyle(color: AppColors.textSecondary),
          ),
          const SizedBox(height: 20),
          for (int i = 0; i < _sessions.length; i++) ...[
            _sessionCard(_sessions[i], i),
            const SizedBox(height: 12),
          ],
          if (hasOtherSessions) ...[
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: _logOutAllOthers,
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.danger,
                side: const BorderSide(color: AppColors.danger),
              ),
              icon: const Icon(Icons.logout_rounded, size: 18),
              label: const Text('Log Out All Other Devices'),
            ),
          ],
        ],
      ),
    );
  }

  Widget _sessionCard(_Session session, int index) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: session.isCurrent ? Border.all(color: AppColors.primary.withValues(alpha: 0.3)) : null,
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.dataBg,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(session.icon, color: AppColors.dataFg),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        session.device,
                        style: const TextStyle(fontWeight: FontWeight.w600),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (session.isCurrent) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.success.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Text(
                          'Current',
                          style: TextStyle(color: AppColors.success, fontSize: 10, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  '${session.location} • ${session.lastActive}',
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                ),
              ],
            ),
          ),
          if (!session.isCurrent)
            IconButton(
              onPressed: () => _logOutSession(index),
              icon: const Icon(Icons.logout_rounded, color: AppColors.danger, size: 20),
            ),
        ],
      ),
    );
  }
}
