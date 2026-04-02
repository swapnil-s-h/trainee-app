import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NoticeCard from '../components/NoticeCard';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Sample Data ──────────────────────────────────────────────────────────────
const NOTICES = [
  {
    id: '1',
    iconType: 'urgent',
    title: 'Urgent: UI Design Workshop',
    sender: 'From: Alex Rivera (Lead Trainer)',
    time: '12m ago',
    body: 'The UI Design workshop scheduled for tomorrow has been moved to Room 402. Please ensure you have Figma installed on your laptops.',
    priority: 'High Priority',
    actionLabel: 'View Details',
  },
  {
    id: '2',
    iconType: 'info',
    title: 'New Course Materials Uploaded',
    sender: 'From: Learning Management System',
    time: '2h ago',
    body: "The reading list for 'Advanced Prototypes' is now available in the resource section of your dashboard.",
    priority: 'General',
    actionLabel: 'Download PDF',
  },
  {
    id: '3',
    iconType: 'result',
    title: 'Assessment Results Released',
    sender: 'From: Examination Cell',
    time: 'Yesterday',
    body: "Results for the 'Frontend Fundamentals' quiz have been published. Check your grades in the Profile tab.",
    priority: 'Important',
    actionLabel: 'View Results',
  },
  {
    id: '4',
    iconType: 'info',
    title: 'Schedule Change: Safety Training',
    sender: 'From: HR Department',
    time: '2d ago',
    body: 'The mandatory safety training has been rescheduled to next Monday at 10:00 AM. Attendance is compulsory.',
    priority: 'High Priority',
    actionLabel: 'View Details',
  },
];

const MESSAGES = [
  {
    id: 'm1',
    name: 'Jane Doe',
    role: 'Instructor',
    preview: 'Please review the updated module before our session tomorrow.',
    time: '10:30 AM',
    unread: true,
  },
  {
    id: 'm2',
    name: 'HR Admin',
    role: 'Administration',
    preview: 'Your document submission has been received and is under review.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 'm3',
    name: 'Alex Rivera',
    role: 'Lead Trainer',
    preview: 'Great work on the last quiz! Keep it up.',
    time: '2d ago',
    unread: false,
  },
];

// ─── Message Row ──────────────────────────────────────────────────────────────
function MessageRow({ item }) {
  return (
    <TouchableOpacity style={styles.msgRow} activeOpacity={0.85}>
      <View style={styles.msgAvatar}>
        <Text style={styles.msgAvatarText}>{item.name[0]}</Text>
        {item.unread && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.msgContent}>
        <View style={styles.msgTopRow}>
          <Text style={styles.msgName}>{item.name}</Text>
          <Text style={styles.msgTime}>{item.time}</Text>
        </View>
        <Text style={styles.msgRole}>{item.role}</Text>
        <Text style={styles.msgPreview} numberOfLines={1}>
          {item.preview}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function CommunicationsScreen() {
  const [activeTab, setActiveTab] = useState('Notices');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1C" />

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="menu" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Communications</Text>
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name="search-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name="notifications-outline" size={18} color="#FFFFFF" />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Tab switcher ── */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === 'Notices' && styles.tabBtnActive,
          ]}
          onPress={() => setActiveTab('Notices')}
          activeOpacity={0.85}
        >
          <Ionicons
            name="megaphone-outline"
            size={15}
            color={activeTab === 'Notices' ? '#FFFFFF' : '#718096'}
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'Notices' && styles.tabBtnTextActive,
            ]}
          >
            Notices
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === 'Messages' && styles.tabBtnActive,
          ]}
          onPress={() => setActiveTab('Messages')}
          activeOpacity={0.85}
        >
          <Ionicons
            name="chatbubble-outline"
            size={15}
            color={activeTab === 'Messages' ? '#FFFFFF' : '#718096'}
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'Messages' && styles.tabBtnTextActive,
            ]}
          >
            Messages
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Content ── */}
      {activeTab === 'Notices' ? (
        <FlatList
          data={NOTICES}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListHeaderComponent={() => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>RECENT NOTICES</Text>
              <TouchableOpacity>
                <Text style={styles.markAllRead}>Mark all as read</Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item }) => (
            <NoticeCard item={item} onAction={() => {}} />
          )}
        />
      ) : (
        <FlatList
          data={MESSAGES}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.msgDivider} />}
          ListHeaderComponent={() => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>DIRECT MESSAGES</Text>
            </View>
          )}
          renderItem={({ item }) => <MessageRow item={item} />}
        />
      )}

      {/* ── FAB ── */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0F1C' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  menuBtn: { padding: 2 },
  screenTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  topActions: { flexDirection: 'row', gap: 10 },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1A2235',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#0A0F1C',
  },

  // Tab switcher
  tabSwitcher: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 11,
    borderRadius: 9,
  },
  tabBtnActive: {
    backgroundColor: '#2563EB',
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },

  // List
  listContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 1.2,
  },
  markAllRead: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },

  // Messages
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  msgAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  msgAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#0A0F1C',
  },
  msgContent: { flex: 1, gap: 4 },
  msgTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  msgName: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  msgTime: { fontSize: 11, color: '#4A5568' },
  msgRole: { fontSize: 11, color: '#718096' },
  msgPreview: { fontSize: 13, color: '#718096', lineHeight: 18 },
  msgDivider: {
    height: 1,
    backgroundColor: '#111827',
    marginHorizontal: 20,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
});
