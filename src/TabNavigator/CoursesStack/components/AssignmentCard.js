import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Tag styles map
const TAG_STYLES = {
  COMPLIANCE: { bg: '#1E2A3A', text: '#E2E8F0' },
  'SKILL-BASED': { bg: '#1E2A3A', text: '#E2E8F0' },
  TECH: { bg: '#1E3A8A', text: '#93C5FD' },
  MANAGEMENT: { bg: '#4C1D95', text: '#C4B5FD' },
};

export default function AssignmentCard({ item, onStart }) {
  const tagStyle = TAG_STYLES[item.tag] || TAG_STYLES.COMPLIANCE;
  const isOverdue = item.isOverdue;

  return (
    <View style={styles.card}>
      {/* Image with tag badge overlay */}
      <ImageBackground
        source={item.image}
        style={styles.imageBg}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        {/* Dark gradient overlay */}
        <View style={styles.imageOverlay} />
        <View style={[styles.tagBadge, { backgroundColor: tagStyle.bg }]}>
          <Text style={[styles.tagText, { color: tagStyle.text }]}>
            {item.tag}
          </Text>
        </View>
      </ImageBackground>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>

        {/* Duration + Level */}
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color="#718096" />
          <Text style={styles.metaText}>{item.duration}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{item.level}</Text>
        </View>

        {/* Due date + Start button */}
        <View style={styles.footer}>
          <View style={styles.dueDateBlock}>
            <Text style={styles.dueDateLabel}>DUE DATE</Text>
            <Text
              style={[styles.dueDateValue, isOverdue && styles.dueDateOverdue]}
            >
              {item.dueDate}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => onStart?.(item)}
            activeOpacity={0.85}
          >
            <Text style={styles.startBtnText}>Start Course</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  imageBg: {
    height: 190,
    justifyContent: 'flex-start',
  },
  imageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 15, 28, 0.25)',
  },
  tagBadge: {
    margin: 14,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  content: {
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#718096',
  },
  metaDot: {
    fontSize: 13,
    color: '#4A5568',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  dueDateBlock: {
    gap: 3,
  },
  dueDateLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dueDateValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dueDateOverdue: {
    color: '#EF4444',
  },
  startBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  startBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
