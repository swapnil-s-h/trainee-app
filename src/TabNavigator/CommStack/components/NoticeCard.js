import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIORITY_STYLES = {
  'High Priority': { bg: '#450A0A', text: '#EF4444' },
  Important: { bg: '#14532D', text: '#22C55E' },
  General: { bg: '#1E2A3A', text: '#718096' },
};

const ICON_STYLES = {
  urgent: { bg: '#7F1D1D', icon: 'warning', color: '#FCA5A5' },
  info: { bg: '#1E3A8A', icon: 'information-circle', color: '#93C5FD' },
  result: { bg: '#14532D', icon: 'checkmark-circle', color: '#4ADE80' },
};

export default function NoticeCard({ item, onAction }) {
  const iconCfg = ICON_STYLES[item.iconType] || ICON_STYLES.info;
  const priorityCfg =
    PRIORITY_STYLES[item.priority] || PRIORITY_STYLES['General'];

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: iconCfg.bg }]}>
          <Ionicons name={iconCfg.icon} size={20} color={iconCfg.color} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.sender}>{item.sender}</Text>
        </View>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      {/* Body */}
      <Text style={styles.body}>{item.body}</Text>

      {/* Footer */}
      <View style={styles.footer}>
        <View
          style={[styles.priorityBadge, { backgroundColor: priorityCfg.bg }]}
        >
          <Text style={[styles.priorityText, { color: priorityCfg.text }]}>
            {item.priority}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onAction?.(item)}>
          <Text style={styles.actionLink}>{item.actionLabel}</Text>
        </TouchableOpacity>
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
    padding: 16,
    gap: 12,
    marginHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 19,
  },
  sender: {
    fontSize: 12,
    color: '#718096',
  },
  time: {
    fontSize: 11,
    color: '#4A5568',
    fontWeight: '500',
    flexShrink: 0,
  },
  body: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionLink: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },
});
