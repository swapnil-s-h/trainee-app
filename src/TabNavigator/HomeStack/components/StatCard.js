import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ACCENT_COLORS = {
  blue: {
    bg: '#0D2247',
    border: '#1E3A8A',
    label: '#4A90D9',
    value: '#FFFFFF',
  },
  green: {
    bg: '#0D2E1A',
    border: '#166534',
    label: '#4ADE80',
    value: '#FFFFFF',
  },
  gold: {
    bg: '#2A1F08',
    border: '#78530A',
    label: '#D4A017',
    value: '#FFFFFF',
  },
};

export default function StatCard({ label, value, colorVariant = 'blue' }) {
  const colors = ACCENT_COLORS[colorVariant] || ACCENT_COLORS.blue;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.bg, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.label, { color: colors.label }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.value }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: 'space-between',
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
