import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { SPORTS, sportName } from '@/constants/sports';
import { videosBySportAndGender, ACTIVE_USERS_NOW, Gender, Video } from '@/constants/videos';

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionHeader({ title, icon, align }: { title: string; icon: React.ReactNode; align: 'left' | 'right' }) {
  const colors = useColors();
  const { row } = useLanguage();
  return (
    <View style={[sStyles.sectionHeader, { flexDirection: row }]}>
      {icon}
      <Text style={[sStyles.sectionTitle, { color: colors.foreground, textAlign: align }]}>{title}</Text>
    </View>
  );
}

function GenderPill({ gender }: { gender: Gender }) {
  const colors = useColors();
  const { t } = useLanguage();
  const isMale = gender === 'male';
  return (
    <View
      style={[
        sStyles.genderPill,
        { backgroundColor: isMale ? colors.maleLight : colors.femaleLight },
      ]}
    >
      <Ionicons name={isMale ? 'male' : 'female'} size={12} color={isMale ? colors.male : colors.female} />
      <Text style={[sStyles.genderPillText, { color: isMale ? colors.male : colors.female }]}>
        {isMale ? t('male') : t('female')}
      </Text>
    </View>
  );
}

function ClipCard({ item }: { item: Video }) {
  const colors = useColors();
  const { t, align } = useLanguage();
  return (
    <Pressable
      style={({ pressed }) => [sStyles.clipCard, { backgroundColor: item.color, opacity: pressed ? 0.85 : 1 }]}
    >
      <View style={sStyles.clipTopRow}>
        <View style={sStyles.codeBadge}>
          <Text style={sStyles.codeBadgeText}>{item.code}</Text>
        </View>
        <View style={sStyles.viewsBadge}>
          <Ionicons name="eye-outline" size={11} color="#FFFFFF" />
          <Text style={sStyles.viewsBadgeText}>{item.views}</Text>
        </View>
      </View>
      <View style={sStyles.clipOverlay}>
        <Ionicons name="play-circle" size={34} color="rgba(255,255,255,0.9)" />
      </View>
      <View style={sStyles.clipMeta}>
        <Text style={[sStyles.clipDuration, { textAlign: align }]}>
          {item.durationSec}
          {t('seconds')}
        </Text>
        <Text style={[sStyles.clipPlayer, { textAlign: align }]} numberOfLines={1}>
          {item.athleteName}
        </Text>
      </View>
    </Pressable>
  );
}

function SportGenderRow({ sportLabel, gender, videos }: { sportLabel: string; gender: Gender; videos: Video[] }) {
  const colors = useColors();
  const { t, align } = useLanguage();
  if (videos.length === 0) return null;
  return (
    <View style={sStyles.genderRow}>
      <View style={[sStyles.genderRowHeader, { justifyContent: 'space-between' }]}>
        <GenderPill gender={gender} />
        <Text style={[sStyles.genderRowCount, { color: colors.mutedForeground, textAlign: align }]}>
          {videos.length} {sportLabel}
        </Text>
      </View>
      <FlatList
        data={videos}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ClipCard item={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      />
    </View>
  );
}

function SportSection({ sportId }: { sportId: (typeof SPORTS)[number]['id'] }) {
  const colors = useColors();
  const { lang, align } = useLanguage();
  const sport = SPORTS.find((s) => s.id === sportId)!;
  const male = videosBySportAndGender(sportId, 'male');
  const female = videosBySportAndGender(sportId, 'female');
  if (male.length === 0 && female.length === 0) return null;

  const IconComp = sport.iconSet === 'ion' ? Ionicons : MaterialCommunityIcons;

  return (
    <View style={styles.section}>
      <SectionHeader
        title={sportName(sport, lang)}
        align={align}
        icon={<IconComp name={sport.icon as never} size={18} color={colors.primary} style={{ marginHorizontal: 6 }} />}
      />
      <SportGenderRow sportLabel={sportName(sport, lang)} gender="male" videos={male} />
      <SportGenderRow sportLabel={sportName(sport, lang)} gender="female" videos={female} />
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, row, align } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 + 50 : 0;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: topPad + 12, flexDirection: row }]}>
        <Pressable onPress={() => router.push('/(tabs)/settings')} hitSlop={12}>
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>{t('tabHome')}</Text>
        <View style={styles.activeUsersPill}>
          <Ionicons name="people" size={13} color="#FFFFFF" />
          <Text style={styles.activeUsersText}>{ACTIVE_USERS_NOW}</Text>
        </View>
      </View>

      {/* Trial banner */}
      <View style={[styles.trialBanner, { backgroundColor: colors.secondary, flexDirection: row }]}>
        <Ionicons name="time-outline" size={14} color={colors.primary} />
        <Text style={[styles.trialText, { color: colors.primary, textAlign: align }]}>{t('trialBanner')}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 100 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {SPORTS.map((sport) => (
          <SportSection key={sport.id} sportId={sport.id} />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  activeUsersPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  activeUsersText: { color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  trialBanner: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  trialText: { fontSize: 12, fontFamily: 'Inter_500Medium', flex: 1 },
  scroll: { paddingTop: 16 },
  section: { marginBottom: 20 },
});

const sStyles = StyleSheet.create({
  sectionHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
    flex: 1,
  },
  genderRow: { marginBottom: 8 },
  genderRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  genderRowCount: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  genderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  genderPillText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  // Clip card
  clipCard: {
    width: 122,
    height: 170,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  clipTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  codeBadge: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  codeBadgeText: { color: '#FFFFFF', fontSize: 11, fontFamily: 'Inter_700Bold' },
  viewsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  viewsBadgeText: { color: '#FFFFFF', fontSize: 10, fontFamily: 'Inter_500Medium' },
  clipOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  clipMeta: { padding: 10, backgroundColor: 'rgba(0,0,0,0.35)' },
  clipDuration: { color: '#FFFFFF', fontSize: 11, fontFamily: 'Inter_400Regular' },
  clipPlayer: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold', marginTop: 2 },
});
