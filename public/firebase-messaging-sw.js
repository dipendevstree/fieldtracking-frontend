importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
);

// Replace with your firebase config values (only the keys needed)
const firebaseConfig = {
  apiKey: "AIzaSyBIIFesNWVQaRNKr61KJMfjQkD_iSs6niQ",
  authDomain: "fieldtrack360-e4a13.firebaseapp.com",
  projectId: "fieldtrack360-e4a13",
  storageBucket: "fieldtrack360-e4a13.firebasestorage.app",
  messagingSenderId: "428880598590",
  appId: "1:428880598590:web:e779212185f294895fa36f",
  measurementId: "G-KS28JW7WYZ",
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
