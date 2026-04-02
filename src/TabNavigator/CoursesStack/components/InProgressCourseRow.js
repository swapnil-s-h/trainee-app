import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InProgressCourseRow({ item, onPress }) {
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
            <Ionicons name="ellipsis-horizontal" size={20} color="#4A5568" />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${item.progress ?? 0}%` }]}
          />
        </View>
        <Text style={styles.lastActive}>{item.lastActive}</Text>
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
    overflow: 'hidden',
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
    backgroundColor: '#1A2235',
    alignItems: 'center',
    justifyContent: 'center',
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
  lastActive: {
    fontSize: 11,
    color: '#4A5568',
    fontStyle: 'italic',
  },
});
