import 'package:flutter_test/flutter_test.dart';

import 'package:emirepay/main.dart';

void main() {
  testWidgets('App launches to splash then onboarding', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const EmirePayApp());
    expect(find.text('Emire'), findsOneWidget);

    await tester.pump(const Duration(milliseconds: 2000));
    await tester.pumpAndSettle();
    expect(find.text('Pay bills in seconds'), findsOneWidget);
    expect(find.text('Login'), findsOneWidget);
    expect(find.text('Create Account'), findsOneWidget);
  });
}
