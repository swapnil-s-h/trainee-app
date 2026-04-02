import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import BreakdownRow from '../components/BreakdownRow';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Score circle constants ───────────────────────────────────────────────────
const RADIUS = 70;
const STROKE_W = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SVG_SIZE = (RADIUS + STROKE_W) * 2 + 4;

// ─── Sample results (replace with route.params from QuizScreen) ───────────────
const SAMPLE_RESULTS = {
  score: 85,
  passingScore: 70,
  passed: true,
  userName: 'Alex',
  quizName: 'Cybersecurity Fundamentals',
  timeTaken: '12m 40s',
  correct: 17,
  incorrect: 3,
  skipped: 0,
};

export default function QuizResultsScreen({ navigation, route }) {
  const results = route?.params?.results ?? SAMPLE_RESULTS;

  const {
    score,
    passingScore,
    passed,
    userName,
    quizName,
    timeTaken,
    correct,
    incorrect,
    skipped,
  } = results;

  const strokeDashoffset = CIRCUMFERENCE * (1 - score / 100);
  const strokeColor = passed ? '#2563EB' : '#EF4444';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1C" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Score circle ── */}
        <View style={styles.scoreSection}>
          <View style={styles.circleWrapper}>
            <Svg width={SVG_SIZE} height={SVG_SIZE}>
              {/* Track */}
              <Circle
                cx={SVG_SIZE / 2}
                cy={SVG_SIZE / 2}
                r={RADIUS}
                stroke="#1E2A3A"
                strokeWidth={STROKE_W}
                fill="transparent"
              />
              {/* Progress */}
              <Circle
                cx={SVG_SIZE / 2}
                cy={SVG_SIZE / 2}
                r={RADIUS}
                stroke={strokeColor}
                strokeWidth={STROKE_W}
                fill="transparent"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                origin={`${SVG_SIZE / 2},${SVG_SIZE / 2}`}
              />
            </Svg>
            {/* Center text */}
            <View style={styles.circleCenter}>
              <Text style={[styles.scoreValue, { color: strokeColor }]}>
                {score}%
              </Text>
              <Text style={styles.scoreLabel}>Score</Text>
            </View>
          </View>

          {/* Passed / Failed badge */}
          <View
            style={[
              styles.statusBadge,
              passed ? styles.badgePassed : styles.badgeFailed,
            ]}
          >
            <Ionicons
              name={passed ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={passed ? '#22C55E' : '#EF4444'}
            />
            <Text
              style={[
                styles.statusText,
                passed ? styles.statusPassed : styles.statusFailed,
              ]}
            >
              {passed ? 'PASSED' : 'FAILED'}
            </Text>
          </View>

          {/* Headline */}
          <Text style={styles.headline}>Great job, {userName}!</Text>
          <Text style={styles.subline}>
            You have successfully completed the {quizName} quiz.
          </Text>
        </View>

        {/* ── Stats: time taken + passing score ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statLabelRow}>
              <Ionicons name="stopwatch-outline" size={13} color="#2563EB" />
              <Text style={styles.statLabel}>TIME TAKEN</Text>
            </View>
            <Text style={styles.statValue}>{timeTaken}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statLabelRow}>
              <Ionicons name="flag-outline" size={13} color="#2563EB" />
              <Text style={styles.statLabel}>PASSING SCORE</Text>
            </View>
            <Text style={styles.statValue}>{passingScore}%</Text>
          </View>
        </View>

        {/* ── Breakdown ── */}
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Breakdown</Text>
          <View style={styles.breakdownList}>
            <BreakdownRow
              variant="correct"
              label="Correct"
              sublabel="Accurate answers"
              count={correct}
            />
            <BreakdownRow
              variant="incorrect"
              label="Incorrect"
              sublabel="Needs review"
              count={incorrect}
            />
            <BreakdownRow
              variant="skipped"
              label="Skipped"
              sublabel="No answer given"
              count={skipped}
            />
          </View>
        </View>

        {/* ── Actions ── */}
        <View style={styles.actionsSection}>
          {passed && (
            <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.85}>
              <Ionicons name="desktop-outline" size={20} color="#FFFFFF" />
              <Text style={styles.downloadBtnText}>Download Certificate</Text>
            </TouchableOpacity>
          )}

          <View style={styles.secondaryRow}>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Ionicons name="eye-outline" size={16} color="#A0AEC0" />
              <Text style={styles.secondaryBtnText}>Review</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('My Courses')}
            >
              <Ionicons name="school-outline" size={16} color="#A0AEC0" />
              <Text style={styles.secondaryBtnText}>Course</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0F1C' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 24,
  },

  // Score section
  scoreSection: {
    alignItems: 'center',
    gap: 14,
    paddingTop: 12,
  },
  circleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCenter: {
    position: 'absolute',
    alignItems: 'center',
    gap: 2,
  },
  scoreValue: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  scoreLabel: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '500',
  },

  // Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgePassed: { backgroundColor: '#14532D' },
  badgeFailed: { backgroundColor: '#450A0A' },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  statusPassed: { color: '#22C55E' },
  statusFailed: { color: '#EF4444' },

  // Headline
  headline: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subline: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 16,
    gap: 10,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Breakdown
  breakdownSection: { gap: 12 },
  breakdownTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  breakdownList: { gap: 10 },

  // Actions
  actionsSection: { gap: 12 },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    height: 56,
    gap: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  downloadBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    height: 50,
    gap: 8,
    borderWidth: 1,
    borderColor: '#1E2A3A',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A0AEC0',
  },
});
