import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';

import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '../../../context/SessionContext';

// ─── Constants ────────────────────────────────────────────────────────────────
const RADIUS = 46;
const STROKE = 8;
const CIRC = 2 * Math.PI * RADIUS;
const SVG_SZ = (RADIUS + STROKE) * 2 + 4;

// ─── Sample data (replace with API) ──────────────────────────────────────────
const USER = {
  name: 'Vikram Sethi',
  empId: 'EMP-1024',
  role: 'Senior Security Lead',
  location: 'Gurugram Campus, North Region',
  verified: true,
  psaraReady: 75,
  psaraNote:
    'Profile is nearly compliant. 1 mandatory document pending verification.',
  designation: 'Senior Security Lead',
  department: 'Operations & Safety',
  joiningDate: '12 Mar 2022',
  gender: 'Male',
  email: 'v.sethi@enterprise.com',
  mobile: '+91 98765 43210',
};

const CHECKLIST = [
  {
    id: 'c1',
    label: 'Physical Training',
    icon: 'fitness-outline',
    status: 'COMPLETED',
  },
  {
    id: 'c2',
    label: 'First Aid Certification',
    icon: 'medkit-outline',
    status: 'IN-PROGRESS',
  },
  {
    id: 'c3',
    label: 'Firefighting Knowledge',
    icon: 'flame-outline',
    status: 'PENDING',
  },
];

const DOCUMENTS = [
  {
    id: 'd1',
    label: 'Curriculum Vitae',
    icon: 'document-text-outline',
    statusLabel: 'VERIFIED',
    statusColor: '#22C55E',
  },
  {
    id: 'd2',
    label: 'Police Verification',
    icon: 'shield-checkmark-outline',
    statusLabel: 'PENDING APPROVAL',
    statusColor: '#F59E0B',
  },
];

const TRAINING_HISTORY = [
  {
    id: 't1',
    title: 'Industrial Safety Protocols',
    subtitle: 'Mandatory Compliance • 12 Modules',
    status: 'PASSED',
    score: '92/100',
    completion: 'Oct 14, 2023',
  },
  {
    id: 't2',
    title: 'First Aid Responder Level 2',
    subtitle: 'Emergency Services • 8 Modules',
    status: 'PASSED',
    score: '85/100',
    completion: 'Sep 28, 2023',
  },
];

const VERIFICATION_LOG = [
  {
    id: 'v1',
    date: '22 Oct 2023, 11:45 AM',
    status: 'Approved',
    statusColor: '#22C55E',
    remark: 'ID proof matched correctly.',
  },
  {
    id: 'v2',
    date: '19 Oct 2023, 03:20 PM',
    status: 'Rejected',
    statusColor: '#EF4444',
    remark: 'Low image quality, blurry face.',
  },
  {
    id: 'v3',
    date: '18 Oct 2023, 09:12 AM',
    status: 'Resubmitted',
    statusColor: '#F59E0B',
    remark: 'New photo upload via portal.',
  },
];

const STATUS_BADGE = {
  COMPLETED: { bg: '#14532D', text: '#4ADE80' },
  'IN-PROGRESS': { bg: '#1E3A8A', text: '#93C5FD' },
  PENDING: { bg: '#78350F', text: '#FCD34D' },
};

function getRootNavigator(nav) {
  const parent = nav.getParent();
  return parent ? getRootNavigator(parent) : nav;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, icon, children, headerRight }) {
  return (
    <View style={sc.card}>
      <View style={sc.header}>
        <View style={sc.titleRow}>
          <Ionicons name={icon} size={16} color="#2563EB" />
          <Text style={sc.title}>{title}</Text>
        </View>
        {headerRight}
      </View>
      {children}
    </View>
  );
}
const sc = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 18,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
});

