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

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { logout, username } = useAuth();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : 0;

  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    Haptics.selectionAsync();
  };

  const handleSupport = () => {
    Linking.openURL('mailto:support@nashe.sa');
  };

  const handleTerms = () => {
    Alert.alert('الشروط والأحكام', 'يرجى قراءة شروط وأحكام استخدام منصة ناشئ بعناية.');
  };

  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'هل تريد تسجيل الخروج من ناشئ؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'تسجيل الخروج',
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
      <View style={[sStyles.header, { paddingTop: topPad + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={sStyles.headerTitle}>الإعدادات</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* User badge */}
      {!!username && (
        <View style={sStyles.userBadge}>
          <View style={sStyles.userAvatar}>
            <Ionicons name="person" size={22} color={colors.primary} />
          </View>
          <Text style={sStyles.userName}>{username}</Text>
        </View>
      )}

      {/* Settings rows */}
      <View style={[sStyles.card, { backgroundColor: 'rgba(255,255,255,0.12)', marginBottom: 16 }]}>
        {/* Dark mode */}
        <View style={[sStyles.row, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.2)' }]}>
          <Switch
            value={darkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.8)' }}
            thumbColor={darkMode ? colors.primary : '#FFFFFF'}
            ios_backgroundColor="rgba(255,255,255,0.3)"
          />
          <View style={sStyles.rowContent}>
            <Text style={sStyles.rowTitle}>الوضع الليلي</Text>
            <Text style={sStyles.rowSub}>الإصدار الداخلي</Text>
          </View>
          <Ionicons name="moon-outline" size={20} color="rgba(255,255,255,0.75)" />
        </View>

        {/* Technical support */}
        <Pressable
          style={({ pressed }) => [
            sStyles.row,
            { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.2)' },
            pressed && { opacity: 0.75 },
          ]}
          onPress={handleSupport}
        >
          <Ionicons name="chevron-back" size={16} color="rgba(255,255,255,0.6)" />
          <View style={sStyles.rowContent}>
            <Text style={sStyles.rowTitle}>الدعم الفني</Text>
            <Text style={sStyles.rowSub}>support@nashe.sa</Text>
          </View>
          <Ionicons name="headset-outline" size={20} color="rgba(255,255,255,0.75)" />
        </Pressable>

        {/* Terms */}
        <Pressable
          style={({ pressed }) => [sStyles.row, pressed && { opacity: 0.75 }]}
          onPress={handleTerms}
        >
          <Ionicons name="chevron-back" size={16} color="rgba(255,255,255,0.6)" />
          <View style={sStyles.rowContent}>
            <Text style={sStyles.rowTitle}>الشروط والأحكام</Text>
          </View>
          <Ionicons name="document-text-outline" size={20} color="rgba(255,255,255,0.75)" />
        </Pressable>
      </View>

      {/* Logout */}
      <Pressable
        style={({ pressed }) => [
          sStyles.logoutBtn,
          { backgroundColor: 'rgba(255,255,255,0.15)', opacity: pressed ? 0.75 : 1 },
        ]}
        onPress={handleLogout}
      >
        <Text style={sStyles.logoutText}>تسجيل الخروج</Text>
        <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
      </Pressable>

      {/* Version */}
      <View style={[sStyles.versionRow, { paddingBottom: bottomPad + 100 }]}>
        <Text style={sStyles.versionText}>ناشئ v1.0.0</Text>
      </View>
    </View>
  );
}

const sStyles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  userBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 12,
  },
  rowContent: { flex: 1, alignItems: 'flex-end' },
  rowTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
    textAlign: 'right',
  },
  rowSub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
    textAlign: 'right',
  },
  logoutBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 15,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  versionRow: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});
