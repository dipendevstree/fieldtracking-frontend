import { useState, useCallback, useEffect } from "react";
import { requestFcmToken, onForegroundMessage } from "@/firebase";

export interface FcmNotification {
  title?: string;
  body?: string;
  image?: string;
  createdDate?: string;
  [key: string]: any;
}

export function useFcm(onMessage: (notification: FcmNotification) => void) {
  const [token, setToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [newNotification, setNewNotification] =
    useState<FcmNotification | null>(null);

  // ✅ Explicitly ask for permission
  const requestPermission = useCallback(async () => {
    console.log("🪄 Requesting notification permission...");
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const fcmToken = await requestFcmToken();
      if (fcmToken) {
        setToken(fcmToken);
        setPermissionGranted(true);
      } else {
        console.warn("⚠️ Failed to get FCM token");
      }
    } else {
      console.warn("🚫 Notification permission denied");
      setPermissionGranted(false);
    }
  }, []);

  // ✅ Listen for foreground messages
  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      const notification: FcmNotification = {
        title: payload.notification?.title,
        body: payload.notification?.body,
        image: payload.notification?.image,
        createdDate: new Date().toISOString(),
        extraData: payload.data
      };
      setNewNotification(notification);
      console.log("Notification Recieveed and created nofification instance:", payload, notification);
      if (onMessage) onMessage(notification);
    });

    return () => unsubscribe();
  }, [onMessage]);

  return { token, permissionGranted, newNotification, requestPermission };
}
