import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { logout, username, role } = useAuth();
  const { t, row, align, toggleLang, lang } = useLanguage();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : 0;

  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');

  const roleLabel = role === 'admin' ? t('roleAdmin') : role === 'scout' ? t('roleScout') : t('roleVisitor');

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    Haptics.selectionAsync();
  };

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
    <View style={[sStyles.root, { backgroundColor: colors.primary }]}>
      {/* Header */}
      <View style={[sStyles.header, { paddingTop: topPad + 12, flexDirection: row }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name={row === 'row-reverse' ? 'chevron-forward' : 'chevron-back'} size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={sStyles.headerTitle}>{t('settingsTitle')}</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* User badge */}
      {!!username && (
        <View style={[sStyles.userBadge, { flexDirection: row }]}>
          <View style={sStyles.userAvatar}>
            <Ionicons name="person" size={22} color={colors.primary} />
          </View>
          <View>
            <Text style={[sStyles.userName, { textAlign: align }]}>{username}</Text>
            <Text style={[sStyles.userRole, { textAlign: align }]}>{roleLabel}</Text>
          </View>
        </View>
      )}

      {/* Settings rows */}
      <View style={[sStyles.card, { backgroundColor: 'rgba(255,255,255,0.12)', marginBottom: 16 }]}>
        {/* Language */}
        <Pressable
          style={({ pressed }) => [
            sStyles.row,
            { flexDirection: row, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.2)' },
            pressed && { opacity: 0.75 },
          ]}
          onPress={toggleLang}
        >
          <Ionicons name="chevron-back" size={16} color="rgba(255,255,255,0.6)" style={row === 'row' ? { transform: [{ scaleX: -1 }] } : undefined} />
          <View style={[sStyles.rowContent, { alignItems: align === 'right' ? 'flex-end' : 'flex-start' }]}>
            <Text style={[sStyles.rowTitle, { textAlign: align }]}>{t('changeLanguage')}</Text>
            <Text style={[sStyles.rowSub, { textAlign: align }]}>{lang === 'ar' ? 'العربية' : 'English'}</Text>
          </View>
          <Ionicons name="language-outline" size={20} color="rgba(255,255,255,0.75)" />
        </Pressable>

        {/* Dark mode */}
        <View
          style={[
            sStyles.row,
            { flexDirection: row, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.2)' },
          ]}
        >
          <Switch
            value={darkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.8)' }}
            thumbColor={darkMode ? colors.primary : '#FFFFFF'}
            ios_backgroundColor="rgba(255,255,255,0.3)"
          />
          <View style={[sStyles.rowContent, { alignItems: align === 'right' ? 'flex-end' : 'flex-start' }]}>
            <Text style={[sStyles.rowTitle, { textAlign: align }]}>{t('darkMode')}</Text>
          </View>
          <Ionicons name="moon-outline" size={20} color="rgba(255,255,255,0.75)" />
        </View>

        {/* Technical support */}
        <Pressable
          style={({ pressed }) => [
            sStyles.row,
            { flexDirection: row, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.2)' },
            pressed && { opacity: 0.75 },
          ]}
          onPress={handleSupport}
        >
          <Ionicons name="chevron-back" size={16} color="rgba(255,255,255,0.6)" style={row === 'row' ? { transform: [{ scaleX: -1 }] } : undefined} />
          <View style={[sStyles.rowContent, { alignItems: align === 'right' ? 'flex-end' : 'flex-start' }]}>
            <Text style={[sStyles.rowTitle, { textAlign: align }]}>{t('support')}</Text>
            <Text style={[sStyles.rowSub, { textAlign: align }]}>support@nashe.sa</Text>
          </View>
          <Ionicons name="headset-outline" size={20} color="rgba(255,255,255,0.75)" />
        </Pressable>

        {/* Terms */}
        <Pressable
          style={({ pressed }) => [sStyles.row, { flexDirection: row }, pressed && { opacity: 0.75 }]}
          onPress={handleTerms}
        >
          <Ionicons name="chevron-back" size={16} color="rgba(255,255,255,0.6)" style={row === 'row' ? { transform: [{ scaleX: -1 }] } : undefined} />
          <View style={[sStyles.rowContent, { alignItems: align === 'right' ? 'flex-end' : 'flex-start' }]}>
            <Text style={[sStyles.rowTitle, { textAlign: align }]}>{t('terms')}</Text>
          </View>
          <Ionicons name="document-text-outline" size={20} color="rgba(255,255,255,0.75)" />
        </Pressable>
      </View>

      {/* Logout */}
      <Pressable
        style={({ pressed }) => [
          sStyles.logoutBtn,
          { flexDirection: row, backgroundColor: 'rgba(255,255,255,0.15)', opacity: pressed ? 0.75 : 1 },
        ]}
        onPress={handleLogout}
      >
        <Text style={sStyles.logoutText}>{t('logout')}</Text>
        <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
      </Pressable>

      {/* Version */}
      <View style={[sStyles.versionRow, { paddingBottom: bottomPad + 100 }]}>
        <Text style={sStyles.versionText}>Nashe · ناشئ v1.0.0</Text>
      </View>
    </View>
  );
}

const sStyles = StyleSheet.create({
  root: { flex: 1 },
  header: { alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: '700' as const, color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  userBadge: { alignItems: 'center', gap: 12, marginHorizontal: 20, marginBottom: 24 },
  userAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  userName: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
  userRole: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  card: { marginHorizontal: 16, borderRadius: 16, overflow: 'hidden' },
  row: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18, gap: 12 },
  rowContent: { flex: 1 },
  rowTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '500' as const, fontFamily: 'Inter_500Medium' },
  rowSub: { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  logoutBtn: { alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, paddingVertical: 16, borderRadius: 14, gap: 10 },
  logoutText: { color: '#FF6B6B', fontSize: 15, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
  versionRow: { alignItems: 'center', marginTop: 20 },
  versionText: { color: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: 'Inter_400Regular' },
});
