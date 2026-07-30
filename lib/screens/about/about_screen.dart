import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../theme/app_theme.dart';
import 'legal_text_screen.dart';

const _privacyPolicy = '''
EmirePay Privacy Policy

We collect only the information required to provide our bill payment and wallet services, including your name, contact details, and transaction history.

Your data is encrypted in transit and at rest, and is never sold to third parties. We may share information with regulators and payment partners where required by law.

You may request a copy of your data or ask us to delete your account at any time by contacting support@emirepay.com.
''';

const _termsOfService = '''
EmirePay Terms of Service

By using EmirePay, you agree to use the app only for lawful purposes and to keep your login credentials, PIN, and OTPs confidential.

EmirePay is not liable for losses arising from sharing your credentials with third parties. Transaction fees, where applicable, are disclosed before you confirm a payment.

We may suspend accounts found to be in violation of these terms or involved in fraudulent activity.
''';

const _cookiePolicy = '''
EmirePay Cookie Policy

Our app and website use cookies and similar technologies to keep you signed in, remember your preferences, and understand how EmirePay is used so we can improve it.

You can control cookie preferences in your browser settings when accessing EmirePay via the web.
''';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  Future<void> _launch(BuildContext context, Uri uri, String failMessage) async {
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(failMessage)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('About')),
      body: ListView(
        padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
        children: [
          const SizedBox(height: 12),
          Center(
            child: Container(
              width: 88,
              height: 88,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 12, offset: const Offset(0, 4)),
                ],
              ),
              padding: const EdgeInsets.all(16),
              child: Image.asset('assets/images/logo_icon.png', fit: BoxFit.contain),
            ),
          ),
          const SizedBox(height: 16),
          const Center(
            child: Text('EmirePay', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 4),
          const Center(
            child: Text('Version 1.0.0 (Build 1)', style: TextStyle(color: AppColors.textSecondary)),
          ),
          const SizedBox(height: 24),
          _card([
            _row(context, Icons.privacy_tip_outlined, 'Privacy Policy', () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const LegalTextScreen(title: 'Privacy Policy', body: _privacyPolicy)),
                )),
            _divider(),
            _row(context, Icons.description_outlined, 'Terms of Service', () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const LegalTextScreen(title: 'Terms of Service', body: _termsOfService)),
                )),
            _divider(),
            _row(context, Icons.cookie_outlined, 'Cookie Policy', () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const LegalTextScreen(title: 'Cookie Policy', body: _cookiePolicy)),
                )),
            _divider(),
            _row(context, Icons.article_outlined, 'Open Source Licenses', () => showLicensePage(
                  context: context,
                  applicationName: 'EmirePay',
                  applicationVersion: '1.0.0',
                )),
          ]),
          const SizedBox(height: 20),
          _card([
            _row(context, Icons.mail_outline_rounded, 'Contact Us', () => _launch(
                  context,
                  Uri(scheme: 'mailto', path: 'support@emirepay.com'),
                  'Could not open the email app',
                )),
            _divider(),
            _row(context, Icons.language_rounded, 'Website', () => _launch(
                  context,
                  Uri.parse('https://emirepay.app'),
                  'Could not open the website',
                )),
          ]),
          const SizedBox(height: 20),
          const Text('Follow Us', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
          const SizedBox(height: 10),
          Row(
            children: [
              _socialButton(context, Icons.alternate_email_rounded, 'https://x.com/emirepay'),
              const SizedBox(width: 12),
              _socialButton(context, Icons.camera_alt_outlined, 'https://instagram.com/emirepay'),
              const SizedBox(width: 12),
              _socialButton(context, Icons.facebook_rounded, 'https://facebook.com/emirepay'),
            ],
          ),
          const SizedBox(height: 24),
          const Center(
            child: Text(
              '© 2026 EmirePay. All rights reserved.',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _card(List<Widget> children) => Container(
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
        child: Column(children: children),
      );

  Widget _divider() => const Divider(height: 1, indent: 16, endIndent: 16);

  Widget _row(BuildContext context, IconData icon, String label, VoidCallback onTap) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(color: AppColors.moreBg, borderRadius: BorderRadius.circular(10)),
        child: Icon(icon, color: AppColors.moreFg, size: 18),
      ),
      title: Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
      trailing: const Icon(Icons.chevron_right_rounded, color: AppColors.textSecondary),
    );
  }

  Widget _socialButton(BuildContext context, IconData icon, String url) {
    return InkWell(
      onTap: () => _launch(context, Uri.parse(url), 'Could not open the link'),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
        child: Icon(icon, color: AppColors.textPrimary),
      ),
    );
  }
}
