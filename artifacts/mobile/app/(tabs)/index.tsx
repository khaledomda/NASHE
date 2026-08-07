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

// ─── Mock data ───────────────────────────────────────────────────────────────

const FEATURED_ATHLETE = {
  id: '1',
  name: 'سارة العتيبي',
  sport: 'سباحة',
  region: 'الرياض',
  age: 16,
  gender: 'أنثى',
  avatarColor: '#2ECC71',
};

const ATHLETES = [
  { id: '1', name: 'سارة العتيبي', sport: 'سباحة', avatarColor: '#2ECC71' },
  { id: '2', name: 'فيصل الجريني', sport: 'كرة القدم', avatarColor: '#45B7D1' },
  { id: '3', name: 'نورة الشمري', sport: 'ألعاب قوى', avatarColor: '#FF6B6B' },
  { id: '4', name: 'خالد المطيري', sport: 'كرة السلة', avatarColor: '#F59E0B' },
  { id: '5', name: 'ريم الزهراني', sport: 'تنس', avatarColor: '#9B59B6' },
];

const CLIPS = [
  { id: '1', athleteName: 'سارة العتيبي', sport: 'سباحة', duration: '90 ث', date: '1 أغسطس', color: '#1B5E3B' },
  { id: '2', athleteName: 'فيصل الجريني', sport: 'كرة القدم', duration: '45 ث', date: '28 يوليو', color: '#145232' },
  { id: '3', athleteName: 'نورة الشمري', sport: 'ألعاب قوى', duration: '120 ث', date: '25 يوليو', color: '#0D3D25' },
  { id: '4', athleteName: 'خالد المطيري', sport: 'كرة السلة', duration: '60 ث', date: '20 يوليو', color: '#1B5E3B' },
];

const NEWS = [
  { id: '1', text: 'تم تحديث نظام رفع الفيديوهات لتسريع الأداء' },
  { id: '2', text: 'أضف موهبتك الجديدة الآن قبل نهاية فترة التسجيل' },
  { id: '3', text: 'انطلاق موسم اكتشاف المواهب الشبابية في جميع الرياضات' },
];

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={[sStyles.sectionHeader, { flexDirection: 'row-reverse' }]}>
      {icon}
      <Text style={[sStyles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
    </View>
  );
}

function FeaturedAthleteCard() {
  const colors = useColors();
  const initials = FEATURED_ATHLETE.name.split(' ').map((w) => w[0]).join('');
  return (
    <View style={[sStyles.featuredCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[sStyles.featuredAvatar, { backgroundColor: FEATURED_ATHLETE.avatarColor }]}>
        <Text style={sStyles.featuredInitials}>{initials}</Text>
      </View>
      <View style={sStyles.featuredInfo}>
        <Text style={[sStyles.featuredName, { color: colors.foreground }]} numberOfLines={1}>
          {FEATURED_ATHLETE.name}
        </Text>
        <Text style={[sStyles.featuredSub, { color: colors.mutedForeground }]}>
          {FEATURED_ATHLETE.sport} · {FEATURED_ATHLETE.region} · {FEATURED_ATHLETE.gender}
        </Text>
      </View>
      <Ionicons name="star" size={22} color={colors.accent} />
    </View>
  );
}

function ClipCard({ item }: { item: typeof CLIPS[0] }) {
  return (
    <Pressable
      style={({ pressed }) => [
        sStyles.clipCard,
        { backgroundColor: item.color, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={sStyles.clipOverlay}>
        <Ionicons name="play-circle" size={36} color="rgba(255,255,255,0.9)" />
      </View>
      <View style={sStyles.clipMeta}>
        <Text style={sStyles.clipDuration}>{item.duration} · {item.sport}</Text>
        <Text style={sStyles.clipPlayer} numberOfLines={1}>
          {item.athleteName}
        </Text>
      </View>
    </Pressable>
  );
}

function AthleteCircle({ item }: { item: typeof ATHLETES[0] }) {
  const colors = useColors();
  const initials = item.name.split(' ').map((w) => w[0]).join('');
  return (
    <View style={sStyles.playerCircleContainer}>
      <View style={[sStyles.playerCircle, { backgroundColor: item.avatarColor }]}>
        <Text style={sStyles.playerCircleInitials}>{initials}</Text>
      </View>
      <Text style={[sStyles.playerCircleName, { color: colors.mutedForeground }]} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={[sStyles.playerCircleSport, { color: colors.mutedForeground }]} numberOfLines={1}>
        {item.sport}
      </Text>
    </View>
  );
}

function NewsItem({ item }: { item: typeof NEWS[0] }) {
  const colors = useColors();
  return (
    <View style={[sStyles.newsItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[sStyles.newsText, { color: colors.foreground }]}>{item.text}</Text>
      <Ionicons name="notifications-outline" size={16} color={colors.primary} style={sStyles.newsIcon} />
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
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
      <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: topPad + 12 }]}>
        <Pressable onPress={() => router.push('/(tabs)/settings')} hitSlop={12}>
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>الرئيسية</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 100 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Featured Athlete */}
        <View style={styles.section}>
          <SectionHeader
            title="الموهبة المميزة"
            icon={<Ionicons name="star" size={18} color={colors.accent} style={{ marginRight: 6 }} />}
          />
          <FeaturedAthleteCard />
        </View>

        {/* Latest Clips */}
        <View style={styles.section}>
          <SectionHeader
            title="أحدث المقاطع"
            icon={<Ionicons name="videocam-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />}
          />
          <FlatList
            data={CLIPS}
            horizontal
            inverted
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ClipCard item={item} />}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            scrollEnabled={CLIPS.length > 0}
          />
        </View>

        {/* New Athletes */}
        <View style={styles.section}>
          <SectionHeader
            title="مواهب جديدة"
            icon={
              <MaterialCommunityIcons
                name="account-star-outline"
                size={18}
                color={colors.primary}
                style={{ marginRight: 6 }}
              />
            }
          />
          <FlatList
            data={ATHLETES}
            horizontal
            inverted
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AthleteCircle item={item} />}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
            scrollEnabled={ATHLETES.length > 0}
          />
        </View>

        {/* Latest News */}
        <View style={styles.section}>
          <SectionHeader
            title="أخر الأخبار"
            icon={
              <Ionicons
                name="newspaper-outline"
                size={18}
                color={colors.primary}
                style={{ marginRight: 6 }}
              />
            }
          />
          <View style={styles.newsList}>
            {NEWS.map((item) => (
              <NewsItem key={item.id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  scroll: { paddingTop: 16 },
  section: { marginBottom: 24 },
  newsList: { paddingHorizontal: 16, gap: 10 },
});

const sStyles = StyleSheet.create({
  sectionHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
    flex: 1,
    textAlign: 'right',
  },
  // Featured athlete
  featuredCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  featuredAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredInitials: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  featuredInfo: { flex: 1, alignItems: 'flex-end' },
  featuredName: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'right',
  },
  featuredSub: {
    fontSize: 13,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
  },
  // Clip card
  clipCard: {
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  clipOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clipMeta: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  clipDuration: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
  },
  clipPlayer: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'right',
    marginTop: 2,
  },
  // Athlete circle
  playerCircleContainer: {
    alignItems: 'center',
    width: 72,
  },
  playerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  playerCircleInitials: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  playerCircleName: {
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    lineHeight: 14,
  },
  playerCircleSport: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    opacity: 0.7,
    marginTop: 2,
  },
  // News
  newsItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  newsText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
    lineHeight: 20,
  },
  newsIcon: { flexShrink: 0 },
});
