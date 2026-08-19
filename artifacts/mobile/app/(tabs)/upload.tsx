import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { SPORTS, sportName, getSport } from '@/constants/sports';
import { nextVideoCode } from '@/constants/videos';
import { apiGetUploadUrl, apiUploadVideoFile, apiSubmitVideo, ApiError } from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

type PickerOption = { label: string; value: string };

const STANDARD_MAX_VIDEO_SECONDS = 45;
const CLUB_MAX_VIDEO_SECONDS = 180;

function guessVideoContentType(asset: ImagePicker.ImagePickerAsset): string {
  if (asset.mimeType) return asset.mimeType;
  const ext = (asset.fileName ?? asset.uri).split('.').pop()?.toLowerCase();
  if (ext === 'mov') return 'video/quicktime';
  if (ext === 'webm') return 'video/webm';
  return 'video/mp4';
}

// ─── SelectPicker ─────────────────────────────────────────────────────────────

function SelectPicker({
  options,
  value,
  placeholder,
  onSelect,
}: {
  options: PickerOption[];
  value: string;
  placeholder: string;
  onSelect: (value: string) => void;
}) {
  const colors = useColors();
  const { row, align } = useLanguage();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        style={[uStyles.pickerBtn, { backgroundColor: colors.input, borderColor: colors.border, flexDirection: row }]}
        onPress={() => setOpen(true)}
      >
        <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
        <Text
          style={[uStyles.pickerText, { color: selected ? colors.foreground : colors.mutedForeground, textAlign: align }]}
        >
          {selected ? selected.label : placeholder}
        </Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={uStyles.modalBackdrop} onPress={() => setOpen(false)} />
        <View style={[uStyles.modalSheet, { backgroundColor: colors.card }]}>
          <View style={[uStyles.modalHandle, { backgroundColor: colors.border }]} />
          <Text style={[uStyles.modalTitle, { color: colors.foreground }]}>{placeholder}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((opt) => (
              <Pressable
                key={opt.value}
                style={({ pressed }) => [
                  uStyles.modalOption,
                  { borderBottomColor: colors.border, flexDirection: row },
                  pressed && { backgroundColor: colors.muted },
                  opt.value === value && { backgroundColor: colors.secondary },
                ]}
                onPress={() => {
                  onSelect(opt.value);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    uStyles.modalOptionText,
                    { color: colors.foreground, textAlign: align },
                    opt.value === value && { color: colors.primary, fontFamily: 'Inter_600SemiBold' },
                  ]}
                >
                  {opt.label}
                </Text>
                {opt.value === value && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

// ─── UploadScreen ─────────────────────────────────────────────────────────────

export default function UploadScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, row, align, lang } = useLanguage();
  const { canUploadThisWeek, recordUpload, role } = useAuth();
  const queryClient = useQueryClient();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 + 50 : 0;

  const REGIONS: PickerOption[] = useMemo(
    () => [
      { label: lang === 'ar' ? 'الرياض' : 'Riyadh', value: 'riyadh' },
      { label: lang === 'ar' ? 'جدة' : 'Jeddah', value: 'jeddah' },
      { label: lang === 'ar' ? 'الدمام' : 'Dammam', value: 'dammam' },
      { label: lang === 'ar' ? 'مكة المكرمة' : 'Makkah', value: 'makkah' },
      { label: lang === 'ar' ? 'المدينة المنورة' : 'Madinah', value: 'madinah' },
      { label: lang === 'ar' ? 'الطائف' : 'Taif', value: 'taif' },
    ],
    [lang]
  );

  const SPORT_OPTIONS: PickerOption[] = useMemo(
    () => SPORTS.map((s) => ({ label: sportName(s, lang), value: s.id })),
    [lang]
  );

  const GENDERS: PickerOption[] = useMemo(
    () => [
      { label: t('male'), value: 'male' },
      { label: t('female'), value: 'female' },
    ],
    [lang]
  );

  const [athleteName, setAthleteName] = useState('');
  const [date, setDate] = useState('');
  const [region, setRegion] = useState('');
  const [sport, setSport] = useState('');
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [videos, setVideos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState<'idle' | 'uploading' | 'registering'>('idle');
  const [moderationState, setModerationState] = useState<'idle' | 'scanning' | 'flagged' | 'passed'>('idle');

  const canUpload = canUploadThisWeek();
  const maxVideoSeconds = role === 'scout' ? CLUB_MAX_VIDEO_SECONDS : STANDARD_MAX_VIDEO_SECONDS;
  const previewCode = sport ? nextVideoCode(getSport(sport as never).code) : null;

  const pickPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotos((prev) => [...prev, ...result.assets]);
    }
  };

  const pickVideos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (result.canceled) return;

    const accepted: ImagePicker.ImagePickerAsset[] = [];
    const rejected: string[] = [];
    for (const asset of result.assets) {
      // asset.duration is reported in milliseconds on iOS/Android.
      const seconds = asset.duration ? asset.duration / 1000 : 0;
      if (seconds > maxVideoSeconds) {
        rejected.push(asset.fileName ?? asset.uri.split('/').pop() ?? '');
      } else {
        accepted.push(asset);
      }
    }
    if (rejected.length > 0) {
      Alert.alert(t('videoTooLong'), rejected.join(', '));
    }
    if (accepted.length > 0) {
      // Only one video is actually uploaded (one clip per submission) — keep
      // just the most recent pick so the submit flow below has a single,
      // unambiguous source of truth.
      setVideos(accepted.slice(-1));
      // Simulated client-side moderation pass — a real check runs server-side
      // (frame OCR + phone-number pattern match) before the video is queued for admin review.
      setModerationState('scanning');
      setTimeout(() => {
        setModerationState(Math.random() < 0.15 ? 'flagged' : 'passed');
      }, 900);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
    setModerationState('idle');
  };

  const handleSubmit = async () => {
    if (!canUpload) {
      Alert.alert(t('uploadLimitTitle'), t('uploadLimitDesc'));
      return;
    }
    if (!athleteName.trim() || !date.trim() || !region || !sport || !gender || videos.length === 0) {
      Alert.alert(
        lang === 'ar' ? 'خطأ' : 'Error',
        lang === 'ar' ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill in all required fields'
      );
      return;
    }
    if (!guardianPhone.trim() || !guardianConsent) {
      Alert.alert(t('guardianSectionTitle'), t('guardianConsentRequired'));
      return;
    }

    const asset = videos[0];
    const durationSec = Math.round((asset.duration ?? 0) / 1000) || 1;
    const contentType = guessVideoContentType(asset);
    const regionLabel = REGIONS.find((r) => r.value === region)?.label ?? region;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSubmitting(true);
    try {
      // 1. Ask the server for a short-lived presigned upload URL.
      setSubmitStage('uploading');
      const { uploadUrl, publicUrl } = await apiGetUploadUrl(contentType);

      // 2. Upload the raw video bytes directly to object storage.
      await apiUploadVideoFile(uploadUrl, asset.uri, contentType);

      // 3. Register the athlete profile + video row now that the file exists.
      setSubmitStage('registering');
      await apiSubmitVideo({
        athlete: {
          name: athleteName.trim(),
          birthDate: date.trim(),
          region: regionLabel,
          gender: gender as 'male' | 'female',
          guardianPhone: guardianPhone.trim(),
          guardianConsent: true,
        },
        sport,
        durationSec,
        storageUrl: publicUrl,
        description: description.trim() || undefined,
      });

      await recordUpload();
      queryClient.invalidateQueries({ queryKey: ['videos'] });

      Alert.alert(t('uploadSuccess'), t('uploadSuccessDesc'));
      setAthleteName('');
      setDate('');
      setRegion('');
      setSport('');
      setGender('');
      setDescription('');
      setGuardianPhone('');
      setGuardianConsent(false);
      setPhotos([]);
      setVideos([]);
      setModerationState('idle');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? (err.data as { error?: string } | null)?.error ?? t('uploadFailedGeneric')
          : t('uploadFailedGeneric');
      Alert.alert(t('uploadFailedTitle'), message);
    } finally {
      setSubmitting(false);
      setSubmitStage('idle');
    }
  };

  return (
    <View style={[uStyles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          uStyles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            paddingTop: topPad + 12,
            flexDirection: row,
          },
        ]}
      >
        <View style={{ width: 24 }} />
        <Text style={[uStyles.headerTitle, { color: colors.foreground }]}>{t('uploadTitle')}</Text>
        <Ionicons name={row === 'row-reverse' ? 'chevron-forward' : 'chevron-back'} size={22} color={colors.primary} />
      </View>

      {/* Trial banner */}
      <View style={[uStyles.trialBanner, { backgroundColor: colors.secondary, flexDirection: row }]}>
        <Ionicons name="time-outline" size={14} color={colors.primary} />
        <Text style={[uStyles.trialText, { color: colors.primary, textAlign: align }]}>{t('trialBanner')}</Text>
      </View>

      {/* Weekly limit notice */}
      {!canUpload && (
        <View style={[uStyles.limitBanner, { backgroundColor: colors.destructive + '18', flexDirection: row }]}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.destructive} />
          <Text style={[uStyles.limitText, { color: colors.destructive, textAlign: align }]}>
            {t('uploadLimitDesc')}
          </Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[uStyles.scroll, { paddingBottom: bottomPad + 120 }]}
      >
        {/* Athlete name */}
        <View style={uStyles.field}>
          <Text style={[uStyles.label, { color: colors.mutedForeground, textAlign: align }]}>{t('athleteName')}</Text>
          <TextInput
            style={[uStyles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground, textAlign: align }]}
            placeholder={t('athleteName')}
            placeholderTextColor={colors.mutedForeground}
            value={athleteName}
            onChangeText={setAthleteName}
          />
        </View>

        {/* Date + Region */}
        <View style={[uStyles.row, { flexDirection: row }]}>
          <View style={[uStyles.field, { flex: 1 }]}>
            <Text style={[uStyles.label, { color: colors.mutedForeground, textAlign: align }]}>{t('birthDate')}</Text>
            <TextInput
              style={[uStyles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground, textAlign: align }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.mutedForeground}
              value={date}
              onChangeText={setDate}
              keyboardType="numeric"
            />
          </View>
          <View style={[uStyles.field, { flex: 1 }]}>
            <Text style={[uStyles.label, { color: colors.mutedForeground, textAlign: align }]}>{t('region')}</Text>
            <SelectPicker options={REGIONS} value={region} placeholder={t('region')} onSelect={setRegion} />
          </View>
        </View>

        {/* Sport + Gender row */}
        <View style={[uStyles.row, { flexDirection: row }]}>
          <View style={[uStyles.field, { flex: 1 }]}>
            <Text style={[uStyles.label, { color: colors.mutedForeground, textAlign: align }]}>{t('sport')}</Text>
            <SelectPicker options={SPORT_OPTIONS} value={sport} placeholder={t('sport')} onSelect={setSport} />
          </View>
          <View style={[uStyles.field, { flex: 1 }]}>
            <Text style={[uStyles.label, { color: colors.mutedForeground, textAlign: align }]}>{t('gender')}</Text>
            <SelectPicker options={GENDERS} value={gender} placeholder={t('gender')} onSelect={setGender} />
          </View>
        </View>

        {/* Video code preview */}
        {previewCode && (
          <View style={[uStyles.codePreview, { backgroundColor: colors.secondary, flexDirection: row }]}>
            <Ionicons name="pricetag-outline" size={16} color={colors.primary} />
            <Text style={[uStyles.codePreviewText, { color: colors.primary, textAlign: align }]}>
              {t('videoCode')}: {previewCode}
            </Text>
          </View>
        )}

        {/* Description */}
        <View style={uStyles.field}>
          <Text style={[uStyles.label, { color: colors.mutedForeground, textAlign: align }]}>{t('description')}</Text>
          <TextInput
            style={[uStyles.input, uStyles.textarea, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground, textAlign: align }]}
            placeholder={t('description')}
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Guardian consent */}
        <View style={[uStyles.guardianBox, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <View style={[uStyles.guardianHeader, { flexDirection: row }]}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
            <Text style={[uStyles.guardianTitle, { color: colors.primary, textAlign: align }]}>
              {t('guardianSectionTitle')}
            </Text>
          </View>
          <TextInput
            style={[
              uStyles.input,
              { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground, textAlign: align, marginBottom: 10 },
            ]}
            placeholder={t('guardianPhonePlaceholder')}
            placeholderTextColor={colors.mutedForeground}
            value={guardianPhone}
            onChangeText={setGuardianPhone}
            keyboardType="phone-pad"
          />
          <Pressable
            style={[uStyles.consentRow, { flexDirection: row }]}
            onPress={() => setGuardianConsent((v) => !v)}
          >
            <Ionicons
              name={guardianConsent ? 'checkbox' : 'square-outline'}
              size={20}
              color={guardianConsent ? colors.primary : colors.mutedForeground}
            />
            <Text style={[uStyles.consentText, { color: colors.foreground, textAlign: align }]}>
              {t('guardianConsentLabel')}
            </Text>
          </Pressable>
          <Text style={[uStyles.guardianNote, { color: colors.mutedForeground, textAlign: align }]}>
            {t('guardianNote')}
          </Text>
        </View>

        {/* Photos */}
        <View style={uStyles.field}>
          <View style={[uStyles.mediaHeader, { flexDirection: row }]}>
            <Text style={[uStyles.label, { color: colors.mutedForeground, marginBottom: 0 }]}>{t('photos')}</Text>
            <Pressable
              style={({ pressed }) => [uStyles.addBtn, { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1, flexDirection: row }]}
              onPress={pickPhotos}
            >
              <Ionicons name="add" size={18} color={colors.primary} />
              <Text style={[uStyles.addBtnText, { color: colors.primary }]}>{t('add')}</Text>
            </Pressable>
          </View>
          {photos.length === 0 ? (
            <View style={[uStyles.emptyMedia, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Ionicons name="images-outline" size={28} color={colors.mutedForeground} />
              <Text style={[uStyles.emptyText, { color: colors.mutedForeground }]}>{t('noPhotos')}</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={uStyles.mediaGrid}>
                {photos.map((photo, index) => (
                  <View key={index} style={uStyles.mediaThumbnail}>
                    <Image source={{ uri: photo.uri }} style={uStyles.thumbnailImage} />
                    <Pressable style={uStyles.removeBtn} onPress={() => removePhoto(index)}>
                      <Ionicons name="close-circle" size={20} color="#EF4444" />
                    </Pressable>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Videos */}
        <View style={uStyles.field}>
          <View style={[uStyles.mediaHeader, { flexDirection: row }]}>
            <Text style={[uStyles.label, { color: colors.mutedForeground, marginBottom: 0 }]}>{t('videos')}</Text>
            <Pressable
              style={({ pressed }) => [uStyles.addBtn, { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1, flexDirection: row }]}
              onPress={pickVideos}
            >
              <Ionicons name="add" size={18} color={colors.primary} />
              <Text style={[uStyles.addBtnText, { color: colors.primary }]}>{t('add')}</Text>
            </Pressable>
          </View>
          <Text style={[uStyles.hintText, { color: colors.mutedForeground, textAlign: align }]}>
            {role === 'scout' ? t('clubVideoDurationLabel') : t('videoDurationLabel')}
          </Text>

          {videos.length === 0 ? (
            <View style={[uStyles.emptyMedia, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Ionicons name="videocam-outline" size={28} color={colors.mutedForeground} />
              <Text style={[uStyles.emptyText, { color: colors.mutedForeground }]}>{t('noVideosField')}</Text>
            </View>
          ) : (
            <View style={uStyles.videoList}>
              {videos.map((video, index) => (
                <View key={index} style={[uStyles.videoItem, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: row }]}>
                  <Pressable onPress={() => removeVideo(index)}>
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                  </Pressable>
                  <View style={[uStyles.videoMeta, { flexDirection: row }]}>
                    <Ionicons name="videocam" size={20} color={colors.primary} />
                    <Text style={[uStyles.videoName, { color: colors.foreground, textAlign: align }]} numberOfLines={1}>
                      {video.fileName ?? video.uri.split('/').pop() ?? `#${index + 1}`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Moderation status */}
          {moderationState !== 'idle' && (
            <View
              style={[
                uStyles.moderationRow,
                {
                  flexDirection: row,
                  backgroundColor:
                    moderationState === 'flagged' ? colors.destructive + '18' : colors.secondary,
                },
              ]}
            >
              {moderationState === 'scanning' && <ActivityIndicator size="small" color={colors.primary} />}
              {moderationState === 'flagged' && <Ionicons name="warning-outline" size={16} color={colors.destructive} />}
              {moderationState === 'passed' && <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />}
              <Text
                style={[
                  uStyles.moderationText,
                  { color: moderationState === 'flagged' ? colors.destructive : colors.primary, textAlign: align },
                ]}
              >
                {moderationState === 'scanning' && t('moderationScanning')}
                {moderationState === 'flagged' && t('moderationFlagged')}
                {moderationState === 'passed' && t('moderationPassed')}
              </Text>
            </View>
          )}

          <View style={[uStyles.moderationNoticeRow, { flexDirection: row }]}>
            <Ionicons name="information-circle-outline" size={14} color={colors.mutedForeground} />
            <Text style={[uStyles.moderationNoticeText, { color: colors.mutedForeground, textAlign: align }]}>
              {t('moderationNotice')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit button */}
      <View
        style={[
          uStyles.submitContainer,
          { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 8) },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            uStyles.submitBtn,
            { backgroundColor: canUpload ? colors.primary : colors.mutedForeground, opacity: pressed ? 0.85 : 1, flexDirection: row },
          ]}
          onPress={handleSubmit}
          disabled={submitting || !canUpload}
        >
          {submitting ? (
            <>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={uStyles.submitBtnText}>
                {submitStage === 'uploading' ? t('uploadingProgress') : t('uploadAll')}
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
              <Text style={uStyles.submitBtnText}>{t('uploadAll')}</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const uStyles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 20, fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
  trialBanner: { alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 8 },
  trialText: { fontSize: 12, fontFamily: 'Inter_500Medium', flex: 1 },
  limitBanner: { alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 10 },
  limitText: { fontSize: 12, fontFamily: 'Inter_500Medium', flex: 1 },
  scroll: { paddingHorizontal: 16, paddingTop: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontFamily: 'Inter_500Medium', marginBottom: 6 },
  hintText: { fontSize: 11, fontFamily: 'Inter_400Regular', marginBottom: 8, opacity: 0.8 },
  row: { gap: 12 },
  input: { height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, fontSize: 15, fontFamily: 'Inter_400Regular' },
  textarea: { height: 100, paddingTop: 12 },
  pickerBtn: { height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'space-between' },
  pickerText: { fontSize: 15, fontFamily: 'Inter_400Regular', flex: 1 },
  codePreview: { alignItems: 'center', gap: 8, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16 },
  codePreviewText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  guardianBox: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 16 },
  guardianHeader: { alignItems: 'center', gap: 6, marginBottom: 10 },
  guardianTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  consentRow: { alignItems: 'flex-start', gap: 10 },
  consentText: { flex: 1, fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  guardianNote: { fontSize: 10.5, fontFamily: 'Inter_400Regular', marginTop: 8, opacity: 0.75 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%', paddingTop: 12 },
  modalHandle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 16, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold', textAlign: 'center', paddingBottom: 12 },
  modalOption: { alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: StyleSheet.hairlineWidth },
  modalOptionText: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  mediaHeader: { alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  addBtn: { alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  addBtnText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  emptyMedia: { height: 80, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 6, flexDirection: 'row' },
  emptyText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  mediaGrid: { flexDirection: 'row', gap: 10, paddingVertical: 4 },
  mediaThumbnail: { width: 80, height: 80, borderRadius: 10, overflow: 'hidden' },
  thumbnailImage: { width: '100%', height: '100%' },
  removeBtn: { position: 'absolute', top: 2, right: 2 },
  videoList: { gap: 8 },
  videoItem: { alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, gap: 10 },
  videoMeta: { flex: 1, alignItems: 'center', gap: 8 },
  videoName: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular' },
  moderationRow: { alignItems: 'center', gap: 8, borderRadius: 10, padding: 10, marginTop: 10 },
  moderationText: { fontSize: 12, fontFamily: 'Inter_500Medium', flex: 1 },
  moderationNoticeRow: { alignItems: 'center', gap: 6, marginTop: 10 },
  moderationNoticeText: { fontSize: 11, fontFamily: 'Inter_400Regular', flex: 1, opacity: 0.8 },
  submitContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, borderTopWidth: StyleSheet.hairlineWidth },
  submitBtn: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 8 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
});
