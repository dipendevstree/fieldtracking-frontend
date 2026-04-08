import { initializeApp, getApps } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  MessagePayload,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const messaging = getMessaging();

// wrapper to get token (returns token string or null)
export async function requestFcmToken(): Promise<string | null> {
  try {
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("VAPID key not set in env (VITE_FIREBASE_VAPID_KEY).");
      return null;
    }
    const currentToken = await getToken(messaging, { vapidKey });
    return currentToken ?? null;
  } catch (err: any) {
    console.error("Error while retrieving token: ", err?.message || err);
    return null;
  }
}

// expose onMessage for foreground notifications
export function onForegroundMessage(
  handler: (payload: MessagePayload) => void
) {
  return onMessage(messaging, handler);
}
