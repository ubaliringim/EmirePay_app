import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';
import '../../widgets/otp_verify_sheet.dart';
import '../../widgets/pin_keypad.dart';

enum _Channel { phone, email }

enum _Step { chooseChannel, newPin, confirmPin }

class ForgotPinScreen extends StatefulWidget {
  const ForgotPinScreen({super.key});

  @override
  State<ForgotPinScreen> createState() => _ForgotPinScreenState();
}

class _ForgotPinScreenState extends State<ForgotPinScreen> {
  static const _registeredPhone = '0801 234 5678';
  static const _registeredEmail = 'manniru@gmail.com';

  _Channel _channel = _Channel.phone;
  _Step _step = _Step.chooseChannel;
  String _entered = '';
  String? _newPin;
  String? _error;
  bool _sending = false;

  Future<void> _sendCode() async {
    setState(() => _sending = true);
    final destination = _channel == _Channel.phone ? _registeredPhone : _registeredEmail;
    final verified = await OtpVerifySheet.show(
      context,
      destination: destination,
      title: 'Verify It\'s You',
    );
    if (!mounted) return;
    setState(() => _sending = false);
    if (verified == true) {
      setState(() => _step = _Step.newPin);
    }
  }

  void _onDigit(String digit) {
    if (_entered.length >= 4) return;
    setState(() {
      _entered += digit;
      _error = null;
    });
    if (_entered.length == 4) {
      Future.delayed(const Duration(milliseconds: 200), _onPinComplete);
    }
  }

  void _onBackspace() {
    if (_entered.isEmpty) return;
    setState(() => _entered = _entered.substring(0, _entered.length - 1));
  }

  void _onPinComplete() {
    if (_step == _Step.newPin) {
      setState(() {
        _newPin = _entered;
        _step = _Step.confirmPin;
        _entered = '';
      });
      return;
    }

    if (_entered == _newPin) {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'PIN reset. A 24-hour security limit applies to your account to keep it safe.',
          ),
        ),
      );
    } else {
      setState(() {
        _error = "PINs don't match. Try again.";
        _step = _Step.newPin;
        _entered = '';
        _newPin = null;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Reset PIN')),
      body: SafeArea(
        child: _step == _Step.chooseChannel ? _channelStep() : _pinStep(),
      ),
    );
  }

  Widget _channelStep() {
    return ListView(
      padding: EdgeInsets.fromLTRB(20, 8, 20, 24 + MediaQuery.of(context).padding.bottom),
      children: [
        const Text(
          'How should we verify it\'s you?',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 8),
        const Text(
          'We\'ll send a 6-digit code to confirm your identity before you set a new PIN.',
          style: TextStyle(color: AppColors.textSecondary),
        ),
        const SizedBox(height: 20),
        _channelTile(
          _Channel.phone,
          Icons.sms_outlined,
          'Text message',
          _registeredPhone,
        ),
        const SizedBox(height: 12),
        _channelTile(
          _Channel.email,
          Icons.mail_outline_rounded,
          'Email',
          _registeredEmail,
        ),
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: _sending ? null : _sendCode,
          child: _sending
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                )
              : const Text('Send Code'),
        ),
      ],
    );
  }

  Widget _channelTile(_Channel value, IconData icon, String label, String destination) {
    final selected = _channel == value;
    return InkWell(
      onTap: () => setState(() => _channel = value),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: selected ? AppColors.primary : Colors.transparent, width: 1.5),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(color: AppColors.dataBg, borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: AppColors.dataFg),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
                  Text(destination, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                ],
              ),
            ),
            Icon(
              selected ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
              color: selected ? AppColors.primary : AppColors.textSecondary,
            ),
          ],
        ),
      ),
    );
  }

  Widget _pinStep() {
    final title = _step == _Step.newPin ? 'Enter a new 4-digit PIN' : 'Confirm your new PIN';
    return Column(
      children: [
        const SizedBox(height: 32),
        Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
        const SizedBox(height: 24),
        PinDots(length: 4, filled: _entered.length, error: _error != null),
        if (_error != null) ...[
          const SizedBox(height: 16),
          Text(_error!, style: const TextStyle(color: AppColors.danger)),
        ],
        const Spacer(),
        PinKeypad(onDigit: _onDigit, onBackspace: _onBackspace),
        const SizedBox(height: 24),
      ],
    );
  }
}
