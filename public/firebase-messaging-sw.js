importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js",
);

// message redirect function logic
function redirectToUrl(messageType, notification) {
  switch (messageType) {
    // chat messages are never come
    case "CHAT_MESSAGE":
      return "/";

    case "VIEW_VISIT":
    case "VISIT_CHANGES":
      return "/calendar/upcoming-visit";

    case "EXPENSE_REVIEW":
    case "EXPENSE_REJECT":
    case "EXPENSE_APPROVAL":
    case "EXPENSE_REQUEST":
      return `${notification.extraData?.id ? "/approvals/daily-expense-details/" + String(notification.extraData?.id) : null}`;

    case "LATE_CHECKIN":
    case "LATE_CHECKOUT":
    case "IDLE_TIME":
      return "/";

    case "LEAVE_REQUEST":
      return "/leave-management/leave-request";

    case "LEAVE_APPROVED":
    case "LEAVE_REJECTED":
      return "/leave-management/my-leave";
  }
}

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

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if a tab with your app is already open
        for (const client of clientList) {
          // Adjust this condition depending on how your app URLs are structured
          if (client.url.includes(self.location.origin)) {
            // Focus the existing tab
            client.focus();

            // Now navigate inside that tab (using postMessage)
            client.postMessage({ type: "navigate", url });
            return;
          }
        }

        // If no open tab, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }),
  );
});

// Optional: customize background notification handling
messaging.onBackgroundMessage(function (payload) {
  if (payload.notification) return;
  const notification = {
    title: payload?.data?.title,
    body: payload?.data?.body,
    image: payload?.data?.image,
    createdDate: new Date().toISOString(),
    extraData: payload?.data,
  };
  const title = notification.title || "New Message";
  const options = {
    body: notification.body || "",
    icon: notification.icon || "/favicon.ico",
    data: payload?.data || {},
  };
  if (
    notification.extraData?.messageType &&
    ["", "CHAT_MESSAGE"].includes(notification.extraData?.messageType)
  )
    return;
  const url = redirectToUrl(notification.extraData?.messageType, notification);
  if (url) {
    options.data.url = url;
  }
  self.registration.showNotification(title, options);
});
