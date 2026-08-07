import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

const ROLES: { role: UserRole; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { role: 'visitor', icon: 'person-outline', color: '#0F9D68' },
  { role: 'scout', icon: 'search-outline', color: '#0369A1' },
  { role: 'admin', icon: 'shield-checkmark-outline', color: '#7C3AED' },
];

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { t, row, align, toggleLang } = useLanguage();

  const [step, setStep] = useState<'entry' | 'form'>('entry');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roleTitle = (role: UserRole) =>
    role === 'visitor' ? t('entryVisitorTitle') : role === 'scout' ? t('entryScoutTitle') : t('entryAdminTitle');
  const roleDesc = (role: UserRole) =>
    role === 'visitor' ? t('entryVisitorDesc') : role === 'scout' ? t('entryScoutDesc') : t('entryAdminDesc');

  const chooseRole = (role: UserRole) => {
    Haptics.selectionAsync();
    setSelectedRole(role);
    setStep('form');
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim() || !selectedRole) {
      setError(t('loginError'));
      return;
    }
    setError('');
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const success = await login(username, password, selectedRole);
    setLoading(false);
    if (success) {
      router.replace('/(tabs)');
    } else {
      setError(t('loginFailed'));
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 40 }]}>
        {/* Trial banner */}
        <View style={styles.trialBanner}>
          <Ionicons name="time-outline" size={14} color="#FFFFFF" />
          <Text style={styles.trialText}>{t('trialBanner')}</Text>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="trophy" size={40} color="#0F9D68" />
          </View>
        </View>

        <Text style={styles.appName}>{t('appName')}</Text>
        <Text style={styles.tagline}>{t('tagline')}</Text>

        {step === 'entry' ? (
          <View style={styles.roleList}>
            <Text style={[styles.chooseTitle, { textAlign: align }]}>{t('chooseEntry')}</Text>
            {ROLES.map((r) => (
              <Pressable
                key={r.role}
                style={({ pressed }) => [
                  styles.roleCard,
                  { flexDirection: row, opacity: pressed ? 0.85 : 1 },
                ]}
                onPress={() => chooseRole(r.role)}
              >
                <View style={[styles.roleIconWrap, { backgroundColor: r.color }]}>
                  <Ionicons name={r.icon} size={22} color="#FFFFFF" />
                </View>
                <View style={styles.roleTextWrap}>
                  <Text style={[styles.roleTitle, { textAlign: align }]}>{roleTitle(r.role)}</Text>
                  <Text style={[styles.roleDesc, { textAlign: align }]}>{roleDesc(r.role)}</Text>
                </View>
                <Ionicons
                  name={row === 'row-reverse' ? 'chevron-back' : 'chevron-forward'}
                  size={18}
                  color="rgba(255,255,255,0.6)"
                />
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.form}>
            <Pressable style={[styles.backRow, { flexDirection: row }]} onPress={() => setStep('entry')}>
              <Ionicons name={row === 'row-reverse' ? 'chevron-forward' : 'chevron-back'} size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.backText}>{selectedRole ? roleTitle(selectedRole) : ''}</Text>
            </Pressable>

            <View style={[styles.inputWrapper, { flexDirection: row }]}>
              <TextInput
                style={[styles.input, { textAlign: align }]}
                placeholder={t('username')}
                placeholderTextColor="rgba(27,94,59,0.5)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <Ionicons name="person-outline" size={20} color="#0F9D68" />
            </View>

            <View style={[styles.inputWrapper, { flexDirection: row }]}>
              <TextInput
                style={[styles.input, { textAlign: align }]}
                placeholder={t('password')}
                placeholderTextColor="rgba(27,94,59,0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#0F9D68" />
              </Pressable>
            </View>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <Pressable
              style={({ pressed }) => [styles.loginBtn, pressed && styles.loginBtnPressed]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#0F9D68" /> : <Text style={styles.loginBtnText}>{t('login')}</Text>}
            </Pressable>
          </View>
        )}

        <Pressable style={styles.langToggle} onPress={toggleLang}>
          <Text style={styles.langText}>{t('language')}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F9D68' },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 24, backgroundColor: '#0F9D68' },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  trialText: { color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter_500Medium' },
  logoContainer: { marginBottom: 16 },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 6,
    fontFamily: 'Inter_700Bold',
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 28,
    textAlign: 'center',
    paddingHorizontal: 12,
    fontFamily: 'Inter_400Regular',
  },
  roleList: { width: '100%', gap: 12 },
  chooseTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  roleCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  roleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTextWrap: { flex: 1 },
  roleTitle: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  roleDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  form: { width: '100%', gap: 14 },
  backRow: { alignItems: 'center', gap: 6, marginBottom: 4 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  inputWrapper: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, color: '#111827', fontFamily: 'Inter_400Regular' },
  errorText: { color: '#FCA5A5', fontSize: 13, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  loginBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  loginBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  loginBtnText: { color: '#0F9D68', fontSize: 16, fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
  langToggle: { marginTop: 'auto', paddingVertical: 12 },
  langText: { color: 'rgba(255,255,255,0.65)', fontSize: 13, fontFamily: 'Inter_400Regular' },
});
