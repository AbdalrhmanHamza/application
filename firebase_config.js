import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

let firebase = null;
let auth = null;
let db = null;
let messaging = null;

export function initializeFirebase() {
  // Check if Firebase is already initialized
  if (firebase && auth && db && messaging) {
    return { firebase, auth, db, messaging };
  }

  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    console.log("🔥 Firebase config:", {
      ...firebaseConfig,
      apiKey: firebaseConfig.apiKey
        ? `${firebaseConfig.apiKey.substring(0, 10)}...`
        : "MISSING",
    });

    // Check if any apps are already initialized
    if (getApps().length === 0) {
      firebase = initializeApp(firebaseConfig);
      console.log("✅ Firebase app initialized");
    } else {
      firebase = getApps()[0];
      console.log("✅ Using existing Firebase app");
    }

    auth = getAuth(firebase);
    db = getFirestore(firebase);

    // Only initialize messaging in browser environment
    if (typeof window !== "undefined") {
      messaging = getMessaging(firebase);
    }

    return { firebase, auth, db, messaging };
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    throw error;
  }
}

export async function generateToken() {
  const permission = await Notification.requestPermission();

  console.log("Notification permission:", permission);

  if (permission === "granted") {
    const { firebase } = initializeFirebase();
    const { auth } = initializeFirebase();
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.warn("No authenticated user when generating FCM token");
      return null;
    }

    messaging = getMessaging(firebase);
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    console.log("before generating the token");
    const token = await getToken(messaging, { vapidKey });
    console.log("FCM Token:", token);

    // Avoid duplicate writes and keep one token per device
    const prevToken =
      typeof window !== "undefined"
        ? window.localStorage.getItem("fcm_token")
        : null;

    if (prevToken === token) {
      console.log("Same FCM token as before; skipping Firestore update");
      return token;
    }

    await replaceTokenInFirestore(uid, prevToken, token);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("fcm_token", token);
    }
    return token;
  } else {
    console.log("Notification permission not granted");
    return null;
  }
}

export async function replaceTokenInFirestore(uid, oldToken, newToken) {
  const { db } = initializeFirebase();
  if (!db) {
    console.error("Firestore is not initialized");
    return;
  }
  const userRef = doc(db, "users", uid);

  try {
    if (oldToken && oldToken !== newToken) {
      await updateDoc(userRef, { fcmToken: arrayRemove(oldToken) });
      console.log("Removed old FCM token for this device");
    }
  } catch (e) {
    console.warn(
      "Failed to remove old FCM token (may not exist):",
      e?.message || e
    );
  }

  try {
    if (newToken) {
      await setDoc(
        userRef,
        { fcmToken: arrayUnion(newToken) },
        { merge: true }
      );
      console.log("FCM Token saved in Firestore");
    }
  } catch (error) {
    console.error("Error saving FCM Token in Firestore:", error);
  }
}

export async function saveTokenInFirestore(token, uid) {
  // Backward-compatible helper: ensures single token per device
  const prevToken =
    typeof window !== "undefined"
      ? window.localStorage.getItem("fcm_token")
      : null;
  if (prevToken === token) {
    console.log("Token unchanged; skipping save");
    return;
  }
  await replaceTokenInFirestore(uid, prevToken, token);
  if (typeof window !== "undefined") {
    window.localStorage.setItem("fcm_token", token);
  }
}
