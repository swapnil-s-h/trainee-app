import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function RegistrationScreen({ navigation }) {
  const [employeeId, setEmployeeId] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleVerify = () => {
    navigation.navigate('MobileAndFace', { traineeId: employeeId });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1C" />
      <View style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Registration Progress</Text>
              <Text style={styles.progressStep}>Step 1 of 3</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={styles.progressBarFill} />
            </View>
          </View>

          {/* Title & Subtitle */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Initiate Registration</Text>
            <Text style={styles.subtitle}>
              Please enter your company credentials to verify your identity and
              continue your setup.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Employee ID */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EMPLOYEE ID</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="id-card-outline"
                  size={18}
                  color="#4A5568"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: EMP-123456"
                  placeholderTextColor="#4A5568"
                  value={employeeId}
                  onChangeText={setEmployeeId}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Temporary Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>TEMPORARY PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#4A5568"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter temporary password"
                  placeholderTextColor="#4A5568"
                  value={tempPassword}
                  onChangeText={setTempPassword}
                  secureTextEntry={!showPassword}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prev => !prev)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#4A5568"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.hint}>
                Check your onboarding email for this code.
              </Text>
            </View>
          </View>

          <View style={styles.spacer} />

          {/* Verify Button */}
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
            activeOpacity={0.85}
          >
            <Text style={styles.verifyButtonText}>Verify Identity</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Support Link */}
          <View style={styles.supportRow}>
            <Text style={styles.supportText}>Having trouble? </Text>
            <TouchableOpacity>
              <Text style={styles.supportLink}>Contact HR Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0F1C' },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  progressSection: { marginBottom: 32 },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: { fontSize: 13, color: '#A0AEC0', fontWeight: '500' },
  progressStep: { fontSize: 13, color: '#A0AEC0', fontWeight: '500' },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#1E2A3A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '33%',
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  titleSection: { marginBottom: 36 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 10,
    lineHeight: 34,
  },
  subtitle: { fontSize: 14, color: '#718096', lineHeight: 22 },
  form: { gap: 24 },
  fieldGroup: { gap: 8 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A0AEC0',
    letterSpacing: 1.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    alignSelf: 'stretch',
    paddingVertical: 0,
  },
  passwordInput: { paddingRight: 8 },
  eyeButton: { padding: 4 },
  hint: { fontSize: 12, color: '#4A5568', fontStyle: 'italic', marginTop: 2 },
  spacer: { flex: 1 },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 54,
    gap: 10,
    marginBottom: 20,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  supportRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportText: { fontSize: 13, color: '#718096' },
  supportLink: { fontSize: 13, color: '#2563EB', fontWeight: '600' },
});