function InfoField({ label, value }) {
  return (
    <View style={infoStyles.field}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}
const infoStyles = StyleSheet.create({
  field: { gap: 3 },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  value: { fontSize: 13, color: '#E2E8F0', fontWeight: '500' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }) {
  const { clearSession } = useSession();
  const strokeDashoffset = CIRC * (1 - USER.psaraReady / 100);

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await clearSession();
          getRootNavigator(navigation).dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Landing' }],
            })
          );
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1C" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Identity card ── */}
        <View style={styles.identityCard}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>{USER.name[0]}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
            </View>
          </View>

          {/* Info */}
          <View style={styles.identityInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{USER.name}</Text>
              <View style={styles.verifiedTag}>
                <Text style={styles.verifiedTagText}>VERIFIED</Text>
              </View>
            </View>
            <Text style={styles.empId}>{USER.empId}</Text>
            <Text style={styles.userRole}>{USER.role}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={12} color="#718096" />
              <Text style={styles.locationText}>{USER.location}</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionBtns}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="refresh-outline" size={13} color="#A0AEC0" />
              <Text style={styles.actionBtnText}>Reset Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnRed]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={13} color="#FFFFFF" />
              <Text style={[styles.actionBtnText, styles.actionBtnTextRed]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── PSARA Readiness ── */}
        <SectionCard title="PSARA Readiness" icon="shield-outline">
          <View style={styles.psaraRow}>
            <View style={styles.gaugeWrapper}>
              <Svg width={SVG_SZ} height={SVG_SZ}>
                <Circle
                  cx={SVG_SZ / 2}
                  cy={SVG_SZ / 2}
                  r={RADIUS}
                  stroke="#1E2A3A"
                  strokeWidth={STROKE}
                  fill="transparent"
                />
                <Circle
                  cx={SVG_SZ / 2}
                  cy={SVG_SZ / 2}
                  r={RADIUS}
                  stroke="#2563EB"
                  strokeWidth={STROKE}
                  fill="transparent"
                  strokeDasharray={CIRC}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin={`${SVG_SZ / 2},${SVG_SZ / 2}`}
                />
              </Svg>
              <View style={styles.gaugeCenter}>
                <Text style={styles.gaugeValue}>{USER.psaraReady}%</Text>
                <Text style={styles.gaugeLabel}>READY</Text>
              </View>
            </View>
          </View>
          <Text style={styles.psaraNote}>
            {USER.psaraNote.split('mandatory')[0]}
            <Text style={styles.psaraHighlight}>mandatory</Text>
            {USER.psaraNote.split('mandatory')[1]}
          </Text>
        </SectionCard>

        {/* ── Personal Information ── */}
        <SectionCard title="Personal Information" icon="person-outline">
          <View style={styles.infoGrid}>
            <InfoField label="Designation" value={USER.designation} />
            <InfoField label="Department" value={USER.department} />
            <InfoField label="Joining Date" value={USER.joiningDate} />
            <InfoField label="Gender" value={USER.gender} />
          </View>
          <View style={styles.infoDivider} />
          <InfoField label="Email" value={USER.email} />
          <InfoField label="Mobile" value={USER.mobile} />
        </SectionCard>

        {/* ── PSARA Mandatory Checklist ── */}
        <SectionCard
          title="PSARA Mandatory Checklist"
          icon="checkmark-circle-outline"
        >
          {CHECKLIST.map(item => {
            const badge = STATUS_BADGE[item.status] || STATUS_BADGE.PENDING;
            return (
              <View key={item.id} style={styles.checklistRow}>
                <View style={styles.checklistIconWrapper}>
                  <Ionicons name={item.icon} size={18} color="#2563EB" />
                </View>
                <Text style={styles.checklistLabel}>{item.label}</Text>
                <View
                  style={[styles.statusBadge, { backgroundColor: badge.bg }]}
                >
                  <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            );
          })}
        </SectionCard>

        {/* ── Mandatory Documents ── */}
        <SectionCard
          title="Mandatory Documents"
          icon="folder-outline"
          headerRight={
            <TouchableOpacity>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          }
        >
          {DOCUMENTS.map(doc => (
            <View key={doc.id} style={styles.docRow}>
              <Ionicons name={doc.icon} size={20} color="#2563EB" />
              <View style={styles.docInfo}>
                <Text style={styles.docLabel}>{doc.label}</Text>
                <Text style={[styles.docStatus, { color: doc.statusColor }]}>
                  ● {doc.statusLabel}
                </Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="download-outline" size={20} color="#4A5568" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.uploadDocBtn}>
            <Text style={styles.uploadDocBtnText}>Upload New Document</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* ── Training History ── */}
        <SectionCard title="Detailed Training History" icon="library-outline">
          {TRAINING_HISTORY.map(t => (
            <View key={t.id} style={styles.historyItem}>
              <View style={styles.historyTopRow}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>{t.title}</Text>
                  <Text style={styles.historySub}>{t.subtitle}</Text>
                </View>
                <View style={styles.passedBadge}>
                  <Text style={styles.passedBadgeText}>{t.status}</Text>
                </View>
              </View>
              <View style={styles.historyMeta}>
                <View style={styles.historyMetaItem}>
                  <Text style={styles.historyMetaLabel}>FINAL SCORE</Text>
                  <Text style={styles.historyMetaValue}>{t.score}</Text>
                </View>
                <View style={styles.historyMetaItem}>
                  <Text style={styles.historyMetaLabel}>COMPLETION</Text>
                  <Text style={styles.historyMetaValue}>{t.completion}</Text>
                </View>
                <TouchableOpacity style={styles.viewCertBtn}>
                  <Ionicons name="ribbon-outline" size={12} color="#2563EB" />
                  <Text style={styles.viewCertText}>View Certificate</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.historyDivider} />
            </View>
          ))}
          <TouchableOpacity style={styles.loadMoreBtn}>
            <Text style={styles.loadMoreText}>Load More History</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* ── Verification Status Log ── */}
        <SectionCard
          title="Verification Status Log (Photo)"
          icon="camera-outline"
        >
          {/* Table header */}
          <View style={styles.logHeader}>
            <Text style={[styles.logHeaderCell, { flex: 1.4 }]}>
              DATE & TIME
            </Text>
            <Text style={[styles.logHeaderCell, { flex: 0.9 }]}>STATUS</Text>
            <Text style={[styles.logHeaderCell, { flex: 1.5 }]}>REMARKS</Text>
          </View>
          {VERIFICATION_LOG.map(log => (
            <View key={log.id} style={styles.logRow}>
              <Text style={[styles.logCell, { flex: 1.4 }]}>{log.date}</Text>
              <Text
                style={[
                  styles.logCell,
                  { flex: 0.9, color: log.statusColor, fontWeight: '700' },
                ]}
              >
                {log.status}
              </Text>
              <Text style={[styles.logCell, { flex: 1.5 }]}>{log.remark}</Text>
            </View>
          ))}
        </SectionCard>

        {/* ── Footer meta ── */}
        <View style={styles.footerMeta}>
          {[
            ['Created Date', 'Mar 10, 2022'],
            ['Last Login', 'Today, 08:32 AM'],
            ['Device Type', 'Chrome (Win 11)'],
            ['IP Address', '192.168.1.104'],
          ].map(([label, value]) => (
            <View key={label} style={styles.footerRow}>
              <Text style={styles.footerLabel}>{label}</Text>
              <Text style={styles.footerValue}>{value}</Text>
            </View>
          ))}
          <Text style={styles.footerCopyright}>
            © 2023 Enterprise Learning Management System. Internal Administrator
            Portal.
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0F1C' },
  scrollContent: { padding: 16, gap: 16 },

  // Identity card
  identityCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 18,
    gap: 14,
  },
  avatarWrapper: { position: 'relative', width: 64, height: 64 },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 26, fontWeight: '800', color: '#FFFFFF' },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    backgroundColor: '#0A0F1C',
    borderRadius: 10,
  },
  identityInfo: { gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  userName: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  verifiedTag: {
    backgroundColor: '#14532D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4ADE80',
    letterSpacing: 0.8,
  },
  empId: { fontSize: 12, color: '#718096', fontWeight: '600' },
  userRole: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 11, color: '#718096' },
  actionBtns: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A2235',
    borderRadius: 9,
    height: 38,
    gap: 6,
    borderWidth: 1,
    borderColor: '#1E2A3A',
  },
  actionBtnRed: { backgroundColor: '#FA5043', borderColor: '#FA5043' },
  actionBtnText: { fontSize: 12, fontWeight: '600', color: '#A0AEC0' },
  actionBtnTextRed: { color: '#FFFFFF' },

  // PSARA
  psaraRow: { alignItems: 'center' },
  gaugeWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeCenter: { position: 'absolute', alignItems: 'center', gap: 1 },
  gaugeValue: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  gaugeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 1,
  },
  psaraNote: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 18,
  },
  psaraHighlight: { color: '#EF4444', fontWeight: '700' },

  // Info grid
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoDivider: { height: 1, backgroundColor: '#1E2A3A' },

  // Checklist
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1626',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1A2235',
    padding: 14,
    gap: 12,
  },
  checklistIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0D2247',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistLabel: {
    flex: 1,
    fontSize: 13,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  statusBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },

  // Documents
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1626',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1A2235',
    padding: 14,
    gap: 12,
  },
  docInfo: { flex: 1, gap: 3 },
  docLabel: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  docStatus: { fontSize: 11, fontWeight: '600' },
  uploadDocBtn: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadDocBtnText: { fontSize: 13, color: '#2563EB', fontWeight: '600' },

  // Training history
  historyItem: { gap: 10 },
  historyTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  historyInfo: { flex: 1, gap: 3 },
  historyTitle: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  historySub: { fontSize: 11, color: '#718096' },
  passedBadge: {
    backgroundColor: '#14532D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  passedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4ADE80',
    letterSpacing: 0.6,
  },
  historyMeta: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  historyMetaItem: { gap: 2 },
  historyMetaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.6,
  },
  historyMetaValue: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  viewCertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  viewCertText: { fontSize: 11, color: '#2563EB', fontWeight: '600' },
  historyDivider: { height: 1, backgroundColor: '#1E2A3A' },
  loadMoreBtn: { alignItems: 'center', paddingVertical: 8 },
  loadMoreText: { fontSize: 13, color: '#2563EB', fontWeight: '600' },

  // Verification log
  logHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2A3A',
  },
  logHeaderCell: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  logRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0D1626',
  },
  logCell: { fontSize: 11, color: '#718096', lineHeight: 16 },

  // Footer
  footerMeta: { gap: 6, paddingTop: 4 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  footerLabel: { fontSize: 11, color: '#4A5568' },
  footerValue: { fontSize: 11, color: '#718096' },
  footerCopyright: {
    fontSize: 10,
    color: '#2A3A54',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 15,
  },

  // Shared
  viewAllLink: { fontSize: 12, color: '#2563EB', fontWeight: '600' },
});
