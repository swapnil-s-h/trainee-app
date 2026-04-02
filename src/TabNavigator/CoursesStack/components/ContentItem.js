import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// status: 'completed' | 'current' | 'pending' | 'locked'
// type: 'video' | 'document' | 'quiz'

const TYPE_ICONS = {
  video: 'play-circle',
  document: 'document-text-outline',
  quiz: 'help-circle-outline',
};

const STATUS_CONFIG = {
  completed: { icon: 'checkmark-circle', color: '#22C55E' },
  current: { icon: 'radio-button-on', color: '#2563EB' },
  pending: { icon: 'ellipse-outline', color: '#4A5568' },
  locked: { icon: 'lock-closed', color: '#4A5568' },
};

export default function ContentItem({ item, onPress }) {
  const isLocked = item.status === 'locked';
  const isCurrent = item.status === 'current';
  const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
  const typeIcon = TYPE_ICONS[item.type] || TYPE_ICONS.document;

  return (
    <TouchableOpacity
      style={[styles.row, isCurrent && styles.rowCurrent]}
      onPress={() => !isLocked && onPress?.(item)}
      activeOpacity={isLocked ? 1 : 0.85}
    >
      {/* Type icon */}
      <Ionicons
        name={typeIcon}
        size={20}
        color={isCurrent ? '#2563EB' : isLocked ? '#2A3A54' : '#A0AEC0'}
      />

      {/* Text */}
      <View style={styles.textBlock}>
        {isCurrent && <Text style={styles.currentLabel}>Current Lesson</Text>}
        <Text
          style={[
            styles.title,
            isLocked && styles.titleLocked,
            isCurrent && styles.titleCurrent,
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
      </View>

      {/* Status icon */}
      <Ionicons name={statusCfg.icon} size={20} color={statusCfg.color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#1A2235',
  },
  rowCurrent: {
    backgroundColor: '#0D1626',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  currentLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E2E8F0',
  },
  titleLocked: {
    color: '#2A3A54',
  },
  titleCurrent: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
