import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import SearchHeader from '../components/SearchHeader';
import CourseTabBar from '../components/CourseTabBar';
import AssignmentCard from '../components/AssignmentCard';
import InProgressCourseCard from '../components/InProgressCourseCard';
import CompletedCourseCard from '../components/CompletedCourseCard';

// ─── Sample Data ──────────────────────────────────────────────────────────────

const ALLOCATED_COURSES = [
  {
    id: '1',
    title: 'Cybersecurity Essentials 2024',
    tag: 'COMPLIANCE',
    duration: '2h 30m',
    level: 'Level 1',
    dueDate: 'Oct 25, 2023',
    isOverdue: true,
    image: require('../../../../assets/cyber_security_essentials.jpg'),
  },
  {
    id: '2',
    title: 'Advanced Data Analytics',
    tag: 'SKILL-BASED',
    duration: '5h 15m',
    level: 'Level 3',
    dueDate: 'Nov 12, 2023',
    isOverdue: false,
    image: require('../../../../assets/advanced_data_analytics.jpg'),
  },
  {
    id: '3',
    title: 'JavaScript Fundamentals',
    tag: 'TECH',
    duration: '3h 00m',
    level: 'Level 1',
    dueDate: 'Nov 30, 2023',
    isOverdue: false,
    image: require('../../../../assets/javascript_fundamentals.jpg'),
  },
];

const IN_PROGRESS_STATS = [
  { id: 's1', label: 'PROGRESS', value: '64%' },
  { id: 's2', label: 'SPENT', value: '42.5h' },
  { id: 's3', label: 'XP GAINED', value: '2.8k' },
];

const IN_PROGRESS_COURSES = [
  {
    id: '1',
    category: 'BUSINESS INTELLIGENCE',
    lastActive: 'Last active 2h ago',
    title: 'Advanced Data Analytics & Visualization',
    progress: 72,
    hoursLeft: '12H',
    modulesCompleted: 8,
    modulesTotal: 12,
  },
  {
    id: '2',
    category: 'DESIGN SYSTEMS',
    lastActive: 'Last active yesterday',
    title: 'Mastering UI Architecture & Components',
    progress: 45,
    hoursLeft: '18H',
    modulesCompleted: 4,
    modulesTotal: 9,
  },
  {
    id: '3',
    category: 'ENGINEERING',
    lastActive: 'Last active 3d ago',
    title: 'Scalable Microservices with Kubernetes',
    progress: 12,
    hoursLeft: '32H',
    modulesCompleted: 1,
    modulesTotal: 15,
  },
];

const COMPLETED_COURSES = [
  {
    id: '1',
    title: 'Advanced Project Management',
    completedOn: 'Oct 12, 2023',
    score: 94,
    image: require('../../../../assets/javascript_fundamentals.jpg'),
  },
  {
    id: '2',
    title: 'Leadership Essentials',
    completedOn: 'Sep 28, 2023',
    score: 88,
    image: require('../../../../assets/advanced_data_analytics.jpg'),
  },
  {
    id: '3',
    title: 'Data Analysis with Python',
    completedOn: 'Aug 15, 2023',
    score: 92,
    image: require('../../../../assets/learn_python.jpg'),
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function MiniStatCard({ label, value }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniStatLabel}>{label}</Text>
      <Text style={styles.miniStatValue}>{value}</Text>
    </View>
  );
}

// ─── Tab content ──────────────────────────────────────────────────────────────

function AllocatedTab({ navigation }) {
  return (
    <FlatList
      data={ALLOCATED_COURSES}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      ListHeaderComponent={() => (
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>New Assignments</Text>
          <View style={styles.availableBadge}>
            <Text style={styles.availableBadgeText}>
              {ALLOCATED_COURSES.length} Available
            </Text>
          </View>
        </View>
      )}
      renderItem={({ item }) => (
        <AssignmentCard
          item={item}
          onStart={() =>
            navigation.navigate('Course Details', { course: item })
          }
        />
      )}
    />
  );
}

function InProgressTab({ navigation }) {
  return (
    <FlatList
      data={IN_PROGRESS_COURSES}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      ListHeaderComponent={() => (
        <View style={styles.statsRow}>
          {IN_PROGRESS_STATS.map(s => (
            <MiniStatCard key={s.id} label={s.label} value={s.value} />
          ))}
        </View>
      )}
      renderItem={({ item }) => (
        <InProgressCourseCard
          item={item}
          onContinue={() =>
            navigation.navigate('Course Details', { course: item })
          }
        />
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={48} color="#1E2A3A" />
          <Text style={styles.emptyMsg}>No courses in progress.</Text>
        </View>
      )}
    />
  );
}

function CompletedTab() {
  const [search, setSearch] = useState('');
  const [coursesList, setCoursesList] = useState(COMPLETED_COURSES);

  const submitSearch = () => {
    const filtered = COMPLETED_COURSES.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
    setCoursesList(filtered);
  };

  return (
    <FlatList
      data={coursesList}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      ListHeaderComponent={
        <SearchHeader
          search={search}
          setSearch={setSearch}
          submitSearch={submitSearch}
        />
      }
      renderItem={({ item }) => (
        <CompletedCourseCard
          item={item}
          onDownload={() => console.log('Download:', item.title)}
        />
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={48} color="#1E2A3A" />
          <Text style={styles.emptyMsg}>No completed courses found.</Text>
        </View>
      )}
    />
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CoursesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Allocated');

  const renderTab = () => {
    switch (activeTab) {
      case 'Allocated':
        return <AllocatedTab navigation={navigation} />;
      case 'In Progress':
        return <InProgressTab navigation={navigation} />;
      case 'Completed':
        return <CompletedTab />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1C" />
      <CourseTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <View style={styles.flex}>{renderTab()}</View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0F1C' },
  flex: { flex: 1 },
  listContent: { paddingTop: 20, paddingBottom: 24 },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  availableBadge: {
    backgroundColor: '#1E3A8A',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  availableBadgeText: { fontSize: 12, fontWeight: '700', color: '#93C5FD' },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  miniStat: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 6,
  },
  miniStatLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  miniStatValue: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyMsg: { fontSize: 15, color: '#4A5568', fontWeight: '600' },
});
