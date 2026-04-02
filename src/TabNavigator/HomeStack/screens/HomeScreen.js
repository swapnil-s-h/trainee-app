import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeHeader from '../components/HomeHeader';
import StatCard from '../components/StatCard';
import SectionHeader from '../components/SectionHeader';
import LearningCard from '../components/LearningCard';
import CertificateCard from '../components/CertificateCard';
import ComplianceCard from '../components/ComplianceCard';
import SessionCard from '../components/SessionCard';
import AssessmentCard from '../components/AssessmentCard';
import DocumentRow from '../components/DocumentRow';

// ─── Sample Data (replace with API responses) ────────────────────────────────

const USER = {
  name: 'Alex',
  weeklyGoalPercent: 75,
};

const STATS = [
  { id: '1', label: 'IN PROGRESS', value: '4', colorVariant: 'blue' },
  { id: '2', label: 'COMPLETED', value: '12', colorVariant: 'green' },
  { id: '3', label: 'AVG. SCORE', value: '88%', colorVariant: 'gold' },
];

const LEARNING_COURSES = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    tag: 'TECH',
    progress: 55,
    imageUrl: require('../../../../assets/advanced_react_patterns.jpeg'),
  },
  {
    id: '2',
    title: 'Data Science Fundamentals',
    tag: 'TECH',
    progress: 30,
    imageUrl: require('../../../../assets/data_science_fundamentals.webp'),
  },
  {
    id: '3',
    title: 'Leadership & Communication',
    tag: 'SOFT_SKILL',
    progress: 80,
    imageUrl: require('../../../../assets/leadership_and_communication.png'),
  },
  {
    id: '4',
    title: 'Workplace Safety Compliance',
    tag: 'COMPLIANCE',
    progress: 100,
    imageUrl: require('../../../../assets/workplace_safety_and_compliance.jpg'),
  },
];

const CERTIFICATES = [
  { id: '1', title: 'Safety First 2023', icon: 'ribbon', iconColor: 'gold' },
  {
    id: '2',
    title: 'React Advanced',
    icon: 'checkmark-circle',
    iconColor: 'blue',
  },
  {
    id: '3',
    title: 'AWS Cloud Basics',
    icon: 'cloud-done',
    iconColor: 'green',
  },
];

const COMPLIANCE = [
  {
    id: '1',
    percentage: 92,
    title: 'PSARA/Safety Readiness',
    subtitle: 'You are fully compliant for this month.',
  },
];

const SESSIONS = [
  {
    id: '1',
    month: 'OCT',
    day: '24',
    title: 'UX Design Workshop',
    time: '02:00 PM',
    location: 'Virtual',
    isVirtual: true,
  },
  {
    id: '2',
    month: 'OCT',
    day: '26',
    title: 'Agile Methodology Coaching',
    time: '10:30 AM',
    location: 'Room 402',
    isVirtual: false,
  },
];

const ASSESSMENTS = [
  {
    id: '1',
    quizType: 'PRE-QUIZ',
    title: 'Cloud Architecture',
    icon: 'help-circle-outline',
    actionLabel: 'Start Now',
    variant: 'primary',
  },
  {
    id: '2',
    quizType: 'POST-QUIZ',
    title: 'Effective Communication',
    icon: 'checkmark-circle',
    actionLabel: 'Review',
    variant: 'secondary',
  },
];

const DOCUMENTS = [
  {
    id: '1',
    label: 'Individual Compliance Report',
    icon: 'document-text-outline',
  },
  {
    id: '2',
    label: 'Profile Documents (CV, Aadhar, etc.)',
    icon: 'folder-open-outline',
  },
];

// ─── HomeScreen ───────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1C" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <HomeHeader
          userName={USER.name}
          onQRPress={() => {}}
          onSearchPress={() => {}}
          onBellPress={() => {}}
        />

        {/* ── Greeting ── */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Hello, {USER.name}!</Text>
          <Text style={styles.greetingSubtitle}>
            You've completed {USER.weeklyGoalPercent}% of your weekly goal.
          </Text>
        </View>

        {/* ── Stats Row ── */}
        <View style={styles.statsRow}>
          {STATS.map(stat => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              colorVariant={stat.colorVariant}
            />
          ))}
        </View>

        {/* ── My Learning ── */}
        <View style={styles.section}>
          <SectionHeader
            title="My Learning"
            onViewAll={() => navigation.navigate('My Courses')}
          />
          <FlatList
            data={LEARNING_COURSES}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hListContent}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <LearningCard
                item={item}
                onPress={() =>
                  navigation.navigate('Course Details', { course: item })
                }
              />
            )}
          />
        </View>

        {/* ── My Certificates ── */}
        <View style={styles.section}>
          <SectionHeader title="My Certificates" onViewAll={() => {}} />
          <FlatList
            data={CERTIFICATES}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hListContent}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <View style={{ width: 150 }}>
                <CertificateCard
                  item={item}
                  onDownload={() => console.log('Download:', item.title)}
                />
              </View>
            )}
          />
        </View>

        {/* ── Compliance Status ── */}
        <View style={styles.section}>
          <SectionHeader title="Compliance Status" />
          <View style={styles.paddedContent}>
            {COMPLIANCE.map(item => (
              <ComplianceCard key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* ── Upcoming Sessions ── */}
        <View style={styles.section}>
          <SectionHeader title="Upcoming Sessions" />
          <View style={[styles.paddedContent, { gap: 10 }]}>
            {SESSIONS.map(item => (
              <SessionCard key={item.id} item={item} onPress={() => {}} />
            ))}
          </View>
        </View>

        {/* ── Pending Assessments ── */}
        <View style={styles.section}>
          <SectionHeader title="Pending Assessments" />
          <View style={styles.assessmentsGrid}>
            {ASSESSMENTS.map(item => (
              <AssessmentCard
                key={item.id}
                item={item}
                onAction={() => console.log('Assessment action:', item.title)}
              />
            ))}
          </View>
        </View>

        {/* ── Reports & Documents ── */}
        <View style={styles.section}>
          <SectionHeader title="Reports & Documents" />
          <View style={[styles.paddedContent, { gap: 10 }]}>
            {DOCUMENTS.map(item => (
              <DocumentRow
                key={item.id}
                item={item}
                onPress={() => console.log('Open doc:', item.label)}
              />
            ))}
          </View>
        </View>

        {/* Bottom spacing for tab bar */}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },

  // Greeting
  greetingSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 4,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#718096',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 28,
  },

  // Sections
  section: {
    marginBottom: 28,
  },
  paddedContent: {
    paddingHorizontal: 20,
  },
  hListContent: {
    paddingHorizontal: 20,
  },

  // Assessments 2-column grid
  assessmentsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
});
