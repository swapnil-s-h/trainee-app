import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// variant: 'correct' | 'incorrect' | 'skipped'
const CONFIG = {
  correct: {
    icon: 'checkmark',
    iconBg: '#14532D',
    iconColor: '#22C55E',
    countColor: '#22C55E',
  },
  incorrect: {
    icon: 'close',
    iconBg: '#450A0A',
    iconColor: '#EF4444',
    countColor: '#EF4444',
  },
  skipped: {
    icon: 'remove',
    iconBg: '#1A2235',
    iconColor: '#718096',
    countColor: '#A0AEC0',
  },
};

export default function BreakdownRow({
  variant = 'correct',
  label,
  sublabel,
  count,
}) {
  const cfg = CONFIG[variant];

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrapper, { backgroundColor: cfg.iconBg }]}>
        <Ionicons name={cfg.icon} size={18} color={cfg.iconColor} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.sublabel}>{sublabel}</Text>
      </View>
      <Text style={[styles.count, { color: cfg.countColor }]}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 16,
    gap: 14,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sublabel: {
    fontSize: 12,
    color: '#4A5568',
  },
  count: {
    fontSize: 20,
    fontWeight: '800',
  },
});
