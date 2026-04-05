import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = 'http://HP:8000';
// const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

async function buildUploadPart(photo, fileName) {
  if (Platform.OS === 'web') {
    const fileResponse = await fetch(photo.uri);
    const blob = await fileResponse.blob();

    return new File([blob], fileName, {
      type: blob.type || photo.type || 'image/jpeg',
    });
  }

  return {
    uri: photo.uri,
    name: fileName,
    type: photo.type || 'image/jpeg',
  };
}

export function getApiErrorMessage(error, fallbackMessage) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    const messages = detail
      .map(item => {
        if (typeof item === 'string') return item;
        if (typeof item?.msg === 'string') return item.msg;
        return null;
      })
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join(', ');
    }
  }

  if (detail && typeof detail === 'object') {
    if (typeof detail.msg === 'string' && detail.msg.trim()) {
      return detail.msg;
    }
    return JSON.stringify(detail);
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

export async function registerFace(traineeId, name, photos) {
  const formData = new FormData();
  formData.append('trainee_id', traineeId);

  if (name) {
    formData.append('name', name);
  }

  for (const [index, photo] of photos.entries()) {
    const uploadPart = await buildUploadPart(photo, `angle_${index}.jpg`);
    formData.append('photos', uploadPart);
  }

  const response = await api.post('/register/face', formData);
  return response.data;
}

export async function sendVerificationSnapshot({
  traineeId,
  photoUri,
  triggerType = 'RANDOM_SNAPSHOT',
  sessionId = null,
  gpsLat = null,
  gpsLong = null,
}) {
  const formData = new FormData();
  const uploadPart = await buildUploadPart(
    { uri: photoUri, type: 'image/jpeg' },
    'snapshot.jpg'
  );

  formData.append('photo', uploadPart);
  formData.append('trainee_id', traineeId);
  formData.append('trigger_type', triggerType);

  if (sessionId) formData.append('session_id', sessionId);
  if (gpsLat !== null) formData.append('gps_lat', String(gpsLat));
  if (gpsLong !== null) formData.append('gps_long', String(gpsLong));

  const response = await api.post('/verify/snapshot', formData);
  return response.data;
}
