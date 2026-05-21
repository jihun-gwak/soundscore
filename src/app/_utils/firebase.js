"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

function getFirebaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  return {
    apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

let authInstance = null;

/**
 * Lazily initializes Firebase Auth in the browser only.
 * Avoids auth/invalid-api-key during Next.js static prerender on Vercel.
 */
export function getAuthInstance() {
  if (typeof window === "undefined") {
    return null;
  }

  const config = getFirebaseConfig();
  if (!config?.apiKey) {
    return null;
  }

  if (!authInstance) {
    const app = getApps().length > 0 ? getApps()[0] : initializeApp(config);
    authInstance = getAuth(app);
  }

  return authInstance;
}

export function isFirebaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
}
