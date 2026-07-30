import 'dart:convert';
import 'dart:typed_data';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;

import '../models/cable_package.dart';
import '../models/data_plan.dart';
import '../models/internet_plan.dart';
import '../models/transaction.dart';

/// Thin client for the emirepay-vtpass-proxy Cloudflare Worker, which holds
/// the real VTpass credentials server-side and forwards biller purchases.
class VtpassService {
  VtpassService._();

  static const _baseUrl =
      'https://emirepay-vtpass-proxy.ubaliiringim.workers.dev';

  static Future<Map<String, dynamic>> purchaseAirtime({
    required String serviceID,
    required num amount,
    required String phone,
  }) async {
    return _post('/airtime', {
      'serviceID': serviceID,
      'amount': amount,
      'phone': phone,
    });
  }

  static Future<List<DataPlan>> fetchDataPlans(String serviceID) async {
    final data = await _get('/data-plans', {'serviceID': serviceID});
    final variations = (data['variations'] as List)
        .cast<Map<String, dynamic>>();
    return variations
        .map(
          (v) => DataPlan(
            variationCode: v['variation_code'] as String,
            name: v['name'] as String,
            price: double.tryParse(v['variation_amount'].toString()) ?? 0,
          ),
        )
        .toList();
  }

  static Future<Map<String, dynamic>> purchaseData({
    required String serviceID,
    required String variationCode,
    required num amount,
    required String phone,
  }) async {
    return _post('/data', {
      'serviceID': serviceID,
      'variationCode': variationCode,
      'amount': amount,
      'phone': phone,
    });
  }

  static Future<Map<String, dynamic>> verifyMeter({
    required String serviceID,
    required String meterNumber,
    required String meterType,
  }) async {
    return _post('/electricity/verify', {
      'serviceID': serviceID,
      'meterNumber': meterNumber,
      'meterType': meterType,
    });
  }

  static Future<Map<String, dynamic>> purchaseElectricity({
    required String serviceID,
    required String meterNumber,
    required String meterType,
    required num amount,
    required String phone,
  }) async {
    return _post('/electricity', {
      'serviceID': serviceID,
      'meterNumber': meterNumber,
      'meterType': meterType,
      'amount': amount,
      'phone': phone,
    });
  }

  static Future<List<CablePackage>> fetchCablePlans(String serviceID) async {
    final data = await _get('/cable-plans', {'serviceID': serviceID});
    final variations = (data['variations'] as List)
        .cast<Map<String, dynamic>>();
    return variations
        .map(
          (v) => CablePackage(
            variationCode: v['variation_code'] as String,
            name: v['name'] as String,
            price: double.tryParse(v['variation_amount'].toString()) ?? 0,
          ),
        )
        .toList();
  }

  static Future<Map<String, dynamic>> verifySmartcard({
    required String serviceID,
    required String smartcardNumber,
  }) async {
    return _post('/cable/verify', {
      'serviceID': serviceID,
      'smartcardNumber': smartcardNumber,
    });
  }

  static Future<Map<String, dynamic>> purchaseCableTv({
    required String serviceID,
    required String smartcardNumber,
    required String variationCode,
    required num amount,
    required String phone,
  }) async {
    return _post('/cable', {
      'serviceID': serviceID,
      'smartcardNumber': smartcardNumber,
      'variationCode': variationCode,
      'amount': amount,
      'phone': phone,
    });
  }

  static Future<List<InternetPlan>> fetchInternetPlans(String serviceID) async {
    final data = await _get('/internet-plans', {'serviceID': serviceID});
    final variations = (data['variations'] as List)
        .cast<Map<String, dynamic>>();
    return variations
        .map(
          (v) => InternetPlan(
            variationCode: v['variation_code'] as String,
            name: v['name'] as String,
            price: double.tryParse(v['variation_amount'].toString()) ?? 0,
          ),
        )
        .toList();
  }

  static Future<Map<String, dynamic>> verifySmileEmail({
    required String email,
  }) async {
    return _post('/internet/verify', {'email': email});
  }

  static Future<Map<String, dynamic>> purchaseInternet({
    required String serviceID,
    required String billersCode,
    required String variationCode,
    required num amount,
    required String phone,
  }) async {
    return _post('/internet', {
      'serviceID': serviceID,
      'billersCode': billersCode,
      'variationCode': variationCode,
      'amount': amount,
      'phone': phone,
    });
  }

  static Future<double> fetchBalance() async {
    final data = await _get('/balance', {});
    return (data['balance'] as num?)?.toDouble() ?? 0;
  }

  static Future<List<AppTransaction>> fetchTransactions() async {
    final data = await _get('/transactions', {});
    final rows = (data['transactions'] as List).cast<Map<String, dynamic>>();
    return rows.map(AppTransaction.fromJson).toList();
  }

  static Future<Uint8List?> fetchProfilePhoto() async {
    final token = await _authToken();
    final response = await http.get(
      Uri.parse('$_baseUrl/profile-photo'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode == 404) return null;
    if (response.statusCode != 200) {
      throw Exception('Request failed (HTTP ${response.statusCode})');
    }
    return response.bodyBytes;
  }

  static Future<void> uploadProfilePhoto(
    Uint8List bytes,
    String contentType,
  ) async {
    final token = await _authToken();
    final response = await http.post(
      Uri.parse('$_baseUrl/profile-photo'),
      headers: {'Content-Type': contentType, 'Authorization': 'Bearer $token'},
      body: bytes,
    );
    _decode(response);
  }

  static Future<void> deleteProfilePhoto() async {
    final token = await _authToken();
    final response = await http.delete(
      Uri.parse('$_baseUrl/profile-photo'),
      headers: {'Authorization': 'Bearer $token'},
    );
    _decode(response);
  }

  static Future<String> _authToken() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      throw StateError('You must be signed in to do this.');
    }
    final token = await user.getIdToken();
    if (token == null) {
      throw StateError('Could not verify your session. Please sign in again.');
    }
    return token;
  }

  static Future<Map<String, dynamic>> _get(
    String path,
    Map<String, String> query,
  ) async {
    final token = await _authToken();
    final response = await http.get(
      Uri.parse('$_baseUrl$path').replace(queryParameters: query),
      headers: {'Authorization': 'Bearer $token'},
    );
    return _decode(response);
  }

  static Future<Map<String, dynamic>> _post(
    String path,
    Map<String, dynamic> body,
  ) async {
    final token = await _authToken();
    final response = await http.post(
      Uri.parse('$_baseUrl$path'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body),
    );
    return _decode(response);
  }

  static Map<String, dynamic> _decode(http.Response response) {
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode != 200) {
      throw Exception(
        data['error'] ?? 'Request failed (HTTP ${response.statusCode})',
      );
    }
    return data;
  }
}
