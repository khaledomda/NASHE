import React, { useState } from 'react';
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
import { useColors } from '@/hooks/useColors';

// ─── Types ───────────────────────────────────────────────────────────────────

type PickerOption = { label: string; value: string };

// ─── Data ────────────────────────────────────────────────────────────────────

const ATHLETES: PickerOption[] = [
  { label: 'سارة العتيبي', value: '1' },
  { label: 'فيصل الجريني', value: '2' },
  { label: 'نورة الشمري', value: '3' },
  { label: 'خالد المطيري', value: '4' },
  { label: 'ريم الزهراني', value: '5' },
];

const REGIONS: PickerOption[] = [
  { label: 'الرياض', value: 'riyadh' },
  { label: 'جدة', value: 'jeddah' },
  { label: 'الدمام', value: 'dammam' },
  { label: 'مكة المكرمة', value: 'makkah' },
  { label: 'المدينة المنورة', value: 'madinah' },
  { label: 'الطائف', value: 'taif' },
];

const SPORTS: PickerOption[] = [
  { label: 'كرة القدم', value: 'football' },
  { label: 'كرة السلة', value: 'basketball' },
  { label: 'السباحة', value: 'swimming' },
  { label: 'ألعاب القوى', value: 'athletics' },
  { label: 'التنس', value: 'tennis' },
  { label: 'كرة الطائرة', value: 'volleyball' },
  { label: 'الجودو', value: 'judo' },
  { label: 'الجمباز', value: 'gymnastics' },
];

