import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProgressCard from '../components/ProgressCard';
import PreAssessmentBanner from '../components/PreAssessmentBanner';
import LessonAccordion from '../components/LessonAccordion';
import LockedBanner from '../components/LockedBanner';
import { useSession } from '../../../context/SessionContext';

/**
 * Quiz / LessonPlayer exist only on CoursesStack. Course Details is also mounted in HomeStack,
 * where `navigate('Quiz')` has no matching route. Target the Courses tab explicitly (see React Navigation nesting).
 */
function navigateInCoursesStack(navigation, screen, params) {
  navigation.navigate('CoursesTab', { screen, params });
}

// ─── Sample Data (replace with API response) ──────────────────────────────────

const COURSE = {
  id: '1',
  title: 'Digital Marketing Masterclass',
  tag: 'ADVANCED',
  tagColor: '#DC2626',
  image: require('../../../../assets/advanced_data_analytics.jpg'),
  progress: { completed: 9, total: 20, percentage: 45, timeLeft: '12H' },

  preAssessment: {
    id: 'pre-1',
    title: 'Level 2 Pre-Assessment',
    subtitle: 'Required to unlock Module 2',
    status: 'completed', // 'completed' | 'pending'
  },

  lessons: [
    {
      id: 'l1',
      number: 1,
      title: 'Introduction to SEO',
      defaultExpanded: true,
      contents: [
        {
          id: 'c1',
          title: 'Keyword Research Basics',
          type: 'video',
          status: 'completed',
        },
        {
          id: 'c2',
          title: 'On-Page SEO Checklist',
          type: 'document',
          status: 'completed',
        },
      ],
    },
    {
      id: 'l2',
      number: 2,
      title: 'Content Strategy',
      defaultExpanded: true,
      contents: [
        {
          id: 'c3',
          title: 'Defining Target Audience',
          type: 'video',
          status: 'current',
        },
        { id: 'c4', title: 'Module 2 Quiz', type: 'quiz', status: 'pending' },
      ],
    },
    {
      id: 'l3',
      number: 3,
      title: 'Email Marketing',
      defaultExpanded: false,
      contents: [
        {
          id: 'c5',
          title: 'Building Email Lists',
          type: 'video',
          status: 'locked',
        },
        {
          id: 'c6',
          title: 'Campaign Design Guide',
          type: 'document',
          status: 'locked',
        },
      ],
    },
    {
      id: 'l4',
      number: 4,
      title: 'Analytics & Reporting',
      defaultExpanded: false,
      contents: [
        {
          id: 'c7',
          title: 'Google Analytics Basics',
          type: 'video',
          status: 'locked',
        },
        {
          id: 'c8',
          title: 'Reporting Templates',
          type: 'document',
          status: 'locked',
        },
      ],
    },
  ],

  postAssessment: {
    id: 'post-1',
    title: 'Level 5 Post-Assessment',
    subtitle: 'Unlock after completing all modules',
    status: 'locked',
  },
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CourseDetailsScreen({ navigation, route }) {
  const { traineeId: sessionTraineeId } = useSession();
  // In real app: const course = route.params?.course ?? COURSE;
  const course = COURSE;
  const resolvedTraineeId = route?.params?.traineeId ?? sessionTraineeId;

  const handleContentPress = item => {
    if (item.type === 'quiz') {
      navigateInCoursesStack(navigation, 'Quiz', {
        quizTitle: item.title,
        courseTitle: course.title,
        traineeId: resolvedTraineeId,
      });
    } else {
      navigateInCoursesStack(navigation, 'LessonPlayer', {
        lesson: item,
        courseTitle: course.title,
      });
    }
  };

  const handlePreAssessmentPress = item => {
    navigateInCoursesStack(navigation, 'Quiz', {
      quizTitle: item.title,
      courseTitle: course.title,
      isPreAssessment: true,
      traineeId: resolvedTraineeId,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1C" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero Banner ── */}
        <ImageBackground
          source={course.image}
          style={styles.hero}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View
              style={[styles.tagBadge, { backgroundColor: course.tagColor }]}
            >
              <Text style={styles.tagText}>{course.tag}</Text>
            </View>
            <Text style={styles.heroTitle}>{course.title}</Text>
          </View>
        </ImageBackground>

        {/* ── Overall Progress ── */}
        <ProgressCard
          completed={course.progress.completed}
          total={course.progress.total}
          percentage={course.progress.percentage}
          timeLeft={course.progress.timeLeft}
        />

        {/* ── Pre-Assessment ── */}
        {course.preAssessment && (
          <PreAssessmentBanner
            item={course.preAssessment}
            onPress={handlePreAssessmentPress}
          />
        )}

        {/* ── Lessons ── */}
        {course.lessons.map(lesson => (
          <LessonAccordion
            key={lesson.id}
            lesson={lesson}
            defaultExpanded={lesson.defaultExpanded}
            onContentPress={handleContentPress}
          />
        ))}

        {/* ── Locked Post-Assessment ── */}
        {course.postAssessment && (
          <LockedBanner
            title={course.postAssessment.title}
            subtitle={course.postAssessment.subtitle}
            variant="assessment"
          />
        )}

        {/* ── Locked Certificate ── */}
        <LockedBanner title="Level 6 Certificate" variant="certificate" />
        <Text style={styles.certNote}>
          Complete the course to generate your verified certification.
        </Text>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0F1C',
  },
  scrollContent: {
    gap: 14,
    paddingBottom: 24,
  },

  // Hero
  hero: {
    height: 220,
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroImage: {
    borderRadius: 16,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,15,28,0.55)',
    borderRadius: 16,
  },
  heroContent: {
    padding: 18,
    gap: 8,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 30,
    letterSpacing: -0.3,
  },

  // Certificate note
  certNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#4A5568',
    paddingHorizontal: 24,
    marginTop: -6,
  },
});
