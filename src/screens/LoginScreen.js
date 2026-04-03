import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '../context/SessionContext';

export default function LoginScreen({ navigation }) {
  const { setTraineeId, clearSession } = useSession();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    const id = employeeId.trim();
    if (id) {
      await setTraineeId(id);
    } else {
      await clearSession();
    }
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1C" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Card */}
          <View style={styles.card}>
            {/* Logo */}
            <View style={styles.logoWrapper}>
              <View style={styles.logoBadge}>
                <Ionicons name="school" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.brandName}>LMS Portal</Text>
              <Text style={styles.brandSub}>Learning Management System</Text>
            </View>

            {/* Employee ID */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Employee ID</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="id-card-outline"
                  size={17}
                  color="#4A5568"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. EMP-12345"
                  placeholderTextColor="#4A5568"
                  value={employeeId}
                  onChangeText={setEmployeeId}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotLink}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={17}
                  color="#4A5568"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#4A5568"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(p => !p)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={19}
                    color="#4A5568"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
              activeOpacity={0.85}
            >
              <Text style={styles.signInText}>Sign In</Text>
              <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>SECURE ACCESS</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign Up */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>First-time user? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Registration')}
              >
                <Text style={styles.signupLink}>Sign up here</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dots indicator */}
          <View style={styles.dotsRow}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
          </View>

          {/* Powered by */}
          <Text style={styles.poweredBy}>
            POWERED BY ENTERPRISE LMS SOLUTIONS
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0F1C' },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    justifyContent: 'center',
  },

  // Card
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 28,
    gap: 20,
  },

  // Logo
  logoWrapper: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  brandSub: {
    fontSize: 12,
    color: '#718096',
    letterSpacing: 0.3,
  },

  // Form
  fieldGroup: { gap: 8 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A0AEC0',
  },
  forgotLink: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0F1C',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 14,
    alignSelf: 'stretch',
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  eyeButton: { padding: 4 },

  // Sign In
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 52,
    gap: 10,
    marginTop: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  signInText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E2A3A',
  },
  dividerText: {
    fontSize: 10,
    color: '#4A5568',
    letterSpacing: 1.5,
    fontWeight: '600',
  },

  // Sign Up
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: { fontSize: 13, color: '#718096' },
  signupLink: { fontSize: 13, color: '#2563EB', fontWeight: '600' },

  // Bottom
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 28,
  },
  dot: {
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E2A3A',
  },
  dotActive: {
    backgroundColor: '#2563EB',
  },
  poweredBy: {
    textAlign: 'center',
    fontSize: 9,
    color: '#4A5568',
    letterSpacing: 1.8,
    fontWeight: '600',
    marginTop: 16,
  },
});
