import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@lms_trainee_id';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [traineeId, setTraineeIdState] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setTraineeIdState(stored);
      } catch {
        // ignore read errors
      }
      setIsHydrated(true);
    })();
  }, []);

  const setTraineeId = useCallback(async id => {
    const trimmed = typeof id === 'string' ? id.trim() : '';
    if (!trimmed) {
      setTraineeIdState(null);
      try {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      return;
    }
    setTraineeIdState(trimmed);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, trimmed);
    } catch {
      // ignore write errors; in-memory id still applies for this session
    }
  }, []);

  const clearSession = useCallback(async () => {
    setTraineeIdState(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      traineeId,
      setTraineeId,
      clearSession,
      isHydrated,
    }),
    [traineeId, setTraineeId, clearSession, isHydrated]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return ctx;
}
