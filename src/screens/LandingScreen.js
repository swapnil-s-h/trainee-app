import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const badgeFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(badgeFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1C" />

      {/* Background decorative circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <View style={styles.container}>
        {/* Top: Logo / Badge */}
        <Animated.View style={[styles.topSection, { opacity: badgeFade }]}>
          <View style={styles.logoBadge}>
            <Ionicons name="school" size={36} color="#2563EB" />
          </View>
          <Text style={styles.brandName}>LearnHub</Text>
          <Text style={styles.brandTagline}>Enterprise Learning Platform</Text>
        </Animated.View>

        {/* Middle: Hero text */}
        <Animated.View
          style={[
            styles.heroSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.heroTitle}>
            Grow Skills.{'\n'}
            <Text style={styles.heroHighlight}>Build Careers.</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Access world-class training, track your progress, and earn
            certifications — all in one place designed for your team.
          </Text>

          {/* Feature pills */}
          <View style={styles.pillsRow}>
            {['📚 200+ Courses', '🏆 Certificates', '📊 Progress Tracking'].map(
              (pill, i) => (
                <View key={i} style={styles.pill}>
                  <Text style={styles.pillText}>{pill}</Text>
                </View>
              )
            )}
          </View>
        </Animated.View>

        {/* Bottom: Buttons */}
        <Animated.View style={[styles.bottomSection, { opacity: buttonFade }]}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => navigation.navigate('Registration')}
            activeOpacity={0.85}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            By continuing, you agree to our{' '}
            <Text style={styles.footerLink}>Terms & Privacy Policy</Text>
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0F1C',
  },

  // Decorative background circles
  bgCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#1E3A8A',
    opacity: 0.15,
    top: -80,
    right: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#2563EB',
    opacity: 0.08,
    top: height * 0.3,
    left: -60,
  },
  bgCircle3: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#1D4ED8',
    opacity: 0.1,
    bottom: 60,
    right: -60,
  },

  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },

  // Top / Logo
  topSection: {
    alignItems: 'center',
    paddingTop: 24,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 12,
    color: '#4A5568',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '500',
  },

  // Hero
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 32,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 50,
    letterSpacing: -1,
    marginBottom: 18,
  },
  heroHighlight: {
    color: '#2563EB',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#718096',
    lineHeight: 24,
    marginBottom: 28,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E2A3A',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  pillText: {
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: '500',
  },

  // Buttons
  bottomSection: {
    gap: 12,
    paddingBottom: 8,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 54,
    gap: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    height: 54,
    borderWidth: 1,
    borderColor: '#1E2A3A',
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A0AEC0',
    letterSpacing: 0.2,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    color: '#4A5568',
    marginTop: 4,
  },
  footerLink: {
    color: '#2563EB',
  },
});
