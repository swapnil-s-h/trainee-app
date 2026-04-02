import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ComplianceCard({ item }) {
  const progress = Math.min(Math.max(item.percentage, 0), 100);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress / 100);

  return (
    <View style={styles.card}>
      {/* Circular gauge */}
      <View style={styles.gaugeWrapper}>
        <Svg width={54} height={54} viewBox="0 0 54 54">
          {/* Track */}
          <Circle
            cx={27}
            cy={27}
            r={RADIUS}
            stroke="#1E2A3A"
            strokeWidth={5}
            fill="transparent"
          />
          {/* Fill */}
          <Circle
            cx={27}
            cy={27}
            r={RADIUS}
            stroke="#22C55E"
            strokeWidth={5}
            fill="transparent"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin="27,27"
          />
        </Svg>
        <Text style={styles.gaugeText}>{progress}%</Text>
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>

      {/* Checkmark */}
      <View style={styles.checkWrapper}>
        <Ionicons name="checkmark-circle" size={28} color="#22C55E" />
      </View>
    </View>
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
  gaugeWrapper: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gaugeText: {
    position: 'absolute',
    fontSize: 11,
    fontWeight: '800',
    color: '#22C55E',
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#718096',
    lineHeight: 17,
  },
  checkWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
