import { initializeApp, getApps } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  MessagePayload,
} from "firebase/messaging";
import { ENV } from "./config/env";

const firebaseConfig = {
  apiKey: ENV.FIREBASE.API_KEY,
  authDomain: ENV.FIREBASE.AUTH_DOMAIN,
  projectId: ENV.FIREBASE.PROJECT_ID,
  storageBucket: ENV.FIREBASE.STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE.MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE.APP_ID,
  measurementId: ENV.FIREBASE.MEASUREMENT_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const messaging = getMessaging();

// wrapper to get token (returns token string or null)
export async function requestFcmToken(): Promise<string | null> {
  try {
    const vapidKey = ENV.FIREBASE.VAPID_KEY;
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
  handler: (payload: MessagePayload) => void,
) {
  return onMessage(messaging, handler);
}
