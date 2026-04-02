import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SessionCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(item)}
      activeOpacity={0.85}
    >
      {/* Date block */}
      <View style={styles.dateBlock}>
        <Text style={styles.dateMonth}>{item.month}</Text>
        <Text style={styles.dateDay}>{item.day}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={12} color="#718096" />
          <Text style={styles.metaText}>{item.time}</Text>
          <Ionicons
            name={item.isVirtual ? 'globe-outline' : 'location-outline'}
            size={12}
            color="#718096"
          />
          <Text style={styles.metaText}>{item.location}</Text>
        </View>
      </View>

      {/* Arrow */}
      <View style={styles.chevron}>
        <Ionicons name="chevron-forward" size={16} color="#718096" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  dateBlock: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A2235',
    borderRadius: 10,
    paddingVertical: 8,
    gap: 2,
  },
  dateMonth: {
    fontSize: 9,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: '#718096',
    marginRight: 6,
  },
  chevron: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#1A2235',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
