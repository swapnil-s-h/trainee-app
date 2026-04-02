import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TAB_CONFIG = {
  HomeTab: { icon: 'home', label: 'Home' },
  CoursesTab: { icon: 'book', label: 'Courses' },
  CommTab: { icon: 'chatbubbles', label: 'Comm' },
  ProfileTab: { icon: 'person', label: 'Profile' },
};

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const cfg = TAB_CONFIG[route.name] || {
          icon: 'ellipse',
          label: route.name,
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.75}
          >
            <Ionicons
              name={isFocused ? cfg.icon : `${cfg.icon}-outline`}
              size={22}
              color={isFocused ? '#2563EB' : '#718096'}
            />
            <Text style={[styles.label, isFocused && styles.labelActive]}>
              {cfg.label}
            </Text>
            {isFocused && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 68,
    backgroundColor: '#0A0F1C',
    borderTopWidth: 1,
    borderTopColor: '#1E2A3A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    position: 'relative',
  },
  label: {
    fontSize: 10,
    color: '#718096',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  labelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '50%',
    backgroundColor: '#2563EB',
    borderRadius: 10,
  },
});
