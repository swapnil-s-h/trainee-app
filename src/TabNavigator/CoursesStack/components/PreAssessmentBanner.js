import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PreAssessmentBanner({ item, onPress }) {
  const isCompleted = item.status === 'completed';

  return (
    <TouchableOpacity
      style={[styles.banner, isCompleted && styles.bannerCompleted]}
      onPress={() => !isCompleted && onPress?.(item)}
      activeOpacity={isCompleted ? 1 : 0.85}
    >
      {/* Icon */}
      <View
        style={[styles.iconWrapper, isCompleted && styles.iconWrapperCompleted]}
      >
        <Ionicons
          name={isCompleted ? 'document-text' : 'help-circle'}
          size={22}
          color="#FFFFFF"
        />
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>

      {/* Status */}
      {isCompleted ? (
        <Ionicons name="checkmark-circle" size={24} color="#2563EB" />
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#4A5568" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1626',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    padding: 14,
    marginHorizontal: 20,
    gap: 14,
  },
  bannerCompleted: {
    borderColor: '#1E3A8A',
    backgroundColor: '#0D2247',
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperCompleted: {
    backgroundColor: '#1E3A8A',
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#718096',
  },
});
