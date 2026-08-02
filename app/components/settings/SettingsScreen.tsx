import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { User, Mail, Phone, Lock, Bell, HelpCircle, LogOut, ChevronRight, Copy, Check } from 'lucide-react-native';
import { Button, Input, Card, BottomSheet } from '../ui';
import { Colors, Spacing, Rounded } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';

interface SettingsScreenProps {
  onLogout: () => void;
}

export function SettingsScreen({ onLogout }: SettingsScreenProps) {
  const { user, updateProfile } = useUserStore();
  const [editing, setEditing] = useState(false);
  const [showPasswordSheet, setShowPasswordSheet] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const initials = (user?.fullName || '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSave = () => {
    updateProfile(formData);
    setEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleCopyAccount = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (passwordData.new.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setShowPasswordSheet(false);
    setPasswordData({ current: '', new: '', confirm: '' });
    Alert.alert('Success', 'Password changed successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log out of Emir Pay?',
      "You'll need to sign in again to access your wallet.",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <Card padding="lg">
          {!editing && (
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.profileHeaderInfo}>
                <Text style={styles.profileName}>{user?.fullName}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
              </View>
            </View>
          )}
          {editing ? (
            <>
              <Input
                label="Full Name"
                value={formData.fullName}
                onChangeText={(v) => setFormData({ ...formData, fullName: v })}
              />
              <Input
                label="Email"
                value={formData.email}
                onChangeText={(v) => setFormData({ ...formData, email: v })}
                keyboardType="email-address"
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChangeText={(v) => setFormData({ ...formData, phone: v })}
                keyboardType="phone-pad"
              />
              <View style={styles.editActions}>
                <Button title="Save Changes" onPress={handleSave} size="sm" />
                <Button title="Cancel" variant="outline" onPress={() => setEditing(false)} size="sm" />
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.profileItem} onPress={() => setEditing(true)}>
                <View style={styles.profileIcon}>
                  <User size={20} color={Colors.ink} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileLabel}>Full Name</Text>
                  <Text style={styles.profileValue}>{user?.fullName}</Text>
                </View>
                <ChevronRight size={20} color={Colors.mute} />
              </TouchableOpacity>
              <View style={styles.divider} />
              <View style={styles.profileItem}>
                <View style={styles.profileIcon}>
                  <Mail size={20} color={Colors.ink} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileLabel}>Email</Text>
                  <Text style={styles.profileValue}>{user?.email}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.profileItem}>
                <View style={styles.profileIcon}>
                  <Phone size={20} color={Colors.ink} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileLabel}>Phone</Text>
                  <Text style={styles.profileValue}>{user?.phone}</Text>
                </View>
              </View>
            </>
          )}
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Card padding="lg">
          <View style={styles.accountCard}>
            <View>
              <Text style={styles.accountLabel}>Virtual Account</Text>
              <Text style={styles.accountNumber}>{user?.virtualAccountNumber}</Text>
              <Text style={styles.accountBank}>
                {user?.virtualAccountBank} · {user?.fullName}
              </Text>
            </View>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyAccount}>
              {copied ? <Check size={16} color={Colors.positive} /> : <Copy size={16} color={Colors.ink} />}
            </TouchableOpacity>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <Card padding="lg">
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowPasswordSheet(true)}>
            <View style={styles.menuIcon}>
              <Lock size={20} color={Colors.ink} />
            </View>
            <Text style={styles.menuText}>Change Password</Text>
            <ChevronRight size={20} color={Colors.mute} />
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Card padding="lg">
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Bell size={20} color={Colors.ink} />
            </View>
            <Text style={styles.menuText}>Push Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.border, true: Colors.primaryNeutral }}
              thumbColor={notificationsEnabled ? Colors.secondary : Colors.canvas}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Mail size={20} color={Colors.ink} />
            </View>
            <Text style={styles.menuText}>Email Notifications</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: Colors.border, true: Colors.primaryNeutral }}
              thumbColor={emailNotifications ? Colors.secondary : Colors.canvas}
            />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <Card padding="lg">
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <HelpCircle size={20} color={Colors.ink} />
            </View>
            <Text style={styles.menuText}>Help & FAQ</Text>
            <ChevronRight size={20} color={Colors.mute} />
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.negative} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet visible={showPasswordSheet} onClose={() => setShowPasswordSheet(false)} title="Change Password">
        <View style={styles.passwordSheet}>
          <Input
            label="Current Password"
            placeholder="Enter current password"
            value={passwordData.current}
            onChangeText={(v) => setPasswordData({ ...passwordData, current: v })}
            secureTextEntry
            showPasswordToggle
          />
          <Input
            label="New Password"
            placeholder="At least 6 characters"
            value={passwordData.new}
            onChangeText={(v) => setPasswordData({ ...passwordData, new: v })}
            secureTextEntry
            showPasswordToggle
          />
          <Input
            label="Confirm New Password"
            placeholder="Repeat new password"
            value={passwordData.confirm}
            onChangeText={(v) => setPasswordData({ ...passwordData, confirm: v })}
            secureTextEntry
            showPasswordToggle
          />
          <Button title="Change Password" variant="dark" onPress={handleChangePassword} fullWidth />
        </View>
      </BottomSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvasSoft,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Archivo_800ExtraBold',
    color: Colors.ink,
    letterSpacing: -0.36,
    marginBottom: Spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.lg,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'Archivo_900Black',
    color: Colors.ink,
  },
  profileHeaderInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Archivo_800ExtraBold',
    color: Colors.ink,
    letterSpacing: -0.36,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.body,
    marginTop: Spacing.xxs,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.canvasSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 12,
    color: Colors.mute,
    marginBottom: Spacing.xxs,
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.ink,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountLabel: {
    fontSize: 12,
    color: Colors.mute,
    marginBottom: Spacing.xxs,
  },
  accountNumber: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'Archivo_900Black',
    color: Colors.ink,
    letterSpacing: -0.4,
  },
  accountBank: {
    fontSize: 12,
    color: Colors.body,
    marginTop: Spacing.xs,
  },
  copyButton: {
    padding: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.canvasSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.ink,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.negative,
    padding: Spacing.lg,
    borderRadius: Rounded.xl,
    marginBottom: Spacing['3xl'],
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.negative,
    marginLeft: Spacing.sm,
  },
  passwordSheet: {
    padding: Spacing.xl,
  },
});
