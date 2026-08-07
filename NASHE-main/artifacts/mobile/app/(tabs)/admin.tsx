import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ACTIVE_USERS_NOW } from '@/constants/videos';

// Mock data — in production this comes from admin-only API endpoints,
// never sent to the client for visitor/scout roles.
const PENDING_REVIEW = [
  { id: 'p1', code: 'F4', athleteName: 'ماجد السبيعي', sport: 'كرة القدم', flagged: true },
  { id: 'p2', code: 'B3', athleteName: 'هند الغامدي', sport: 'كرة السلة', flagged: false },
];

const CONTACTS = [
  { id: 'c1', name: 'سارة العتيبي', phone: '05xxxxxxx1', email: 'sara@example.com', club: '—', guardianPhone: '05xxxxxxx9' },
  { id: 'c2', name: 'فيصل الجريني', phone: '05xxxxxxx2', email: 'faisal@example.com', club: 'نادي الهلال', guardianPhone: '05xxxxxxx8' },
];

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { role } = useAuth();
  const { t, row, align } = useLanguage();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 + 50 : 0;

  // Route guard: this screen must never render contact/connection data for non-admins.
  if (role !== 'admin') {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 }]}>
        <Ionicons name="lock-closed-outline" size={40} color={colors.mutedForeground} />
        <Text style={[styles.deniedText, { color: colors.mutedForeground, textAlign: 'center' }]}>{t('scoutAccessNote')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.admin, paddingTop: topPad + 12, flexDirection: row }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name={row === 'row-reverse' ? 'chevron-forward' : 'chevron-back'} size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>{t('adminTitle')}</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad + 100 }}>
        {/* Stats */}
        <View style={[styles.statsRow, { flexDirection: row }]}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="people-outline" size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{ACTIVE_USERS_NOW}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t('adminActiveUsers')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="hourglass-outline" size={20} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{PENDING_REVIEW.length}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t('adminPendingReview')}</Text>
          </View>
        </View>

        {/* Pending review */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign: align }]}>{t('adminPendingReview')}</Text>
          {PENDING_REVIEW.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.mutedForeground, textAlign: align }]}>{t('adminNoPending')}</Text>
          ) : (
            PENDING_REVIEW.map((item) => (
              <View key={item.id} style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: row }]}>
                <View style={[styles.codeChip, { backgroundColor: item.flagged ? colors.destructive : colors.primary }]}>
                  <Text style={styles.codeChipText}>{item.code}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.reviewName, { color: colors.foreground, textAlign: align }]}>{item.athleteName}</Text>
                  <Text style={[styles.reviewSub, { color: colors.mutedForeground, textAlign: align }]}>
                    {item.sport} · {item.flagged ? t('moderationFlagged') : t('moderationPassed')}
                  </Text>
                </View>
                <View style={[styles.reviewActions, { flexDirection: row }]}>
                  <Pressable style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
                    <Text style={styles.actionBtnText}>{t('adminApprove')}</Text>
                  </Pressable>
                  <Pressable style={[styles.actionBtn, { backgroundColor: colors.destructive }]}>
                    <Text style={styles.actionBtnText}>{t('adminReject')}</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Contacts — admin only */}
        <View style={styles.section}>
          <View style={[styles.contactsHeader, { flexDirection: row }]}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.admin} />
            <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign: align }]}>{t('adminContacts')}</Text>
          </View>
          <Text style={[styles.contactsNote, { color: colors.mutedForeground, textAlign: align }]}>{t('adminContactsNote')}</Text>
          {CONTACTS.map((c) => (
            <View key={c.id} style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.contactName, { color: colors.foreground, textAlign: align }]}>{c.name}</Text>
              <View style={[styles.contactRow, { flexDirection: row }]}>
                <Ionicons name="call-outline" size={14} color={colors.mutedForeground} />
                <Text style={[styles.contactValue, { color: colors.mutedForeground, textAlign: align }]}>{c.phone}</Text>
              </View>
              <View style={[styles.contactRow, { flexDirection: row }]}>
                <Ionicons name="mail-outline" size={14} color={colors.mutedForeground} />
                <Text style={[styles.contactValue, { color: colors.mutedForeground, textAlign: align }]}>{c.email}</Text>
              </View>
              <View style={[styles.contactRow, { flexDirection: row }]}>
                <Ionicons name="shield-outline" size={14} color={colors.mutedForeground} />
                <Text style={[styles.contactValue, { color: colors.mutedForeground, textAlign: align }]}>{c.club}</Text>
              </View>
              <View style={[styles.contactRow, { flexDirection: row }]}>
                <Ionicons name="people-outline" size={14} color={colors.mutedForeground} />
                <Text style={[styles.contactValue, { color: colors.mutedForeground, textAlign: align }]}>
                  {t('guardianPhone')}: {c.guardianPhone}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700' as const, color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  deniedText: { fontSize: 14, fontFamily: 'Inter_500Medium', marginTop: 12 },
  statsRow: { gap: 12, paddingHorizontal: 16, paddingTop: 16 },
  statCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  section: { paddingHorizontal: 16, marginTop: 22 },
  sectionTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', marginBottom: 10 },
  emptyText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  reviewCard: { alignItems: 'center', borderRadius: 12, borderWidth: 1, padding: 12, gap: 10, marginBottom: 10 },
  codeChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  codeChipText: { color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter_700Bold' },
  reviewName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  reviewSub: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  reviewActions: { gap: 6 },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  actionBtnText: { color: '#FFFFFF', fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  contactsHeader: { alignItems: 'center', gap: 6 },
  contactsNote: { fontSize: 11, fontFamily: 'Inter_400Regular', marginBottom: 10, opacity: 0.8 },
  contactCard: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 10, gap: 6 },
  contactName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  contactRow: { alignItems: 'center', gap: 6 },
  contactValue: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});
