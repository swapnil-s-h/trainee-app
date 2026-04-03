import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView } from 'expo-camera';
import { useVisualVerification } from '../../../hooks/useVisualVerification';
import { useSession } from '../../../context/SessionContext';

/** Valid UUID v4 for optional quiz session_id on POST /verify/snapshot */
function uuidV4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Sample Data ──────────────────────────────────────────────────────────────
const QUIZ_DATA = {
  title: 'Trainee Quiz',
  timePerQuestion: 45, // seconds
  questions: [
    {
      id: 'q1',
      points: 100,
      text: 'What does SEO stand for?',
      options: [
        'Search Engine Optimization',
        'Social Engagement Online',
        'System Engine Output',
        'Site Edit Options',
      ],
    },
    {
      id: 'q2',
      points: 100,
      text: 'Which tag is most important for on-page SEO?',
      options: ['<footer>', '<title>', '<div>', '<span>'],
    },
    {
      id: 'q3',
      points: 100,
      text: 'Which of these is a core principle of UX design to ensure user satisfaction?',
      options: [
        'User-Centricity',
        'Visual Complexity',
        'Maximum Features',
        'Aesthetic Only Focus',
      ],
    },
    {
      id: 'q4',
      points: 150,
      text: 'What is the primary goal of content strategy?',
      options: [
        'Increase page load speed',
        'Plan and deliver content that meets user needs',
        'Reduce server costs',
        'Remove old content',
      ],
    },
    {
      id: 'q5',
      points: 100,
      text: 'Which metric measures the percentage of visitors who leave after one page?',
      options: [
        'Click-through rate',
        'Bounce rate',
        'Conversion rate',
        'Impressions',
      ],
    },
  ],
};

export default function QuizScreen({ navigation, route }) {
  const { traineeId: sessionTraineeId } = useSession();
  const quizTitle = route?.params?.quizTitle ?? QUIZ_DATA.title;
  const questions = QUIZ_DATA.questions;
  /** Same id as POST /register/face; route param overrides session (e.g. deep link). */
  const traineeId = route?.params?.traineeId ?? sessionTraineeId ?? null;
  const quizSessionId = useMemo(() => uuidV4(), []);

  const { cameraRef, cameraPermission } = useVisualVerification({
    traineeId,
    triggerType: 'QUIZ_ATTEMPT',
    sessionId: quizSessionId,
    enabled: Boolean(traineeId),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: optionIndex }
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_DATA.timePerQuestion);
  const timerRef = useRef(null);

  const question = questions[currentIndex];
  const totalQ = questions.length;
  const progressPct = ((currentIndex + 1) / totalQ) * 100;
  const selected = answers[question.id] ?? null;

  // Reset + start timer on question change
  useEffect(() => {
    setTimeRemaining(QUIZ_DATA.timePerQuestion);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          autoAdvance();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentIndex]);

  const autoAdvance = () => {
    if (currentIndex < totalQ - 1) setCurrentIndex(i => i + 1);
  };

  const handleSelect = optIndex => {
    setAnswers(prev => ({ ...prev, [question.id]: optIndex }));
  };

  const handleNext = () => {
    if (currentIndex < totalQ - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      // Submit
      clearInterval(timerRef.current);
      navigation.replace('QuizResults', { answers, questions, quizTitle });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const handleClose = () => {
    Alert.alert('Exit Quiz', 'Are you sure? Your progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Exit',
        style: 'destructive',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const timerFormatted = `${String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:${String(timeRemaining % 60).padStart(2, '0')}`;
  const timerDanger = timeRemaining <= 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1C" />

      {cameraPermission?.granted && traineeId ? (
        <CameraView
          ref={cameraRef}
          style={styles.hiddenCamera}
          facing="front"
        />
      ) : null}

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.quizTitle}>{quizTitle}</Text>
        <TouchableOpacity style={styles.helpBtn}>
          <Ionicons name="help-circle-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Progress bar ── */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>
            QUESTION {currentIndex + 1} OF {totalQ}
          </Text>
          <Text style={styles.progressPercent}>
            {Math.round(progressPct)}% Complete
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Stats row: timer + points ── */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, timerDanger && styles.statCardDanger]}>
            <View style={styles.statLabel}>
              <Ionicons name="stopwatch-outline" size={13} color="#718096" />
              <Text style={styles.statLabelText}>REMAINING</Text>
            </View>
            <Text
              style={[styles.statValue, timerDanger && styles.statValueDanger]}
            >
              {timerFormatted}
            </Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statLabel}>
              <Ionicons name="star-outline" size={13} color="#718096" />
              <Text style={styles.statLabelText}>POINT VALUE</Text>
            </View>
            <Text style={styles.statValue}>{question.points} pts</Text>
          </View>
        </View>

        {/* ── Question text ── */}
        <Text style={styles.questionText}>{question.text}</Text>

        {/* ── Options ── */}
        <View style={styles.optionsList}>
          {question.options.map((opt, idx) => {
            const isSelected = selected === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.optionRow,
                  isSelected && styles.optionRowSelected,
                ]}
                onPress={() => handleSelect(idx)}
                activeOpacity={0.85}
              >
                <View
                  style={[styles.radio, isSelected && styles.radioSelected]}
                >
                  {isSelected && <View style={styles.radioDot} />}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ── Bottom navigation ── */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.prevBtn, currentIndex === 0 && styles.btnDisabled]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Ionicons
            name="chevron-back"
            size={16}
            color={currentIndex === 0 ? '#2A3A54' : '#A0AEC0'}
          />
          <Text
            style={[
              styles.prevBtnText,
              currentIndex === 0 && styles.prevBtnTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextBtn, selected === null && styles.nextBtnSoft]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {currentIndex === totalQ - 1 ? 'Submit Quiz' : 'Next Question'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0F1C' },

  hiddenCamera: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    overflow: 'hidden',
    left: 0,
    top: 0,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  closeBtn: { padding: 4 },
  helpBtn: { padding: 4 },
  quizTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Progress
  progressSection: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A0AEC0',
    letterSpacing: 0.8,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#1E2A3A',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 5,
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 24,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 16,
    gap: 8,
  },
  statCardDanger: {
    borderColor: '#7F1D1D',
    backgroundColor: '#1A0A0A',
  },
  statLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#718096',
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  statValueDanger: {
    color: '#EF4444',
  },

  // Question
  questionText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 32,
    letterSpacing: -0.3,
  },

  // Options
  optionsList: { gap: 12 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E2A3A',
    padding: 18,
    gap: 14,
  },
  optionRowSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#0D1A33',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#4A5568',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E2A3A',
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    height: 54,
    paddingHorizontal: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#1E2A3A',
  },
  prevBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#A0AEC0',
  },
  prevBtnTextDisabled: { color: '#2A3A54' },
  btnDisabled: { opacity: 0.5 },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 54,
    gap: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  nextBtnSoft: {
    backgroundColor: '#1E3A8A',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