const GENDERS: PickerOption[] = [
  { label: 'ذكر', value: 'male' },
  { label: 'أنثى', value: 'female' },
];

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
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        style={[
          uStyles.pickerBtn,
          { backgroundColor: colors.input, borderColor: colors.border },
        ]}
        onPress={() => setOpen(true)}
      >
        <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
        <Text
          style={[
            uStyles.pickerText,
            { color: selected ? colors.foreground : colors.mutedForeground },
          ]}
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
                  { borderBottomColor: colors.border },
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
                    { color: colors.foreground },
                    opt.value === value && { color: colors.primary, fontFamily: 'Inter_600SemiBold' },
                  ]}
                >
                  {opt.label}
                </Text>
                {opt.value === value && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
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

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 + 50 : 0;

  const [athlete, setAthlete] = useState('');
  const [athleteName, setAthleteName] = useState('');
  const [date, setDate] = useState('');
  const [region, setRegion] = useState('');
  const [sport, setSport] = useState('');
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [videos, setVideos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [submitting, setSubmitting] = useState(false);

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
    if (!result.canceled) {
      setVideos((prev) => [...prev, ...result.assets]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!athlete || !athleteName.trim() || !date.trim() || !region || !sport || !gender) {
      Alert.alert('خطأ', 'يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSubmitting(true);
    // Simulate upload
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    Alert.alert('تم الرفع', 'تم رفع المقطع بنجاح');
    // Reset form
    setAthlete('');
    setAthleteName('');
    setDate('');
    setRegion('');
    setSport('');
    setGender('');
    setDescription('');
    setPhotos([]);
    setVideos([]);
  };

  return (
    <View style={[uStyles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[uStyles.header, { backgroundColor: colors.primary, paddingTop: topPad + 12 }]}>
        <View style={{ width: 24 }} />
        <Text style={uStyles.headerTitle}>رفع المقاطع</Text>
        <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[uStyles.scroll, { paddingBottom: bottomPad + 120 }]}
      >
        {/* Select athlete */}
        <View style={uStyles.field}>
          <Text style={[uStyles.label, { color: colors.mutedForeground }]}>اختر رياضياً</Text>
          <SelectPicker
            options={ATHLETES}
            value={athlete}
            placeholder="اختر رياضياً"
            onSelect={setAthlete}
          />
        </View>

        {/* Athlete name */}
        <View style={uStyles.field}>
          <Text style={[uStyles.label, { color: colors.mutedForeground }]}>اسم الرياضي</Text>
          <TextInput
            style={[uStyles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
            placeholder="اسم الرياضي"
            placeholderTextColor={colors.mutedForeground}
            value={athleteName}
            onChangeText={setAthleteName}
            textAlign="right"
          />
        </View>

        {/* Date + Region */}
        <View style={uStyles.row}>
          <View style={[uStyles.field, { flex: 1 }]}>
            <Text style={[uStyles.label, { color: colors.mutedForeground }]}>تاريخ الميلاد</Text>
            <TextInput
              style={[uStyles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.mutedForeground}
              value={date}
              onChangeText={setDate}
              textAlign="right"
              keyboardType="numeric"
            />
          </View>
          <View style={[uStyles.field, { flex: 1 }]}>
            <Text style={[uStyles.label, { color: colors.mutedForeground }]}>المنطقة</Text>
            <SelectPicker
              options={REGIONS}
              value={region}
              placeholder="المنطقة"
              onSelect={setRegion}
            />
          </View>
        </View>

        {/* Sport + Gender row */}
        <View style={uStyles.row}>
          <View style={[uStyles.field, { flex: 1 }]}>
            <Text style={[uStyles.label, { color: colors.mutedForeground }]}>الرياضة</Text>
            <SelectPicker
              options={SPORTS}
              value={sport}
              placeholder="الرياضة"
              onSelect={setSport}
            />
          </View>
          <View style={[uStyles.field, { flex: 1 }]}>
            <Text style={[uStyles.label, { color: colors.mutedForeground }]}>الجنس</Text>
            <SelectPicker
              options={GENDERS}
              value={gender}
              placeholder="الجنس"
              onSelect={setGender}
            />
          </View>
        </View>

        {/* Description */}
        <View style={uStyles.field}>
          <Text style={[uStyles.label, { color: colors.mutedForeground }]}>نبذة مختصرة</Text>
          <TextInput
            style={[
              uStyles.input,
              uStyles.textarea,
              { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground },
            ]}
            placeholder="أكتب نبذة مختصرة عن الرياضي..."
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            textAlign="right"
          />
        </View>

        {/* Photos */}
        <View style={uStyles.field}>
          <View style={[uStyles.mediaHeader, { flexDirection: 'row-reverse' }]}>
            <Text style={[uStyles.label, { color: colors.mutedForeground, marginBottom: 0 }]}>
              الصور (اختياري)
            </Text>
            <Pressable
              style={({ pressed }) => [
                uStyles.addBtn,
                { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={pickPhotos}
            >
              <Ionicons name="add" size={18} color={colors.primary} />
              <Text style={[uStyles.addBtnText, { color: colors.primary }]}>إضافة</Text>
            </Pressable>
          </View>
          {photos.length === 0 ? (
            <View style={[uStyles.emptyMedia, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Ionicons name="images-outline" size={28} color={colors.mutedForeground} />
              <Text style={[uStyles.emptyText, { color: colors.mutedForeground }]}>لا توجد صور</Text>
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
          <View style={[uStyles.mediaHeader, { flexDirection: 'row-reverse' }]}>
            <Text style={[uStyles.label, { color: colors.mutedForeground, marginBottom: 0 }]}>
              الفيديوهات
            </Text>
            <Pressable
              style={({ pressed }) => [
                uStyles.addBtn,
                { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={pickVideos}
            >
              <Ionicons name="add" size={18} color={colors.primary} />
              <Text style={[uStyles.addBtnText, { color: colors.primary }]}>إضافة</Text>
            </Pressable>
          </View>
          {videos.length === 0 ? (
            <View style={[uStyles.emptyMedia, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Ionicons name="videocam-outline" size={28} color={colors.mutedForeground} />
              <Text style={[uStyles.emptyText, { color: colors.mutedForeground }]}>لا توجد فيديوهات</Text>
            </View>
          ) : (
            <View style={uStyles.videoList}>
              {videos.map((video, index) => (
                <View
                  key={index}
                  style={[uStyles.videoItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <Pressable onPress={() => removeVideo(index)}>
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                  </Pressable>
                  <View style={uStyles.videoMeta}>
                    <Ionicons name="videocam" size={20} color={colors.primary} />
                    <Text style={[uStyles.videoName, { color: colors.foreground }]} numberOfLines={1}>
                      {video.uri.split('/').pop() ?? `فيديو ${index + 1}`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Submit button */}
      <View
        style={[
          uStyles.submitContainer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 8),
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            uStyles.submitBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
              <Text style={uStyles.submitBtnText}>رفع الكل</Text>
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
  scroll: { paddingHorizontal: 16, paddingTop: 20 },
  field: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    textAlign: 'right',
    marginBottom: 6,
  },
  row: { flexDirection: 'row-reverse', gap: 12 },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  textarea: {
    height: 100,
    paddingTop: 12,
  },
  pickerBtn: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    flex: 1,
    textAlign: 'right',
  },
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingTop: 12,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    paddingBottom: 12,
  },
  modalOption: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalOptionText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
  },
  // Media
  mediaHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  emptyMedia: {
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexDirection: 'row',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  mediaGrid: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  mediaThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  videoList: { gap: 8 },
  videoItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  videoMeta: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  videoName: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
  },
  // Submit
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  submitBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
});
