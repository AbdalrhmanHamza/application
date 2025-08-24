importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  messagingSenderId: "451026366516",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  try {
    const notificationTitle = payload.notification?.title || "New Message";
    const notificationOptions = {
      body: payload.notification?.body || "You have a new message",
      icon: payload.notification?.icon || "/favicon.ico",
      badge: "/favicon.ico",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  } catch (error) {
    console.error(
      "[firebase-messaging-sw.js] Error showing notification:",
      error
    );
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // Open your website when user clicks the notification
  event.waitUntil(clients.openWindow("https://yourwebsite.com"));
});
