import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CATEGORY_COLORS = {
  'BUSINESS INTELLIGENCE': { bg: '#0D2247', text: '#60A5FA' },
  'DESIGN SYSTEMS': { bg: '#14532D', text: '#4ADE80' },
  ENGINEERING: { bg: '#78350F', text: '#FCD34D' },
  TECH: { bg: '#1E3A8A', text: '#93C5FD' },
  COMPLIANCE: { bg: '#450A0A', text: '#FCA5A5' },
  MANAGEMENT: { bg: '#4C1D95', text: '#C4B5FD' },
};

export default function InProgressCourseCard({ item, onContinue }) {
  const catStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['TECH'];

  return (
    <View style={styles.card}>
      {/* Top row: category + last active */}
      <View style={styles.topRow}>
        <View style={[styles.categoryBadge, { backgroundColor: catStyle.bg }]}>
          <Text style={[styles.categoryText, { color: catStyle.text }]}>
            {item.category}
          </Text>
        </View>
        <Text style={styles.lastActive}>{item.lastActive}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{item.title}</Text>

      {/* Progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>Course Progress</Text>
          <Text style={styles.progressPct}>{item.progress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
        </View>
      </View>

      {/* Meta: hours left + modules */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color="#718096" />
          <Text style={styles.metaText}>{item.hoursLeft} LEFT</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="albums-outline" size={14} color="#718096" />
          <Text style={styles.metaText}>
            {item.modulesCompleted}/{item.modulesTotal} MODULES
          </Text>
        </View>
      </View>

      {/* Continue button */}
      <TouchableOpacity
        style={styles.continueBtn}
        onPress={() => onContinue?.(item)}
        activeOpacity={0.85}
      >
        <Text style={styles.continueBtnText}>Continue Learning</Text>
        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 18,
    marginHorizontal: 20,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  lastActive: {
    fontSize: 11,
    color: '#4A5568',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 25,
    letterSpacing: -0.3,
  },
  progressSection: { gap: 8 },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: { fontSize: 12, color: '#718096' },
  progressPct: {
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
  metaRow: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 48,
    gap: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
