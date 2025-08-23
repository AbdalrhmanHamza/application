import admin from "firebase-admin";

function buildServiceAccountFromEnv() {
  // Prefer full JSON in FIREBASE_SERVICE_ACCOUNT_KEY
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      if (parsed.private_key && typeof parsed.private_key === "string") {
        parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
      }
      return parsed;
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON:", e);
    }
  }

  // Fallback: separate env vars
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (projectId && clientEmail && privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
    return {
      project_id: projectId,
      client_email: clientEmail,
      private_key: privateKey,
    };
  }
  return null;
}

if (!admin.apps.length) {
  const svc = buildServiceAccountFromEnv();
  if (svc) {
    admin.initializeApp({
      credential: admin.credential.cert(svc),
      projectId: svc.project_id || process.env.FIREBASE_PROJECT_ID,
    });
  } else {
    // Try ADC (useful on GCP). Otherwise, fail fast with a clear error.
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      console.warn(
        "Initialized Firebase Admin with application default credentials. Consider setting FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY in non-GCP environments."
      );
    } catch (e) {
      console.error(
        "Firebase Admin initialization failed: missing credentials.",
        e
      );
      throw new Error(
        "Firebase Admin not initialized. Set FIREBASE_SERVICE_ACCOUNT_KEY (full JSON) or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY."
      );
    }
  }
}

const db = admin.firestore();
const messaging = admin.messaging();

export { db, messaging };
