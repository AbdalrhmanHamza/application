"use client";

import { initializeFirebase } from "../firebase_config";
import { getDoc, doc } from "firebase/firestore";

export default async function sendNotification(uid, title, body) {
  try {
    const { db } = initializeFirebase();
    if (!db) {
      console.error("Firestore database is not initialized.");
      return { ok: false, error: "firestore-not-initialized" };
    }

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.error("User document does not exist for uid:", uid);
      return { ok: false, error: "user-not-found" };
    }

    const userData = userSnap.data();
    const fcmToken = userData?.fcmToken;

    let tokens = [];
    if (Array.isArray(fcmToken)) {
      tokens = fcmToken.filter(Boolean);
    } else if (typeof fcmToken === "string" && fcmToken.trim().length > 0) {
      tokens = [fcmToken.trim()];
    }

    if (!tokens.length) {
      console.error("FCM token is not available for uid:", uid);
      return { ok: false, error: "no-tokens" };
    }

    const res = await fetch("/api/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokens,
        title,
        body,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Error sending notification:", data || res.statusText);
      return { ok: false, status: res.status, data };
    }

    console.log("Notification dispatch result:", data);
    return { ok: true, data };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { ok: false, error: error?.message || String(error) };
  }
}
