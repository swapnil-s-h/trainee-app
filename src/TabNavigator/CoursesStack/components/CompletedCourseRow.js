import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CompletedCourseRow({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPress?.(item)}
      activeOpacity={0.85}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailWrapper}>
        {item.image ? (
          <Image
            source={item.image}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbnailFallback}>
            <Ionicons name="checkmark-done" size={20} color="#22C55E" />
          </View>
        )}
        {/* Completed checkmark overlay */}
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          {item.score != null && (
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>Score: {item.score}%</Text>
            </View>
          )}
          <Text style={styles.completedOn}>{item.completedOn}</Text>
        </View>
      </View>

      {/* Arrow */}
      <Ionicons name="chevron-forward" size={16} color="#4A5568" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 14,
    gap: 14,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  thumbnailWrapper: {
    width: 56,
    height: 56,
    borderRadius: 10,
    overflow: 'visible',
    position: 'relative',
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  thumbnailFallback: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#0D2E1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#0A0F1C',
    borderRadius: 10,
  },
  content: {
    flex: 1,
    gap: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreBadge: {
    backgroundColor: '#14532D22',
    borderWidth: 1,
    borderColor: '#22C55E44',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  scoreText: {
    fontSize: 11,
    color: '#22C55E',
    fontWeight: '600',
  },
  completedOn: {
    fontSize: 11,
    color: '#4A5568',
    fontStyle: 'italic',
  },
});
