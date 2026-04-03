import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '../context/SessionContext';

const OTP_LENGTH = 6;
const TIMER_SECONDS = 45;

export default function OTPVerificationScreen({ navigation, route }) {
  const { setTraineeId } = useSession();
  const phone = route?.params?.phone || '+1 (555) 000-0000';
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    setTimer(TIMER_SECONDS);
    setCanResend(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    startTimer();
  };

  const handleChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    Keyboard.dismiss();
    const tid = route?.params?.traineeId;
    if (tid && String(tid).trim()) {
      await setTraineeId(String(tid).trim());
    }
    navigation.replace('Main');
  };

  const isComplete = otp.every(d => d !== '');
  const formattedTimer = `0${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`;

  const formatPhone = p => {
    if (!p) return '';
    const digits = p.replace(/\D/g, '');
    if (digits.length === 10) {
      return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    return `+91 ${p}`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1C" />

      <View style={styles.container}>
        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>Registration Progress</Text>
            <Text style={styles.progressStep}>Step 3 of 3</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '100%' }]} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Verify Phone Number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to your phone{' '}
          <Text style={styles.phoneHighlight}>{formatPhone(phone)}</Text> via
          SMS/WhatsApp.
        </Text>

        {/* OTP Boxes */}
        <View style={styles.otpRow}>
          {Array(OTP_LENGTH)
            .fill(0)
            .map((_, i) => (
              <TextInput
                key={i}
                ref={el => (inputRefs.current[i] = el)}
                style={[
                  styles.otpBox,
                  otp[i] ? styles.otpBoxFilled : null,
                  i === otp.findIndex(d => d === '')
                    ? styles.otpBoxActive
                    : null,
                ]}
                value={otp[i]}
                onChangeText={t => handleChange(t, i)}
                onKeyPress={e => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectionColor="#2563EB"
              />
            ))}
        </View>

        {/* Timer */}
        <View style={styles.timerWrapper}>
          <Ionicons name="time-outline" size={16} color="#FFFFFF" />
          <Text style={styles.timerText}>{formattedTimer}</Text>
        </View>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={!canResend}>
            <Text
              style={[
                styles.resendLink,
                !canResend && styles.resendLinkDisabled,
              ]}
            >
              Resend Code
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            !isComplete && styles.verifyButtonDisabled,
          ]}
          onPress={handleVerify}
          disabled={!isComplete}
          activeOpacity={0.85}
        >
          <Text style={styles.verifyButtonText}>Verify &amp; Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Change number */}
        <TouchableOpacity
          style={styles.changeRow}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="pencil-outline" size={14} color="#718096" />
          <Text style={styles.changeText}>Change Phone Number</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0F1C' },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 32,
  },

  // Progress
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
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },

  // Title
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 22,
    marginBottom: 36,
  },
  phoneHighlight: {
    color: '#2563EB',
    fontWeight: '600',
  },

  // OTP
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 8,
  },
  otpBox: {
    flex: 1,
    height: 56,
    width: 56,
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E2A3A',
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  otpBoxActive: {
    borderColor: '#2563EB',
    backgroundColor: '#0D1626',
  },
  otpBoxFilled: {
    borderColor: '#2563EB55',
    backgroundColor: '#1E3A8A22',
  },

  // Timer
  timerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1E3A8A',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },

  // Resend
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendLabel: { fontSize: 13, color: '#718096' },
  resendLink: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: '#4A5568',
  },

  spacer: { flex: 1, minHeight: 32 },

  // Verify
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    height: 56,
    gap: 10,
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  verifyButtonDisabled: {
    backgroundColor: '#1E2A3A',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Change number
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  changeText: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '500',
  },
});
