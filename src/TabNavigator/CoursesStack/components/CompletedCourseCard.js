import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CompletedCourseCard({ item, onDownload }) {
  return (
    <View style={styles.card}>
      {/* Full-width image */}
      <ImageBackground
        source={item.image}
        style={styles.imageBg}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <View style={styles.imageOverlay} />
      </ImageBackground>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={13} color="#718096" />
          <Text style={styles.metaText}>Completed: {item.completedOn}</Text>
        </View>

        <View style={styles.scoreRow}>
          <Ionicons name="checkmark-circle" size={14} color="#2563EB" />
          <Text style={styles.scoreText}>Final Score: {item.score}%</Text>
        </View>

        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => onDownload?.(item)}
          activeOpacity={0.85}
        >
          <Ionicons name="download-outline" size={16} color="#FFFFFF" />
          <Text style={styles.downloadBtnText}>Download Certificate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  imageBg: {
    height: 180,
  },
  imageStyle: {},
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,15,28,0.2)',
  },
  content: {
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#718096',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 10,
    height: 46,
    gap: 8,
    marginTop: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
