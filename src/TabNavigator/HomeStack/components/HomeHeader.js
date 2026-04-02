import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeHeader({
  userName,
  avatarUri,
  onQRPress,
  onSearchPress,
  onBellPress,
}) {
  return (
    <View style={styles.container}>
      {/* Left: Avatar + Title */}
      <View style={styles.left}>
        <TouchableOpacity style={styles.avatarWrapper}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>
                {userName ? userName[0].toUpperCase() : 'U'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.portalTitle}>LMS Portal</Text>
      </View>

      {/* Right: Action icons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton} onPress={onQRPress}>
          <Ionicons name="qr-code" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
          <Ionicons name="search-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onBellPress}>
          <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C2844A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  portalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1A2235',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E2A3A',
  },
});
