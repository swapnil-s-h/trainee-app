import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCRUBBER_WIDTH = SCREEN_WIDTH - 32;

// ─── Sample Data ──────────────────────────────────────────────────────────────
const LESSON = {
  title: 'Lesson 4: Advanced Architectural Principles',
  courseName: 'MASTERING THE GRID',
  totalDuration: 765, // 12:45 in seconds
  currentTime: 260, // 04:20 in seconds
  quality: '1080p',
  speed: '1.25x',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function LessonPlayerScreen({ navigation, route }) {
  const lesson = route?.params?.lesson ?? {};
  const courseTitle = route?.params?.courseTitle ?? LESSON.courseName;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(LESSON.currentTime);
  const [scrubbing, setScrubbing] = useState(false);
  const totalDuration = LESSON.totalDuration;

  // Scrubber pan responder
  const scrubberRef = useRef(null);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => setScrubbing(true),
      onPanResponderMove: (_, gestureState) => {
        const ratio = Math.max(
          0,
          Math.min(1, gestureState.moveX / SCRUBBER_WIDTH)
        );
        setCurrentTime(Math.floor(ratio * totalDuration));
      },
      onPanResponderRelease: () => setScrubbing(false),
    })
  ).current;

  const seekBy = secs => {
    setCurrentTime(t => Math.max(0, Math.min(totalDuration, t + secs)));
  };

  const scrubberProgress = currentTime / totalDuration;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

      {/* ── Top header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backCircle}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {lesson.title ?? LESSON.title}
          </Text>
          <Text style={styles.headerSub}>{courseTitle}</Text>
        </View>
      </View>

      {/* ── Video area ── */}
      <View style={styles.videoArea}>
        {/* Placeholder thumbnail / video frame */}
        <View style={styles.videoPlaceholder} />

        {/* Playback controls overlay */}
        <View style={styles.controlsOverlay}>
          {/* Rewind 10s */}
          <TouchableOpacity style={styles.seekBtn} onPress={() => seekBy(-10)}>
            <Ionicons name="play-back" size={26} color="#FFFFFF" />
            <Text style={styles.seekLabel}>10s</Text>
          </TouchableOpacity>

          {/* Play / Pause */}
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => setIsPlaying(p => !p)}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={32}
              color="#FFFFFF"
              style={isPlaying ? {} : { marginLeft: 4 }}
            />
          </TouchableOpacity>

          {/* Forward 10s */}
          <TouchableOpacity style={styles.seekBtn} onPress={() => seekBy(10)}>
            <Ionicons name="play-forward" size={26} color="#FFFFFF" />
            <Text style={styles.seekLabel}>10s</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Bottom controls ── */}
      <View style={styles.bottomControls}>
        {/* Resources + Next Lesson */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.resourcesBtn}>
            <Ionicons name="albums-outline" size={16} color="#FFFFFF" />
            <Text style={styles.resourcesBtnText}>Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>Next Lesson</Text>
            <Ionicons name="chevron-forward" size={16} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Scrubber */}
        <View style={styles.scrubberSection}>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
          </View>

          <View style={styles.scrubberTrack} {...panResponder.panHandlers}>
            <View
              style={[
                styles.scrubberFill,
                { width: `${scrubberProgress * 100}%` },
              ]}
            />
            <View
              style={[
                styles.scrubberThumb,
                { left: `${scrubberProgress * 100}%`, marginLeft: -8 },
              ]}
            />
          </View>
        </View>

        {/* Bottom row: volume, speed, quality, fullscreen */}
        <View style={styles.metaRow}>
          <TouchableOpacity>
            <Ionicons name="volume-medium-outline" size={20} color="#A0AEC0" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.speedText}>{LESSON.speed}</Text>
          </TouchableOpacity>
          <View style={styles.flex} />
          <TouchableOpacity>
            <Text style={styles.qualityText}>{LESSON.quality}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="expand-outline" size={20} color="#A0AEC0" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 14,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 3,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#718096',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  // Video
  videoArea: {
    flex: 1,
    backgroundColor: '#2A3A54',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1A2A3A',
  },
  controlsOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
  },
  seekBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  seekLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },

  // Bottom
  bottomControls: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    gap: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  resourcesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resourcesBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },

  // Scrubber
  scrubberSection: {
    gap: 8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  scrubberTrack: {
    height: 4,
    backgroundColor: '#3A3A3A',
    borderRadius: 4,
    position: 'relative',
    justifyContent: 'center',
  },
  scrubberFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  scrubberThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    top: -6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },

  // Meta row
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  flex: { flex: 1 },
  speedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  qualityText: {
    fontSize: 13,
    color: '#A0AEC0',
    fontWeight: '500',
  },
});
