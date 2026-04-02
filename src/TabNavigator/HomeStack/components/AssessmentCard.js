import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AssessmentCard({ item, onAction }) {
  const isPrimary = item.variant === 'primary'; // blue filled card

  return (
    <TouchableOpacity
      style={[styles.card, isPrimary && styles.cardPrimary]}
      activeOpacity={0.85}
    >
      {/* Icon */}
      <View
        style={[styles.iconWrapper, isPrimary && styles.iconWrapperPrimary]}
      >
        <Ionicons
          name={item.icon || 'help-circle-outline'}
          size={22}
          color={isPrimary ? '#FFFFFF' : '#2563EB'}
        />
      </View>

      {/* Quiz type label */}
      <Text style={[styles.quizType, isPrimary && styles.quizTypePrimary]}>
        {item.quizType}
      </Text>

      {/* Title */}
      <Text
        style={[styles.title, isPrimary && styles.titlePrimary]}
        numberOfLines={2}
      >
        {item.title}
      </Text>

      {/* Action button */}
      <TouchableOpacity
        style={[styles.actionBtn, isPrimary && styles.actionBtnPrimary]}
        onPress={() => onAction?.(item)}
        activeOpacity={0.85}
      >
        <Text
          style={[styles.actionText, isPrimary && styles.actionTextPrimary]}
        >
          {item.actionLabel}
        </Text>
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
    gap: 10,
    justifyContent: 'space-between',
  },
  cardPrimary: {
    backgroundColor: '#1D4ED8',
    borderColor: '#2563EB',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0D2247',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperPrimary: {
    backgroundColor: '#2563EB',
  },
  quizType: {
    fontSize: 10,
    fontWeight: '700',
    color: '#718096',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  quizTypePrimary: {
    color: '#BFDBFE',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 21,
  },
  titlePrimary: {
    color: '#FFFFFF',
  },
  actionBtn: {
    backgroundColor: '#1A2235',
    borderRadius: 10,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  actionBtnPrimary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  actionTextPrimary: {
    color: '#1D4ED8',
  },
});
