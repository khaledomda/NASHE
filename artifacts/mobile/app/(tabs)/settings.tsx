import React from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { BrandWordmark } from '@/components/BrandWordmark';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout, username, role } = useAuth();
  const { t, row, align, toggleLang, lang } = useLanguage();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : 0;

  const roleLabel = role === 'admin' ? t('roleAdmin') : role === 'scout' ? t('roleScout') : t('roleVisitor');

  const handleSupport = () => {
    Linking.openURL('mailto:support@nashe.sa');
  };

  const handleTerms = () => {
    Alert.alert(t('terms'), t('termsBody'));
  };

  const handleLogout = () => {
    Alert.alert(t('logout'), t('logoutConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('logout'),
        style: 'destructive',
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <View style={[sStyles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          sStyles.header,
          {
            paddingTop: topPad + 12,
            flexDirection: row,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons
            name={row === 'row-reverse' ? 'chevron-forward' : 'chevron-back'}
            size={22}
            color={colors.primary}
          />
        </Pressable>
        <Text style={[sStyles.headerTitle, { color: colors.foreground }]}>{t('settingsTitle')}</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* User badge */}
      {!!username && (
        <View style={[sStyles.userBadge, { flexDirection: row }]}>
          <View style={[sStyles.userAvatar, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="person" size={22} color={colors.primary} />
          </View>
          <View>
            <Text style={[sStyles.userName, { color: colors.foreground, textAlign: align }]}>{username}</Text>
            <Text style={[sStyles.userRole, { color: colors.mutedForeground, textAlign: align }]}>{roleLabel}</Text>
          </View>
        </View>
      )}

      {/* Settings rows */}
      <View style={[sStyles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 16 }]}>
        {/* Language */}
        <Pressable
          style={({ pressed }) => [
            sStyles.row,
            { flexDirection: row, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
            pressed && { opacity: 0.75 },
          ]}
          onPress={toggleLang}
        >
          <Ionicons
            name="chevron-back"
            size={16}
            color={colors.mutedForeground}
            style={row === 'row' ? { transform: [{ scaleX: -1 }] } : undefined}
          />
          <View style={[sStyles.rowContent, { alignItems: align === 'right' ? 'flex-end' : 'flex-start' }]}>
            <Text style={[sStyles.rowTitle, { color: colors.foreground, textAlign: align }]}>{t('changeLanguage')}</Text>
            <Text style={[sStyles.rowSub, { color: colors.mutedForeground, textAlign: align }]}>
              {lang === 'ar' ? 'العربية' : 'English'}
            </Text>
          </View>
          <Ionicons name="language-outline" size={20} color={colors.primary} />
        </Pressable>

        {/* Dark mode follows the OS setting automatically (no in-app override). */}

        {/* Technical support */}
        <Pressable
          style={({ pressed }) => [
            sStyles.row,
            { flexDirection: row, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
            pressed && { opacity: 0.75 },
          ]}
          onPress={handleSupport}
        >
          <Ionicons
            name="chevron-back"
            size={16}
            color={colors.mutedForeground}
            style={row === 'row' ? { transform: [{ scaleX: -1 }] } : undefined}
          />
          <View style={[sStyles.rowContent, { alignItems: align === 'right' ? 'flex-end' : 'flex-start' }]}>
            <Text style={[sStyles.rowTitle, { color: colors.foreground, textAlign: align }]}>{t('support')}</Text>
            <Text style={[sStyles.rowSub, { color: colors.mutedForeground, textAlign: align }]}>support@nashe.sa</Text>
          </View>
          <Ionicons name="headset-outline" size={20} color={colors.primary} />
        </Pressable>

        {/* Terms */}
        <Pressable
          style={({ pressed }) => [sStyles.row, { flexDirection: row }, pressed && { opacity: 0.75 }]}
          onPress={handleTerms}
        >
          <Ionicons
            name="chevron-back"
            size={16}
            color={colors.mutedForeground}
            style={row === 'row' ? { transform: [{ scaleX: -1 }] } : undefined}
          />
          <View style={[sStyles.rowContent, { alignItems: align === 'right' ? 'flex-end' : 'flex-start' }]}>
            <Text style={[sStyles.rowTitle, { color: colors.foreground, textAlign: align }]}>{t('terms')}</Text>
          </View>
          <Ionicons name="document-text-outline" size={20} color={colors.primary} />
        </Pressable>
      </View>

      {/* Logout */}
      <Pressable
        style={({ pressed }) => [
          sStyles.logoutBtn,
          {
            flexDirection: row,
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
        onPress={handleLogout}
      >
        <Text style={[sStyles.logoutText, { color: colors.destructive }]}>{t('logout')}</Text>
        <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
      </Pressable>

      {/* Version */}
      <View style={[sStyles.versionRow, { paddingBottom: bottomPad + 100 }]}>
        <BrandWordmark size={16} style={{ opacity: 0.55, marginBottom: 6 }} />
        <Text style={[sStyles.versionText, { color: colors.mutedForeground }]}>NASHE v1.0.0</Text>
      </View>
    </View>
  );
}

const sStyles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
  userBadge: { alignItems: 'center', gap: 12, marginHorizontal: 20, marginBottom: 24 },
  userAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: 16, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
  userRole: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  card: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18, gap: 12 },
  rowContent: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '500' as const, fontFamily: 'Inter_500Medium' },
  rowSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  logoutBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  logoutText: { fontSize: 15, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
  versionRow: { alignItems: 'center', marginTop: 20 },
  versionText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});
