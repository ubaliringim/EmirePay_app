import 'dart:typed_data';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import '../state/profile_photo_controller.dart';
import '../theme/app_theme.dart';

class ProfileAvatar extends StatefulWidget {
  final double radius;

  const ProfileAvatar({super.key, this.radius = 22});

  @override
  State<ProfileAvatar> createState() => _ProfileAvatarState();
}

class _ProfileAvatarState extends State<ProfileAvatar> {
  @override
  void initState() {
    super.initState();
    ProfilePhotoController.ensureLoaded();
  }

  String get _initials {
    final user = FirebaseAuth.instance.currentUser;
    final name = user?.displayName?.trim();
    if (name != null && name.isNotEmpty) {
      final parts = name.split(RegExp(r'\s+'));
      final first = parts.first[0];
      final last = parts.length > 1 ? parts.last[0] : '';
      return (first + last).toUpperCase();
    }
    final email = user?.email;
    if (email != null && email.isNotEmpty) return email[0].toUpperCase();
    return '?';
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<Uint8List?>(
      valueListenable: ProfilePhotoController.photo,
      builder: (context, bytes, _) {
        return CircleAvatar(
          radius: widget.radius,
          backgroundColor: AppColors.primary,
          backgroundImage: bytes != null ? MemoryImage(bytes) : null,
          child: bytes == null
              ? Text(
                  _initials,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: widget.radius * 0.55,
                  ),
                )
              : null,
        );
      },
    );
  }
}
