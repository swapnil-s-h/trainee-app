import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { getApiErrorMessage, registerFace } from '../api/verificationApi';

/** One photo is captured while each instruction is on screen (before advancing). */
const FACE_CAPTURE_STEPS = [
  { icon: 'sunny-outline', instruction: 'Look straight at the camera' },
  { icon: 'arrow-back-outline', instruction: 'Slowly turn your head left' },
  { icon: 'arrow-forward-outline', instruction: 'Slowly turn your head right' },
  { icon: 'person-outline', instruction: 'Return to center and hold still' },
];

const FACE_COMPLETION_STEP = {
  icon: 'checkmark-circle',
  instruction: 'Face registration complete!',
};

const FACE_STEPS = [...FACE_CAPTURE_STEPS, FACE_COMPLETION_STEP];

const CAPTURE_STEP_MS = 2200;

export default function MobileAndFaceScreen({ navigation, route }) {
  const [phone, setPhone] = useState('');
  const [faceStep, setFaceStep] = useState(0); // 0 = not started
  const [faceStarted, setFaceStarted] = useState(false);
  const [faceComplete, setFaceComplete] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission === null) return;
    if (!permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const traineeId = route?.params?.traineeId || phone;

  const startFaceScan = () => {
    setRegistrationError('');
    setFaceStarted(true);
    setFaceStep(0);
    setCameraReady(false);
    runScanAnimation();
  };

  const runScanAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    if (!faceStarted || faceComplete || !permission?.granted || !cameraReady) {
      return;
    }
    if (!traineeId) {
      setRegistrationError(
        'Missing trainee identifier. Please go back and enter your Employee ID.'
      );
      setFaceStarted(false);
      setFaceStep(0);
      scanAnim.stopAnimation();
      return;
    }

    let active = true;

    const runCaptureSequence = async () => {
      const photos = [];
      try {
        for (let i = 0; i < FACE_CAPTURE_STEPS.length; i++) {
          if (!active) return;
          setFaceStep(i);
          await new Promise(resolve => setTimeout(resolve, CAPTURE_STEP_MS));
          if (!active) return;
          if (!cameraRef.current) {
            throw new Error('Camera is not ready yet. Please try again.');
          }
          const shot = await cameraRef.current.takePictureAsync({
            quality: 0.7,
            skipProcessing: true,
          });
          photos.push({ uri: shot.uri, type: 'image/jpeg' });
        }

        if (!active) return;
        setFaceStep(FACE_STEPS.length - 1);
        scanAnim.stopAnimation();
        setIsRegistering(true);
        setRegistrationError('');

        await registerFace(traineeId, null, photos);

        if (!active) return;
        setFaceComplete(true);
        setFaceStarted(false);
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } catch (err) {
        if (!active) return;
        scanAnim.stopAnimation();
        setRegistrationError(
          getApiErrorMessage(err, 'Face registration failed. Please try again.')
        );
        setFaceStarted(false);
        setFaceStep(0);
        setFaceComplete(false);
      } finally {
        if (active) {
          setIsRegistering(false);
        }
      }
    };

    runCaptureSequence();
    return () => {
      active = false;
    };
  }, [faceStarted, faceComplete, cameraReady, permission?.granted, traineeId]);

  const handleContinue = () => {
    navigation.navigate('OTPVerification', { phone, traineeId });
  };

  const canContinue = phone.length >= 10 && faceComplete && !isRegistering;

  const scanLineY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 160],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1C" />
      <View style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Registration Progress</Text>
              <Text style={styles.progressStep}>Step 2 of 3</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: '66%' }]} />
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Identity Verification</Text>
            <Text style={styles.subtitle}>
              Add your mobile number for OTP verification and register your face
              for biometric login.
            </Text>
          </View>

          {/* ── Section 1: Mobile Number ── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBadge}>
                <Ionicons
                  name="phone-portrait-outline"
                  size={18}
                  color="#2563EB"
                />
              </View>
              <Text style={styles.sectionTitle}>Mobile Number</Text>
            </View>
            <Text style={styles.sectionDesc}>
              We'll send a one-time password to this number.
            </Text>
            <Text style={styles.label}>PHONE NUMBER</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
              </View>
              <View style={styles.inputDivider} />
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit number"
                placeholderTextColor="#4A5568"
                value={phone}
                onChangeText={t => setPhone(t.replace(/[^0-9]/g, ''))}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          {/* ── Section 2: Face Registration ── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBadge}>
                <Ionicons name="scan-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.sectionTitle}>Face Registration</Text>
            </View>
            <Text style={styles.sectionDesc}>
              Position your face in the frame and follow the on-screen
              instructions.
            </Text>

            {/* Face Scanner UI */}
            <Animated.View
              style={[styles.faceFrame, { transform: [{ scale: pulseAnim }] }]}
            >
              {/* Corner brackets */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {/* Face silhouette */}
              {faceStarted && !faceComplete && permission?.granted && (
                <CameraView
                  ref={cameraRef}
                  style={styles.cameraAbsolute}
                  facing="front"
                  onCameraReady={() => setCameraReady(true)}
                />
              )}

              <View style={styles.faceSilhouette}>
                {faceComplete ? (
                  <Ionicons name="checkmark-circle" size={72} color="#22C55E" />
                ) : !faceStarted ? (
                  <Ionicons name="person-outline" size={72} color="#2A3A54" />
                ) : null}
              </View>

              {/* Scan line animation */}
              {faceStarted && !faceComplete && (
                <Animated.View
                  style={[
                    styles.scanLine,
                    { transform: [{ translateY: scanLineY }] },
                  ]}
                />
              )}

              {/* Step dots */}
              <View style={styles.stepDots}>
                {FACE_STEPS.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.stepDot,
                      faceStep > i && styles.stepDotDone,
                      faceStep === i && faceStarted && styles.stepDotActive,
                    ]}
                  />
                ))}
              </View>
            </Animated.View>

            {/* Instruction text */}
            <View style={styles.instructionBox}>
              <Ionicons
                name={
                  faceStarted
                    ? FACE_STEPS[faceStep].icon
                    : 'information-circle-outline'
                }
                size={16}
                color={faceComplete ? '#22C55E' : '#2563EB'}
              />
              <Text
                style={[
                  styles.instructionText,
                  faceComplete && styles.instructionComplete,
                ]}
              >
                {faceStarted
                  ? FACE_STEPS[faceStep].instruction
                  : 'Tap the button below to begin face registration'}
              </Text>
            </View>

            {/* Start / Retry button */}
            {!faceComplete && (
              <TouchableOpacity
                style={[
                  styles.faceButton,
                  faceStarted && styles.faceButtonScanning,
                ]}
                onPress={startFaceScan}
                disabled={faceStarted && !faceComplete}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={faceStarted ? 'radio-button-on' : 'scan'}
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={styles.faceButtonText}>
                  {faceStarted ? 'Scanning…' : 'Start Face Scan'}
                </Text>
              </TouchableOpacity>
            )}

            {faceComplete && (
              <View style={styles.faceSuccessBanner}>
                <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                <Text style={styles.faceSuccessText}>
                  Face registered successfully
                </Text>
              </View>
            )}
          </View>

          <View style={styles.spacer} />

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              !canContinue && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!canContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>Continue to OTP</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {registrationError ? (
            <Text style={styles.errorText}>{registrationError}</Text>
          ) : null}

          {isRegistering ? (
            <Text style={styles.statusText}>
              Registering your face. Please wait...
            </Text>
          ) : null}

          {!canContinue && !isRegistering && (
            <Text style={styles.continueHint}>
              {!phone || phone.length < 10
                ? 'Enter a valid 10-digit phone number to continue'
                : 'Complete face registration to continue'}
            </Text>
          )}
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
    paddingTop: 12,
    paddingBottom: 32,
  },

  // Progress
  progressSection: { marginBottom: 28 },
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
  titleSection: { marginBottom: 24 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 8,
    lineHeight: 32,
  },
  subtitle: { fontSize: 14, color: '#718096', lineHeight: 22 },

  // Section cards
  sectionCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 20,
    marginBottom: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#1E3A8A22',
    borderWidth: 1,
    borderColor: '#1E3A8A55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionDesc: {
    fontSize: 13,
    color: '#718096',
    lineHeight: 20,
    marginTop: -4,
  },

  // Input
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A0AEC0',
    letterSpacing: 1.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0F1C',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    height: 52,
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: 14,
    height: '100%',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 14,
    color: '#A0AEC0',
    fontWeight: '600',
  },
  inputDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#1E2A3A',
  },
  input: {
    flex: 1,
    fontSize: 15,
    alignSelf: 'stretch',
    color: '#FFFFFF',
    paddingVertical: 0,
  },

  // Face Frame
  faceFrame: {
    alignSelf: 'center',
    width: 240,
    height: 240,
    backgroundColor: '#0D1626',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  // Corner brackets
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: '#2563EB',
  },
  cornerTL: {
    top: 12,
    left: 12,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 12,
    right: 12,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 28,
    left: 12,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 28,
    right: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 4,
  },
  faceSilhouette: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    width: 160,
    height: 160,
    overflow: 'hidden',
  },
  cameraAbsolute: {
    position: 'absolute',
    top: 30,
    left: 40,
    width: 160,
    height: 160,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#2563EB',
    opacity: 0.7,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  stepDots: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    gap: 5,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1E2A3A',
  },
  stepDotActive: {
    backgroundColor: '#2563EB',
    width: 16,
  },
  stepDotDone: {
    backgroundColor: '#22C55E',
  },

  // Instruction
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0D1626',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E2A3A',
  },
  instructionText: {
    flex: 1,
    fontSize: 13,
    color: '#A0AEC0',
    lineHeight: 18,
  },
  instructionComplete: {
    color: '#22C55E',
  },

  // Face buttons
  faceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 10,
    height: 46,
    gap: 8,
  },
  faceButtonScanning: {
    backgroundColor: '#1E3A8A',
    opacity: 0.8,
  },
  faceButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  faceSuccessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#14532D22',
    borderWidth: 1,
    borderColor: '#22C55E44',
    borderRadius: 10,
    padding: 12,
  },
  faceSuccessText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
  },

  // Continue
  spacer: { minHeight: 24 },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 54,
    gap: 10,
    marginBottom: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: '#1E2A3A',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#F87171',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  statusText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#A0AEC0',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  continueHint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#4A5568',
    paddingHorizontal: 8,
  },
});
