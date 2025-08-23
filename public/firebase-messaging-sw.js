importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBdpPLvwyyaXMunlTCR5bm9AHJEaTdbq4Y",
  authDomain: "gala-app-70ccd.firebaseapp.com",
  projectId: "gala-app-70ccd",
  storageBucket: "gala-app-70ccd.firebasestorage.app",
  messagingSenderId: "451026366516",
  appId: "1:451026366516:web:f81879acddc36fc7f65a61",
};
console.log("Service worker Firebase config loaded");

const firebaseApp = firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  try {
    // Customize notification here
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
