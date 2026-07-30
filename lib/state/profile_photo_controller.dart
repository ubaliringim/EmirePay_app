import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';

import '../services/vtpass_service.dart';

/// Shared profile photo bytes so every ProfileAvatar on screen (Home, More,
/// Profile) reflects the same value instead of each fetching independently.
/// Home and More stay mounted forever inside HomeShell's IndexedStack, so
/// without a shared notifier they'd never see updates made from Profile.
class ProfilePhotoController {
  ProfilePhotoController._();

  static final ValueNotifier<Uint8List?> photo = ValueNotifier(null);
  static String? _loadedForUid;

  /// Fetches the photo the first time it's needed for the current signed-in
  /// user; automatically refetches if a different user has since signed in.
  static Future<void> ensureLoaded() async {
    final uid = FirebaseAuth.instance.currentUser?.uid;
    if (uid == null) {
      photo.value = null;
      _loadedForUid = null;
      return;
    }
    if (_loadedForUid == uid) return;
    _loadedForUid = uid;
    photo.value = await VtpassService.fetchProfilePhoto();
  }

  /// Call after a successful upload/delete so all avatars update immediately.
  static Future<void> refresh() async {
    final uid = FirebaseAuth.instance.currentUser?.uid;
    _loadedForUid = uid;
    photo.value = await VtpassService.fetchProfilePhoto();
  }
}
