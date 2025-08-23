import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, arrayUnion } from "firebase/firestore";
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

  if (permission == "granted") {
    const { firebase } = initializeFirebase();
    const { auth } = initializeFirebase();
    const uid = auth.currentUser.uid;

    messaging = getMessaging(firebase);
    const token = await getToken(messaging, {
      vapidKey:
        "BHgGaiKkhafFIBXyNiEZdMeM_NbxcCpsARxBDCbH4ak-Fu1yYH7UpXrc14Cdd2e7Mc6VL3AW8sohx95Nx_pgyj8",
    });
    console.log("FCM Token:", token);
    saveTokenInFirestore(token, uid);
    return token;
  } else {
    console.log("Notification permission not granted");
  }
}

export function saveTokenInFirestore(token, uid) {
  const { db } = initializeFirebase();
  if (!db) {
    console.error("Firestore is not initialized");
    return;
  }

  // Save the token in Firestore under the user's document
  const userRef = doc(db, "users", uid);
  setDoc(userRef, { fcmToken: arrayUnion(token) }, { merge: true })
    .then(() => {
      console.log("FCM Token saved in Firestore");
    })
    .catch((error) => {
      console.error("Error saving FCM Token in Firestore:", error);
    });
}
