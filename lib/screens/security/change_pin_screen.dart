import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';
import '../../widgets/pin_keypad.dart';
import 'forgot_pin_screen.dart';

class ChangePinScreen extends StatefulWidget {
  const ChangePinScreen({super.key});

  @override
  State<ChangePinScreen> createState() => _ChangePinScreenState();
}

enum _PinStep { current, newPin, confirmPin }

class _ChangePinScreenState extends State<ChangePinScreen> {
  static const _storedPin = '1234';

  _PinStep _step = _PinStep.current;
  String _entered = '';
  String? _newPin;
  String? _error;

  String get _title => switch (_step) {
        _PinStep.current => 'Enter your current PIN',
        _PinStep.newPin => 'Enter a new 4-digit PIN',
        _PinStep.confirmPin => 'Confirm your new PIN',
      };

  void _onDigit(String digit) {
    if (_entered.length >= 4) return;
    setState(() {
      _entered += digit;
      _error = null;
    });
    if (_entered.length == 4) {
      Future.delayed(const Duration(milliseconds: 200), _onComplete);
    }
  }

  void _onBackspace() {
    if (_entered.isEmpty) return;
    setState(() => _entered = _entered.substring(0, _entered.length - 1));
  }

  void _onComplete() {
    switch (_step) {
      case _PinStep.current:
        if (_entered == _storedPin) {
          setState(() {
            _step = _PinStep.newPin;
            _entered = '';
          });
        } else {
          setState(() {
            _error = 'Incorrect PIN. Try again.';
            _entered = '';
          });
        }
      case _PinStep.newPin:
        setState(() {
          _newPin = _entered;
          _step = _PinStep.confirmPin;
          _entered = '';
        });
      case _PinStep.confirmPin:
        if (_entered == _newPin) {
          Navigator.of(context).pop();
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Transaction PIN updated successfully')),
          );
        } else {
          setState(() {
            _error = "PINs don't match. Try again.";
            _step = _PinStep.newPin;
            _entered = '';
            _newPin = null;
          });
        }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Change PIN')),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 32),
            Text(
              _title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 24),
            PinDots(length: 4, filled: _entered.length, error: _error != null),
            if (_error != null) ...[
              const SizedBox(height: 16),
              Text(_error!, style: const TextStyle(color: AppColors.danger)),
            ],
            if (_step == _PinStep.current) ...[
              const SizedBox(height: 16),
              TextButton(
                onPressed: () => Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) => const ForgotPinScreen()),
                ),
                child: const Text('Forgot PIN?'),
              ),
            ],
            const Spacer(),
            PinKeypad(onDigit: _onDigit, onBackspace: _onBackspace),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
