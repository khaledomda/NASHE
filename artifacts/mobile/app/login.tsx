import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
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
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';
import { BrandWordmark } from '@/components/BrandWordmark';

const ROLES: { role: UserRole; icon: keyof typeof Ionicons.glyphMap }[] = [
  { role: 'visitor', icon: 'person-outline' },
  { role: 'scout', icon: 'search-outline' },
  { role: 'admin', icon: 'shield-checkmark-outline' },
];

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { login, register } = useAuth();
  const { t, row, align, toggleLang, lang } = useLanguage();

  const [step, setStep] = useState<'entry' | 'form'>('entry');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roleTitle = (role: UserRole) =>
    role === 'visitor' ? t('entryVisitorTitle') : role === 'scout' ? t('entryScoutTitle') : t('entryAdminTitle');
  const roleDesc = (role: UserRole) =>
    role === 'visitor' ? t('entryVisitorDesc') : role === 'scout' ? t('entryScoutDesc') : t('entryAdminDesc');
  const roleColor = (role: UserRole) => (role === 'visitor' ? colors.primary : role === 'scout' ? colors.scout : colors.admin);

  const chooseRole = (role: UserRole) => {
    Haptics.selectionAsync();
    setSelectedRole(role);
    setStep('form');
  };

  const resetFormFields = () => {
    setError('');
    setPassword('');
  };

  const handleSubmit = async () => {
    if (!selectedRole) return;
    if (!username.trim() || !password.trim()) {
      setError(t('loginError'));
      return;
    }
    setError('');
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const errorMessage =
      mode === 'login'
        ? await login(username, password)
        : await register({
            username,
            password,
            role: selectedRole,
            phone: phone || undefined,
            email: email || undefined,
            inviteCode: inviteCode.trim() || undefined,
          });

    setLoading(false);
    if (errorMessage === null) {
      router.replace('/(tabs)');
    } else {
      setError(errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Soft lavender wash at the top keeps the page white-first with a light-purple accent */}
      <View style={[styles.topWash, { backgroundColor: colors.primaryLight }]} />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Trial banner */}
        <View style={[styles.trialBanner, { backgroundColor: colors.secondary }]}>
          <Ionicons name="time-outline" size={14} color={colors.primary} />
          <Text style={[styles.trialText, { color: colors.secondaryForeground }]}>{t('trialBanner')}</Text>
        </View>

        {/* Wordmark */}
        <BrandWordmark size={44} style={{ marginBottom: 8 }} />
        <Text style={[styles.tagline, { color: colors.mutedForeground }]}>{t('tagline')}</Text>

        {step === 'entry' ? (
          <View style={styles.roleList}>
            <Text style={[styles.chooseTitle, { color: colors.foreground, textAlign: align }]}>{t('chooseEntry')}</Text>
            {ROLES.map((r) => (
              <Pressable
                key={r.role}
                style={({ pressed }) => [
                  styles.roleCard,
                  {
                    flexDirection: row,
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
                onPress={() => chooseRole(r.role)}
              >
                <View style={[styles.roleIconWrap, { backgroundColor: roleColor(r.role) }]}>
                  <Ionicons name={r.icon} size={22} color="#FFFFFF" />
                </View>
                <View style={styles.roleTextWrap}>
                  <Text style={[styles.roleTitle, { color: colors.foreground, textAlign: align }]}>{roleTitle(r.role)}</Text>
                  <Text style={[styles.roleDesc, { color: colors.mutedForeground, textAlign: align }]}>{roleDesc(r.role)}</Text>
                </View>
                <Ionicons
                  name={row === 'row-reverse' ? 'chevron-back' : 'chevron-forward'}
                  size={18}
                  color={colors.mutedForeground}
                />
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.form}>
            <Pressable
              style={[styles.backRow, { flexDirection: row }]}
              onPress={() => {
                setStep('entry');
                resetFormFields();
              }}
            >
              <Ionicons
                name={row === 'row-reverse' ? 'chevron-forward' : 'chevron-back'}
                size={16}
                color={colors.primary}
              />
              <Text style={[styles.backText, { color: colors.primary }]}>
                {selectedRole ? roleTitle(selectedRole) : ''}
              </Text>
            </Pressable>

            <View
              style={[
                styles.inputWrapper,
                { flexDirection: row, backgroundColor: colors.input, borderColor: colors.border },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.foreground, textAlign: align }]}
                placeholder={t('username')}
                placeholderTextColor={colors.mutedForeground}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <Ionicons name="person-outline" size={20} color={colors.primary} />
            </View>

            <View
              style={[
                styles.inputWrapper,
                { flexDirection: row, backgroundColor: colors.input, borderColor: colors.border },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.foreground, textAlign: align }]}
                placeholder={t('password')}
                placeholderTextColor={colors.mutedForeground}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.primary} />
              </Pressable>
            </View>

            {mode === 'register' && (
              <>
                <View
                  style={[
                    styles.inputWrapper,
                    { flexDirection: row, backgroundColor: colors.input, borderColor: colors.border },
                  ]}
                >
                  <TextInput
                    style={[styles.input, { color: colors.foreground, textAlign: align }]}
                    placeholder={t('phoneOptional')}
                    placeholderTextColor={colors.mutedForeground}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                  <Ionicons name="call-outline" size={20} color={colors.primary} />
                </View>
                <View
                  style={[
                    styles.inputWrapper,
                    { flexDirection: row, backgroundColor: colors.input, borderColor: colors.border },
                  ]}
                >
                  <TextInput
                    style={[styles.input, { color: colors.foreground, textAlign: align }]}
                    placeholder={t('emailOptional')}
                    placeholderTextColor={colors.mutedForeground}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  <Ionicons name="mail-outline" size={20} color={colors.primary} />
                </View>
                {selectedRole === 'admin' && (
                  <View
                    style={[
                      styles.inputWrapper,
                      { flexDirection: row, backgroundColor: colors.input, borderColor: colors.border },
                    ]}
                  >
                    <TextInput
                      style={[styles.input, { color: colors.foreground, textAlign: align }]}
                      placeholder={lang === 'ar' ? 'رمز دعوة المشرف' : 'Admin invite code'}
                      placeholderTextColor={colors.mutedForeground}
                      value={inviteCode}
                      onChangeText={setInviteCode}
                      autoCapitalize="none"
                    />
                    <Ionicons name="key-outline" size={20} color={colors.primary} />
                  </View>
                )}
                <Text style={[styles.hintText, { color: colors.mutedForeground }]}>{t('passwordHint')}</Text>
              </>
            )}

            {!!error && <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>}

            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                { backgroundColor: colors.primary },
                pressed && styles.submitBtnPressed,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <Text style={[styles.submitBtnText, { color: colors.primaryForeground }]}>
                  {mode === 'login' ? t('login') : t('registerButton')}
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                resetFormFields();
              }}
              style={styles.switchModeBtn}
            >
              <Text style={[styles.switchModeText, { color: colors.primary }]}>
                {mode === 'login' ? t('needAccount') : t('haveAccount')}
              </Text>
            </Pressable>
          </View>
        )}

        <Pressable style={styles.langToggle} onPress={toggleLang}>
          <Text style={[styles.langText, { color: colors.mutedForeground }]}>{t('language')}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  container: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24 },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  trialText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  tagline: {
    fontSize: 13,
    marginBottom: 28,
    textAlign: 'center',
    paddingHorizontal: 12,
    fontFamily: 'Inter_400Regular',
  },
  roleList: { width: '100%', gap: 12 },
  chooseTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  roleCard: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    shadowColor: '#5B4BD5',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  roleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTextWrap: { flex: 1 },
  roleTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  roleDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  form: { width: '100%', gap: 14 },
  backRow: { alignItems: 'center', gap: 6, marginBottom: 4 },
  backText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  inputWrapper: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 52,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  hintText: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: -6 },
  errorText: { fontSize: 13, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  submitBtn: {
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  submitBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  submitBtnText: { fontSize: 16, fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
  switchModeBtn: { alignItems: 'center', paddingVertical: 4 },
  switchModeText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  langToggle: { marginTop: 'auto', paddingVertical: 12 },
  langText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
});
