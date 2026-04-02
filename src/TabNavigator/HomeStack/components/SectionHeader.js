import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SectionHeader({ title, onViewAll }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  viewAll: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },
});
