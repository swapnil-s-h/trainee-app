import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ContentItem from './ContentItem';

export default function LessonAccordion({
  lesson,
  defaultExpanded = false,
  onContentPress,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const hasCurrentItem = lesson.contents.some(c => c.status === 'current');

  return (
    <View style={[styles.container, hasCurrentItem && styles.containerActive]}>
      {/* Accordion header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(e => !e)}
        activeOpacity={0.85}
      >
        <Text
          style={[
            styles.lessonNumber,
            hasCurrentItem && styles.lessonNumberActive,
          ]}
        >
          {String(lesson.number).padStart(2, '0')}
        </Text>
        <Text style={styles.lessonTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#718096"
        />
      </TouchableOpacity>

      {/* Content items */}
      {expanded && (
        <View style={styles.contentList}>
          {lesson.contents.map(item => (
            <ContentItem key={item.id} item={item} onPress={onContentPress} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  containerActive: {
    borderColor: '#1E3A8A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  lessonNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4A5568',
    width: 24,
  },
  lessonNumberActive: {
    color: '#2563EB',
  },
  lessonTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contentList: {
    // items render themselves with top border separators
  },
});
