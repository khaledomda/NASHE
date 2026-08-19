import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { BrandWordmark } from '@/components/BrandWordmark';
import { SPORTS, sportName, type Sport, type SportId } from '@/constants/sports';
import { ACTIVE_USERS_NOW } from '@/constants/videos';
import { apiListVideos, type FeedVideo } from '@/lib/api';

type Gender = 'male' | 'female';

function SportIcon({ sport, size = 18, color }: { sport: Sport; size?: number; color: string }) {
  const IconComp = sport.iconSet === 'ion' ? Ionicons : MaterialCommunityIcons;
  return <IconComp name={sport.icon as never} size={size} color={color} />;
}

function SectionTitle({ title, icon }: { title: string; icon: keyof typeof Ionicons.glyphMap }) {
  const colors = useColors();
  const { align, row } = useLanguage();
  return (
    <View style={[styles.sectionTitleRow, { flexDirection: row }]}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign: align }]}>{title}</Text>
    </View>
  );
}

function GenderTabs({ selected, onChange }: { selected: Gender; onChange: (gender: Gender) => void }) {
  const colors = useColors();
  const { t, row } = useLanguage();
  return (
    <View style={[styles.genderTabs, { flexDirection: row, backgroundColor: colors.card, borderColor: colors.border }]}>
      {(['male', 'female'] as Gender[]).map((gender) => {
        const isSelected = selected === gender;
        const isMale = gender === 'male';
        return (
          <Pressable
            key={gender}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(gender)}
            style={[
              styles.genderTab,
              { backgroundColor: isSelected ? (isMale ? colors.male : colors.female) : 'transparent' },
            ]}
          >
            <Ionicons
              name={isMale ? 'male' : 'female'}
              size={18}
              color={isSelected ? '#FFFFFF' : isMale ? colors.male : colors.female}
            />
            <Text style={[styles.genderTabText, { color: isSelected ? '#FFFFFF' : colors.foreground }]}>
              {gender === 'male' ? t('male') : t('female')}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ClipCard({ item }: { item: FeedVideo }) {
  const colors = useColors();
  const { t } = useLanguage();
  const router = useRouter();
  const sport = SPORTS.find((entry) => entry.id === item.sport);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${sport?.nameEn ?? item.sport} ${item.code}`}
      style={({ pressed }) => [styles.clipCard, { opacity: pressed ? 0.88 : 1 }]}
      onPress={() => router.push(`/video/${item.id}`)}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.82)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.clipTopRow}>
        <View style={styles.codeBadge}>
          <Text style={styles.codeBadgeText}>{sport?.code ?? item.code.charAt(0)}</Text>
          <Text style={styles.codeNumberText}>{item.code.replace(/^[A-Za-z]/, '')}</Text>
        </View>
        <View style={styles.viewsBadge}>
          <Ionicons name="eye-outline" size={11} color="#FFFFFF" />
          <Text style={styles.viewsBadgeText}>{item.views}</Text>
        </View>
      </View>
      <View style={styles.clipOverlay}>
        <Ionicons name="play-circle" size={36} color="rgba(255,255,255,0.94)" />
      </View>
      <View style={styles.clipMeta}>
        <View style={styles.clipStatsRow}>
          <Ionicons name="heart" size={11} color="#FF7A8A" />
          <Text style={styles.clipStatsText}>{item.likes}</Text>
          <Text style={styles.clipDuration}>
            · {item.durationSec}
            {t('seconds')}
          </Text>
        </View>
        <Text style={styles.clipCodeLabel}>{item.code}</Text>
      </View>
    </Pressable>
  );
}

function ClipShelf({ title, icon, videos }: { title: string; icon: keyof typeof Ionicons.glyphMap; videos: FeedVideo[] }) {
  if (videos.length === 0) return null;
  return (
    <View style={styles.shelf}>
      <SectionTitle title={title} icon={icon} />
      <FlatList
        data={videos}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ClipCard item={item} />}
        contentContainerStyle={styles.shelfList}
      />
    </View>
  );
}

function SportBrowser({
  gender,
  videos,
  selectedSport,
  onSelect,
}: {
  gender: Gender;
  videos: FeedVideo[];
  selectedSport: SportId | null;
  onSelect: (sport: SportId) => void;
}) {
  const colors = useColors();
  const { lang, align, row, t } = useLanguage();
  const genderVideos = videos.filter((video) => video.gender === gender);

  return (
    <View style={styles.browser}>
      <SectionTitle title={t('browseSports')} icon="grid-outline" />
      <View style={styles.sportList}>
        {SPORTS.map((sport) => {
          const count = genderVideos.filter((video) => video.sport === sport.id).length;
          const isSelected = selectedSport === sport.id;
          return (
            <Pressable
              key={sport.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled: count === 0 }}
              onPress={() => count > 0 && onSelect(sport.id)}
              style={({ pressed }) => [
                styles.sportRow,
                {
                  flexDirection: row,
                  backgroundColor: isSelected ? colors.primaryLight : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                  opacity: pressed ? 0.8 : count === 0 ? 0.52 : 1,
                },
              ]}
            >
              <View style={[styles.sportLetter, { backgroundColor: isSelected ? colors.primary : colors.secondary }]}>
                <Text style={[styles.sportLetterText, { color: isSelected ? '#FFFFFF' : colors.primary }]}>
                  {sport.code}
                </Text>
              </View>
              <View style={styles.sportInfo}>
                <Text style={[styles.sportName, { color: colors.foreground, textAlign: align }]}>
                  {sportName(sport, lang)}
                </Text>
                <Text style={[styles.sportCount, { color: colors.mutedForeground, textAlign: align }]}>
                  {count} {t('videosCount')}
                </Text>
              </View>
              <SportIcon sport={sport} size={19} color={isSelected ? colors.primary : colors.mutedForeground} />
              <Ionicons
                name={row === 'row-reverse' ? 'chevron-back' : 'chevron-forward'}
                size={16}
                color={colors.mutedForeground}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, row, align, lang } = useLanguage();
  const { logout } = useAuth();
  const [gender, setGender] = useState<Gender>('male');
  const [selectedSport, setSelectedSport] = useState<SportId | null>(null);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 + 50 : 0;

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['videos'],
    queryFn: () => apiListVideos(),
  });
  const videos = useMemo(() => data?.videos ?? [], [data]);
  const genderVideos = useMemo(() => videos.filter((video) => video.gender === gender), [videos, gender]);
  const selectedVideos = useMemo(
    () => genderVideos.filter((video) => video.sport === selectedSport),
    [genderVideos, selectedSport],
  );
  const popularVideos = useMemo(
    () => [...genderVideos].sort((a, b) => b.views - a.views).slice(0, 8),
    [genderVideos],
  );
  const likedVideos = useMemo(
    () => [...genderVideos].sort((a, b) => b.likes - a.likes).slice(0, 8),
    [genderVideos],
  );

  const handleGenderChange = (nextGender: Gender) => {
    setGender(nextGender);
    setSelectedSport(null);
  };

  const handleLogout = () => {
    Alert.alert(t('logout'), t('logoutConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('logout'),
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            flexDirection: row,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={[styles.headerActions, { flexDirection: row }]}>
          <Pressable onPress={() => router.push('/(tabs)/settings')} hitSlop={12} accessibilityLabel={t('settingsTitle')}>
            <Ionicons name="settings-outline" size={22} color={colors.primary} />
          </Pressable>
          <Pressable onPress={handleLogout} hitSlop={12} accessibilityLabel={t('logout')}>
            <Ionicons name="log-out-outline" size={22} color={colors.destructive} />
          </Pressable>
        </View>
        <BrandWordmark size={22} />
        <View style={[styles.activeUsersPill, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="people" size={13} color={colors.primary} />
          <Text style={[styles.activeUsersText, { color: colors.primary }]}>{ACTIVE_USERS_NOW}</Text>
        </View>
      </View>

      <View style={[styles.trialBanner, { backgroundColor: colors.secondary, flexDirection: row }]}>
        <Ionicons name="time-outline" size={14} color={colors.primary} />
        <Text style={[styles.trialText, { color: colors.secondaryForeground }]}>{t('trialBanner')}</Text>
      </View>
      <View style={[styles.ownershipBar, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
        <Ionicons name="shield-checkmark-outline" size={15} color={colors.primary} />
        <Text style={[styles.ownershipBarText, { color: colors.mutedForeground, textAlign: align }]}>
          {lang === 'ar'
            ? 'فكرة وتطبيق ناشئ مملوكان للدكتور خالد عبد الكريم العمدة'
            : 'NASHE is owned by Dr. Khalid Abdelkarim Al-Omda'}
        </Text>
      </View>

      {isError ? (
        <View style={styles.centerState}>
          <Ionicons name="cloud-offline-outline" size={32} color={colors.mutedForeground} />
          <Text style={[styles.centerStateText, { color: colors.mutedForeground }]}>{t('loadVideosError')}</Text>
        </View>
      ) : isLoading ? (
        <View style={styles.centerState}>
          <Text style={[styles.centerStateText, { color: colors.mutedForeground }]}>{t('loadingVideos')}</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 100 }]}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        >
          <View style={styles.intro}>
            <Text style={[styles.pageTitle, { color: colors.foreground, textAlign: align }]}>{t('discoverTitle')}</Text>
            <Text style={[styles.pageSubtitle, { color: colors.mutedForeground, textAlign: align }]}>
              {t('discoverSubtitle')}
            </Text>
          </View>

          <GenderTabs selected={gender} onChange={handleGenderChange} />

          {selectedSport ? (
            <View style={styles.selectedSportView}>
              <Pressable
                onPress={() => setSelectedSport(null)}
                style={[styles.backToSports, { flexDirection: row }]}
                accessibilityRole="button"
              >
                <Ionicons
                  name={row === 'row-reverse' ? 'arrow-forward' : 'arrow-back'}
                  size={17}
                  color={colors.primary}
                />
                <Text style={[styles.backToSportsText, { color: colors.primary }]}>{t('allSports')}</Text>
              </Pressable>
              <SectionTitle
                title={`${sportName(SPORTS.find((sport) => sport.id === selectedSport)!, lang)} · ${
                  selectedVideos.length
                } ${t('videosCount')}`}
                icon="play-circle-outline"
              />
              {selectedVideos.length > 0 ? (
                <View style={styles.selectedGrid}>
                  {selectedVideos.map((video) => (
                    <ClipCard key={video.id} item={video} />
                  ))}
                </View>
              ) : (
                <View style={[styles.emptySport, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="videocam-outline" size={28} color={colors.mutedForeground} />
                  <Text style={[styles.emptySportText, { color: colors.mutedForeground }]}>{t('noVideos')}</Text>
                </View>
              )}
            </View>
          ) : (
            <>
              <ClipShelf title={t('mostPopular')} icon="flame-outline" videos={popularVideos} />
              <ClipShelf title={t('mostLiked')} icon="heart-outline" videos={likedVideos} />
              <SportBrowser gender={gender} videos={videos} selectedSport={selectedSport} onSelect={setSelectedSport} />
              {genderVideos.length === 0 && (
                <View style={styles.centerState}>
                  <Ionicons name="videocam-outline" size={32} color={colors.mutedForeground} />
                  <Text style={[styles.centerStateText, { color: colors.mutedForeground }]}>{t('noVideos')}</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerActions: { alignItems: 'center', gap: 14 },
  activeUsersPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 },
  activeUsersText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  trialBanner: { alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 8 },
  trialText: { fontSize: 12, fontFamily: 'Inter_500Medium', flex: 1 },
  ownershipBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  ownershipBarText: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  scroll: { paddingTop: 18 },
  intro: { paddingHorizontal: 16, marginBottom: 14 },
  pageTitle: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  pageSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 4 },
  genderTabs: { marginHorizontal: 16, borderWidth: 1, borderRadius: 16, padding: 4, gap: 4 },
  genderTab: { flex: 1, minHeight: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7 },
  genderTabText: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  sectionTitleRow: { alignItems: 'center', gap: 7, paddingHorizontal: 16, marginBottom: 10 },
  sectionTitle: { flex: 1, fontSize: 16, fontFamily: 'Inter_700Bold' },
  shelf: { marginTop: 22 },
  shelfList: { paddingHorizontal: 16, gap: 12 },
  browser: { marginTop: 24, marginBottom: 20 },
  sportList: { paddingHorizontal: 16, gap: 9 },
  sportRow: { minHeight: 62, alignItems: 'center', paddingHorizontal: 12, borderRadius: 15, borderWidth: 1, gap: 10 },
  sportLetter: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  sportLetterText: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  sportInfo: { flex: 1 },
  sportName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  sportCount: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  selectedSportView: { marginTop: 20 },
  backToSports: { alignItems: 'center', gap: 7, marginHorizontal: 16, marginBottom: 18 },
  backToSportsText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  selectedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 16 },
  emptySport: { marginHorizontal: 16, borderRadius: 15, borderWidth: 1, minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptySportText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 32, minHeight: 180 },
  centerStateText: { fontSize: 13, fontFamily: 'Inter_500Medium', textAlign: 'center' },
  clipCard: { width: 128, height: 176, borderRadius: 16, overflow: 'hidden', justifyContent: 'space-between', backgroundColor: '#0B1615', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  clipTopRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 8 },
  codeBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: 'rgba(0,0,0,0.38)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 },
  codeBadgeText: { color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter_700Bold' },
  codeNumberText: { color: 'rgba(255,255,255,0.9)', fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  viewsBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(0,0,0,0.38)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 },
  viewsBadgeText: { color: '#FFFFFF', fontSize: 10, fontFamily: 'Inter_500Medium' },
  clipOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  clipMeta: { padding: 10 },
  clipStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  clipStatsText: { color: '#FFFFFF', fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  clipDuration: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontFamily: 'Inter_400Regular' },
  clipCodeLabel: { color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter_700Bold', marginTop: 3 },
});