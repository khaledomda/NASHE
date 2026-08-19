import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { getSport, sportName } from '@/constants/sports';
import { apiGetVideo, apiRecordView, apiLikeVideo, apiUnlikeVideo } from '@/lib/api';

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { t, lang, row, align } = useLanguage();
  const queryClient = useQueryClient();
  const hasRecordedView = useRef(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['video', id],
    queryFn: () => apiGetVideo(id!),
    enabled: !!id,
  });

  const video = data?.video;
  const player = useVideoPlayer(video?.storageUrl ?? null, (p) => {
    p.loop = true;
  });

  useEffect(() => {
    if (video && !hasRecordedView.current) {
      hasRecordedView.current = true;
      apiRecordView(video.id).catch(() => {
        // Non-critical — the view just won't be counted this time.
      });
    }
    player.play();
    return () => {
      player.pause();
    };
  }, [video, player]);

  const likeMutation = useMutation({
    mutationFn: () => (data?.likedByMe ? apiUnlikeVideo(id!) : apiLikeVideo(id!)),
    onMutate: async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await queryClient.cancelQueries({ queryKey: ['video', id] });
      const previous = queryClient.getQueryData<typeof data>(['video', id]);
      if (previous) {
        queryClient.setQueryData(['video', id], {
          ...previous,
          likedByMe: !previous.likedByMe,
          video: { ...previous.video, likes: previous.video.likes + (previous.likedByMe ? -1 : 1) },
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['video', id], context.previous);
    },
    onSuccess: (result) => {
      queryClient.setQueryData(['video', id], (prev: typeof data) =>
        prev ? { ...prev, likedByMe: result.liked, video: { ...prev.video, likes: result.likes } } : prev
      );
    },
  });

  const topPad = Platform.OS === 'web' ? 24 : insets.top;

  if (isLoading) {
    return (
      <View style={[styles.root, { backgroundColor: '#000' }]}>
        <Text style={styles.loadingText}>{t('loadingVideos')}</Text>
      </View>
    );
  }

  if (isError || !video) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: 12 }]}>
        <Ionicons name="alert-circle-outline" size={36} color={colors.mutedForeground} />
        <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }}>{t('videoNotFound')}</Text>
        <Pressable onPress={() => router.back()} style={[styles.backChip, { backgroundColor: colors.primary }]}>
          <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold' }}>{t('back')}</Text>
        </Pressable>
      </View>
    );
  }

  const sport = getSport(video.sport as never);
  const liked = data?.likedByMe ?? false;

  return (
    <View style={styles.root}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: topPad + 8, flexDirection: row }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconChip}>
          <Ionicons name={row === 'row-reverse' ? 'chevron-forward' : 'chevron-back'} size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.codeChip}>
          <Text style={styles.codeChipText}>{video.code}</Text>
        </View>
      </View>

      {/* Bottom info + like bar */}
      <View style={[styles.bottomBar, { flexDirection: row }]}>
        <View style={styles.infoCol}>
           {data?.athleteName ? (
             <>
               <Text style={[styles.athleteName, { textAlign: align }]}>{data.athleteName}</Text>
               <Text style={[styles.metaLine, { textAlign: align }]}>
                 {sportName(sport, lang)} · {data.athleteRegion}
               </Text>
             </>
           ) : (
             <Text style={[styles.athleteName, { textAlign: align }]}>{video.code}</Text>
           )}
          <View style={[styles.viewsRow, { flexDirection: row }]}>
            <Ionicons name="eye-outline" size={14} color="rgba(255,255,255,0.85)" />
            <Text style={styles.viewsText}>
              {video.views} {t('views')}
            </Text>
          </View>
        </View>

        {/* Like bar — like only, no dislike or comments by design */}
        <View style={styles.likeBar}>
          <Pressable
            onPress={() => likeMutation.mutate()}
            disabled={likeMutation.isPending}
            style={({ pressed }) => [
              styles.likeBtn,
              { backgroundColor: liked ? colors.like : 'rgba(255,255,255,0.16)', opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={26} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.likeCount}>{video.likes}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  loadingText: { color: '#FFFFFF', textAlign: 'center', marginTop: 200, fontFamily: 'Inter_500Medium' },
  backChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeChip: { backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  codeChipText: { color: '#FFFFFF', fontSize: 13, fontFamily: 'Inter_700Bold' },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 32,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  infoCol: { flex: 1, gap: 4, paddingEnd: 16 },
  athleteName: { color: '#FFFFFF', fontSize: 19, fontFamily: 'Inter_700Bold' },
  metaLine: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Inter_500Medium' },
  viewsRow: { alignItems: 'center', gap: 5, marginTop: 4 },
  viewsText: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontFamily: 'Inter_400Regular' },
  likeBar: { alignItems: 'center', gap: 6 },
  likeBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeCount: { color: '#FFFFFF', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
});
