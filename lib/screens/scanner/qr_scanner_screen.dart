import 'dart:async';

import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

import '../../theme/app_theme.dart';

class QrScannerScreen extends StatefulWidget {
  const QrScannerScreen({super.key});

  @override
  State<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends State<QrScannerScreen> {
  final _controller = MobileScannerController(
    facing: CameraFacing.back,
    // Some Samsung/MediaTek devices (e.g. Galaxy A-series) fail to open the
    // camera or return corrupted frames at the plugin's default resolution.
    // 640x480 is the resolution the mobile_scanner community has confirmed
    // works around this: https://github.com/juliansteenbakker/mobile_scanner/issues/698
    cameraResolution: const Size(640, 480),
    formats: const [BarcodeFormat.qrCode],
  );
  bool _handled = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture capture) {
    if (_handled) return;
    final barcodes = capture.barcodes;
    final value = barcodes.isEmpty ? null : barcodes.first.rawValue;
    if (value == null || value.isEmpty) return;

    _handled = true;
    unawaited(_controller.stop());
    _showResult(value);
  }

  void _showResult(String value) {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: AppColors.bettingBg,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.qr_code_rounded, color: AppColors.primary, size: 20),
            ),
            const SizedBox(width: 12),
            const Text('QR Code Scanned'),
          ],
        ),
        content: Text(value, style: const TextStyle(color: AppColors.textSecondary)),
        actions: [
          TextButton(
            onPressed: () {
              setState(() => _handled = false);
              unawaited(_controller.start());
              Navigator.of(context).pop();
            },
            child: const Text('Scan Again'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.of(this.context).pop();
            },
            child: const Text('Done'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        fit: StackFit.expand,
        children: [
          MobileScanner(
            controller: _controller,
            onDetect: _onDetect,
            errorBuilder: (context, error) => _ScannerError(
              error: error,
              onRetry: () => unawaited(_controller.start()),
            ),
          ),
          Container(
            decoration: ShapeDecoration(
              shape: _ScannerOverlayShape(
                borderColor: AppColors.primary,
                cutOutSize: 260,
              ),
            ),
          ),
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
                  ),
                  const Text(
                    'Scan QR Code',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                    ),
                  ),
                  Row(
                    children: [
                      IconButton(
                        onPressed: () => unawaited(_controller.switchCamera()),
                        icon: const Icon(Icons.cameraswitch_rounded, color: Colors.white),
                      ),
                      ValueListenableBuilder(
                        valueListenable: _controller,
                        builder: (context, state, child) {
                          final on = state.torchState == TorchState.on;
                          return IconButton(
                            onPressed: () => unawaited(_controller.toggleTorch()),
                            icon: Icon(
                              on ? Icons.flash_on_rounded : Icons.flash_off_rounded,
                              color: Colors.white,
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 64),
              child: Text(
                'Align the QR code within the frame to scan',
                style: TextStyle(color: Colors.white.withValues(alpha: 0.85)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ScannerError extends StatelessWidget {
  final MobileScannerException error;
  final VoidCallback onRetry;

  const _ScannerError({required this.error, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    final isPermissionDenied = error.errorCode == MobileScannerErrorCode.permissionDenied;

    return ColoredBox(
      color: Colors.black,
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.no_photography_rounded,
                  color: Colors.white,
                  size: 34,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                isPermissionDenied ? 'Camera access needed' : 'Camera unavailable',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                isPermissionDenied
                    ? 'EmirePay needs camera access to scan QR codes. Please allow camera permission to continue.'
                    : 'Something went wrong while starting the camera. Please try again.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white.withValues(alpha: 0.7)),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh_rounded, size: 18),
                label: const Text('Try Again'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Draws a dark scrim with a clear square cut-out and rounded, colored
/// corner brackets for the QR viewfinder.
class _ScannerOverlayShape extends ShapeBorder {
  final Color borderColor;
  final double cutOutSize;

  const _ScannerOverlayShape({required this.borderColor, required this.cutOutSize});

  @override
  EdgeInsetsGeometry get dimensions => EdgeInsets.zero;

  @override
  Path getInnerPath(Rect rect, {TextDirection? textDirection}) => Path();

  @override
  Path getOuterPath(Rect rect, {TextDirection? textDirection}) {
    final center = rect.center;
    final cutOut = Rect.fromCenter(center: center, width: cutOutSize, height: cutOutSize);
    return Path()
      ..addRect(rect)
      ..addRRect(RRect.fromRectAndRadius(cutOut, const Radius.circular(24)))
      ..fillType = PathFillType.evenOdd;
  }

  @override
  void paint(Canvas canvas, Rect rect, {TextDirection? textDirection}) {
    final center = rect.center;
    final cutOut = Rect.fromCenter(center: center, width: cutOutSize, height: cutOutSize);

    canvas.drawPath(
      Path()
        ..addRect(rect)
        ..addRRect(RRect.fromRectAndRadius(cutOut, const Radius.circular(24)))
        ..fillType = PathFillType.evenOdd,
      Paint()..color = Colors.black.withValues(alpha: 0.55),
    );

    const bracketLength = 28.0;
    const strokeWidth = 5.0;
    final bracketPaint = Paint()
      ..color = borderColor
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final corners = [cutOut.topLeft, cutOut.topRight, cutOut.bottomLeft, cutOut.bottomRight];
    for (final corner in corners) {
      final dx = corner.dx == cutOut.left ? 1.0 : -1.0;
      final dy = corner.dy == cutOut.top ? 1.0 : -1.0;
      canvas.drawPath(
        Path()
          ..moveTo(corner.dx, corner.dy + bracketLength * dy)
          ..lineTo(corner.dx, corner.dy)
          ..lineTo(corner.dx + bracketLength * dx, corner.dy),
        bracketPaint,
      );
    }
  }

  @override
  ShapeBorder scale(double t) => this;
}
