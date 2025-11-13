importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
);

// Replace with your firebase config values (only the keys needed)
const firebaseConfig = {
  apiKey: "AIzaSyDJFt-CmUF8QTsjVVAkEAWI80zjRJ9SYVk",
  authDomain: "fieldtrack360-248be.firebaseapp.com",
  projectId: "fieldtrack360-248be",
  storageBucket: "fieldtrack360-248be.firebasestorage.app",
  messagingSenderId: "586185505781",
  appId: "1:586185505781:web:c6c8fce60376636246bebc",
  measurementId: "G-RNTFQ8WQ0V",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Optional: customize background notification handling
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notification = payload.notification || {};
  const title = notification.title || "Background Message";
  const options = {
    body: notification.body || "",
    icon: notification.icon || "/favicon.ico",
    data: payload.data || {},
  };
  self.registration.showNotification(title, options);
});
