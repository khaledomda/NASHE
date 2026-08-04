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
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    setError('');
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      router.replace('/(tabs)');
    } else {
      setError('فشل تسجيل الدخول. تحقق من بياناتك.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="trophy" size={48} color="#1B5E3B" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.appName}>ناشئ</Text>
        <Text style={styles.tagline}>منصة لاكتشاف مواهب الشباب في جميع الرياضات</Text>

        {/* Form */}
        <View style={styles.form}>
          {/* Username */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="اسم المستخدم"
              placeholderTextColor="rgba(27,94,59,0.5)"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              textAlign="right"
            />
            <Ionicons name="person-outline" size={20} color="#1B5E3B" style={styles.inputIcon} />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="كلمة المرور"
              placeholderTextColor="rgba(27,94,59,0.5)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              textAlign="right"
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.inputIcon}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#1B5E3B"
              />
            </Pressable>
          </View>

          {/* Error */}
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          {/* Login Button */}
          <Pressable
            style={({ pressed }) => [styles.loginBtn, pressed && styles.loginBtnPressed]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1B5E3B" />
            ) : (
              <Text style={styles.loginBtnText}>تسجيل الدخول</Text>
            )}
          </Pressable>
        </View>

        {/* Language toggle */}
        <Pressable style={styles.langToggle}>
          <Text style={styles.langText}>العربية / English</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1B5E3B',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#1B5E3B',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
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
    fontSize: 42,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
    fontFamily: 'Inter_700Bold',
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 48,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  form: {
    width: '100%',
    gap: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
  },
  inputIcon: {
    marginLeft: 10,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  loginBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  loginBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  loginBtnText: {
    color: '#1B5E3B',
    fontSize: 16,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  langToggle: {
    marginTop: 'auto',
    paddingVertical: 12,
  },
  langText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
});
