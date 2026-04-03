/**
 * src/hooks/useVisualVerification.js
 * ====================================
 * Reusable hook that handles all background face monitoring logic.
 * Used by both LessonPlayerScreen and QuizScreen.
 *
 * What it does:
 *   1. Requests camera permission on mount.
 *   2. Acquires GPS coordinates once (reused for all snapshots in the session).
 *   3. At random intervals (between MIN and MAX seconds), captures a snapshot
 *      from the front camera and sends it to POST /verify/snapshot.
 *   4. Exposes a cameraRef the screen must attach to a hidden <CameraView>.
 *   5. Does NOT show any UI — monitoring is fully transparent to the user.
 *   6. Stops all timers on unmount to prevent memory leaks.
 *
 * Usage:
 *   const { cameraRef, cameraPermission } = useVisualVerification({
 *     traineeId: 'EMP001',
 *     triggerType: 'QUIZ_ATTEMPT',
 *     sessionId: 'some-uuid',        // optional
 *     enabled: isPlaying,            // pause monitoring when video is paused
 *   });
 *
 *   // In JSX, render the hidden camera (required for capture to work):
 *   {cameraPermission && (
 *     <CameraView ref={cameraRef} style={styles.hiddenCamera} facing="front" />
 *   )}
 */

import { useRef, useEffect, useCallback } from 'react';
import { useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { sendVerificationSnapshot } from '../api/verificationApi';

// Interval bounds for random snapshot timing (in milliseconds).
// Snapshot verification is CPU-heavy (InsightFace on-device + server verification).
// With many concurrent trainees, very small intervals (e.g. 5–10s) can overwhelm the
// backend threadpool/CPU and cause timeouts or long queues.
//
// This range is intentionally conservative for expected multi-user concurrency.
const MIN_INTERVAL_MS = 5_000; // 5 seconds
const MAX_INTERVAL_MS = 10_000; // 10 seconds

/**
 * Returns a random integer between min and max (inclusive).
 */
function randomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {object} options
 * @param {string} options.traineeId         - Employee ID of the logged-in trainee
 * @param {'RANDOM_SNAPSHOT'|'LESSON_WATCH'|'QUIZ_ATTEMPT'} options.triggerType
 * @param {string|null} [options.sessionId]  - Optional session/quiz UUID
 * @param {boolean} [options.enabled=true]   - Set false to pause monitoring
 */
export function useVisualVerification({
  traineeId,
  triggerType,
  sessionId = null,
  enabled = true,
}) {
  const cameraRef = useRef(null);
  const timerRef = useRef(null);
  const gpsRef = useRef({ lat: null, long: null });
  const isCapturingRef = useRef(false); // prevents overlapping captures

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  // ── Step 1: Request camera permission ─────────────────────────────────
  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
  }, []);

  // ── Step 2: Acquire GPS once per session ───────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        gpsRef.current = {
          lat: location.coords.latitude,
          long: location.coords.longitude,
        };
      } catch {
        // GPS failure is non-critical — snapshot still sent without coordinates
      }
    })();
  }, []);

  // ── Step 3: Capture and send a single snapshot ─────────────────────────
  const captureAndVerify = useCallback(async () => {
    // Skip if camera not ready, or a capture is already in progress
    if (!cameraRef.current || isCapturingRef.current) return;
    if (!cameraPermission?.granted) return;

    isCapturingRef.current = true;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.6, // Moderate quality — enough for face recognition
        base64: false, // We send the file URI, not base64
        skipProcessing: true, // Faster capture
        exif: false,
      });

      await sendVerificationSnapshot({
        traineeId,
        photoUri: photo.uri,
        triggerType,
        sessionId,
        gpsLat: gpsRef.current.lat,
        gpsLong: gpsRef.current.long,
      });

      // Response is intentionally not acted upon in the UI.
      // Flagged events are handled by supervisors via the web dashboard.
      // We could log to console in dev if needed:
      // console.log('[Verification]', response.verification_status);
    } catch {
      // Silently swallow errors — a failed snapshot is not shown to the trainee.
      // Network failures, camera errors etc. are non-blocking.
    } finally {
      isCapturingRef.current = false;
    }
  }, [traineeId, triggerType, sessionId, cameraPermission]);

  // ── Step 4: Schedule random interval captures ──────────────────────────
  useEffect(() => {
    if (!enabled || !cameraPermission?.granted) return;

    // Recursive scheduler — each capture schedules the next one at a new
    // random interval, so the timing is never predictable to the trainee.
    function scheduleNext() {
      const delay = randomInterval(MIN_INTERVAL_MS, MAX_INTERVAL_MS);
      timerRef.current = setTimeout(async () => {
        await captureAndVerify();
        scheduleNext(); // schedule the next one after this one completes
      }, delay);
    }

    scheduleNext();

    return () => {
      // Cleanup on unmount or when enabled changes
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, cameraPermission?.granted, captureAndVerify]);

  return {
    cameraRef,
    cameraPermission,
  };
}
