"use client";

import { useContext, createContext, useState, useEffect, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getAuthInstance } from "./firebase";

const AuthContext = createContext(null);

function getDisplayName(email, fallback) {
  return fallback || email?.split("@")[0] || "User";
}

export function getFirebaseErrorMessage(error) {
  const code = error?.code || "";
  const messages = {
    "auth/invalid-email": "Invalid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  return messages[code] || error?.message || "Authentication failed.";
}

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);

  const ensureDbUser = useCallback(async (email, displayName) => {
    if (!email) return null;

    const encodedEmail = encodeURIComponent(email);
    const lookup = await fetch(`/api/users/email/${encodedEmail}`);

    if (lookup.ok) {
      const data = await lookup.json();
      setDbUser(data);
      return data;
    }

    if (lookup.status === 404) {
      const create = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          display_name: getDisplayName(email, displayName),
        }),
      });

      if (!create.ok) {
        const err = await create.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create account in database");
      }

      const data = await create.json();
      setDbUser(data);
      return data;
    }

    throw new Error("Failed to load account from database");
  }, []);

  function requireAuth() {
    const auth = getAuthInstance();
    if (!auth) {
      throw new Error(
        authError ||
          "Firebase is not configured. Check NEXT_PUBLIC_FIREBASE_* environment variables."
      );
    }
    return auth;
  }

  async function emailSignIn(email, password) {
    const auth = requireAuth();
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await ensureDbUser(
      credential.user.email,
      credential.user.displayName
    );
    return credential;
  }

  async function emailSignUp(email, password) {
    const auth = requireAuth();
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await ensureDbUser(
      credential.user.email,
      credential.user.displayName
    );
    return credential;
  }

  function firebaseSignOut() {
    setDbUser(null);
    const auth = getAuthInstance();
    if (!auth) return Promise.resolve();
    return signOut(auth);
  }

  async function getIdToken() {
    const auth = getAuthInstance();
    if (!auth?.currentUser) return null;
    return auth.currentUser.getIdToken();
  }

  useEffect(() => {
    const auth = getAuthInstance();
    if (!auth) {
      setAuthError(
        "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* variables in Vercel."
      );
      setInitializing(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser?.email) {
        try {
          await ensureDbUser(firebaseUser.email, firebaseUser.displayName);
        } catch (error) {
          console.error("Failed to sync database user:", error);
          setDbUser(null);
        }
      } else {
        setDbUser(null);
      }
      setInitializing(false);
    });

    return unsubscribe;
  }, [ensureDbUser]);

  const value = {
    user,
    dbUser,
    initializing,
    authError,
    ensureDbUser,
    emailSignIn,
    emailSignUp,
    firebaseSignOut,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within AuthContextProvider");
  }
  return context;
};
