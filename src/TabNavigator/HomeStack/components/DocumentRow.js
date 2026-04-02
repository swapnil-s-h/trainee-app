import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DocumentRow({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPress?.(item)}
      activeOpacity={0.85}
    >
      {/* Icon */}
      <View style={styles.iconWrapper}>
        <Ionicons
          name={item.icon || 'document-text-outline'}
          size={18}
          color="#2563EB"
        />
      </View>

      {/* Label */}
      <Text style={styles.label} numberOfLines={1}>
        {item.label}
      </Text>

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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#0D2247',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
  },
});
