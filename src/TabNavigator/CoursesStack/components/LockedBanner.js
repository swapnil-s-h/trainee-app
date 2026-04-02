import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// variant: 'assessment' | 'certificate'
export default function LockedBanner({
  title,
  subtitle,
  variant = 'assessment',
}) {
  const isCertificate = variant === 'certificate';

  return (
    <View style={[styles.banner, isCertificate && styles.bannerCertificate]}>
      <View style={styles.iconWrapper}>
        <Ionicons
          name={isCertificate ? 'trophy-outline' : 'lock-closed'}
          size={22}
          color="#4A5568"
        />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {!isCertificate && (
        <Ionicons name="lock-closed" size={16} color="#2A3A54" />
      )}
      {isCertificate && (
        <Ionicons name="lock-closed" size={16} color="#2A3A54" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1220',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1A2235',
    borderStyle: 'dashed',
    padding: 16,
    marginHorizontal: 20,
    gap: 14,
    opacity: 0.7,
  },
  bannerCertificate: {
    justifyContent: 'center',
    gap: 10,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E2A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  subtitle: {
    fontSize: 12,
    color: '#2A3A54',
  },
});
