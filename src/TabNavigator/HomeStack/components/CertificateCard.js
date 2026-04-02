import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ICON_COLORS = {
  gold: { bg: '#2A1F08', icon: '#F59E0B' },
  blue: { bg: '#0D2247', icon: '#2563EB' },
  green: { bg: '#0D2E1A', icon: '#22C55E' },
};

export default function CertificateCard({ item, onDownload }) {
  const iconStyle = ICON_COLORS[item.iconColor] || ICON_COLORS.blue;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85}>
      {/* Icon */}
      <View style={[styles.iconWrapper, { backgroundColor: iconStyle.bg }]}>
        <Ionicons
          name={item.icon || 'ribbon'}
          size={28}
          color={iconStyle.icon}
        />
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      {/* Download */}
      <TouchableOpacity
        style={styles.downloadBtn}
        onPress={() => onDownload?.(item)}
      >
        <Ionicons name="arrow-down-circle-outline" size={14} color="#2563EB" />
        <Text style={styles.downloadText}>Download</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 18,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  downloadText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
});
