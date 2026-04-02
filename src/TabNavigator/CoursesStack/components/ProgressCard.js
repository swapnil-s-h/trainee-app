import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProgressCard({
  completed,
  total,
  percentage,
  timeLeft,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.label}>Overall Progress</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.lessonsText}>
          {completed} of {total} lessons completed
        </Text>
        {timeLeft && (
          <View style={styles.timeLeftBadge}>
            <Ionicons name="time" size={12} color="#EF4444" />
            <Text style={styles.timeLeftText}>{timeLeft} LEFT</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 18,
    marginHorizontal: 20,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  percentage: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#1E2A3A',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonsText: {
    fontSize: 12,
    color: '#718096',
  },
  timeLeftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeLeftText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
});
