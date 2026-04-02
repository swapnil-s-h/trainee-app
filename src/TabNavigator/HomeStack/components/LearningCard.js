import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const TAG_COLORS = {
  TECH: { bg: '#1E3A8A', text: '#60A5FA' },
  SOFT_SKILL: { bg: '#14532D', text: '#4ADE80' },
  COMPLIANCE: { bg: '#78350F', text: '#FCD34D' },
  MANAGEMENT: { bg: '#4C1D95', text: '#C4B5FD' },
};

export default function LearningCard({ item, onPress }) {
  const tagStyle = TAG_COLORS[item.tag] || TAG_COLORS.TECH;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(item)}
      activeOpacity={0.85}
    >
      {/* Thumbnail area — code snippet background */}
      <View style={styles.thumbnail}>
        <Image source={item.imageUrl} style={styles.thumbnailImage} />
        {/* Tag badge */}
        <View style={[styles.tagBadge, { backgroundColor: tagStyle.bg }]}>
          <Text style={[styles.tagText, { color: tagStyle.text }]}>
            {item.tag}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Progress */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressPercent}>{item.progress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    overflow: 'hidden',
  },
  thumbnail: {
    height: 120,
    backgroundColor: '#0D1626',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  thumbnailImage: {
    opacity: 0.7,
    height: '100%',
    width: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  content: {
    padding: 14,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 11,
    color: '#718096',
  },
  progressPercent: {
    fontSize: 11,
    color: '#A0AEC0',
    fontWeight: '600',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#1E2A3A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
});
