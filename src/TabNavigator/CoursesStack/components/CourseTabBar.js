import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TABS = ['Allocated', 'In Progress', 'Completed'];

export default function CourseTabBar({ activeTab, onTabChange }) {
  return (
    <View style={styles.container}>
      {TABS.map(tab => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => onTabChange(tab)}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2A3A',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: '15%',
    right: '15%',
    height: 2.5,
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
});
