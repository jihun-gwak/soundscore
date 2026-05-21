"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getAuthInstance } from "./firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [dbUser, setDbUser] = useState();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  async function fetchDbUser(email) {
    try {
      const encodedEmail = encodeURIComponent(email);
      const response = await fetch(`/api/users/email/${encodedEmail}`);
      if (response.ok) {
        const data = await response.json();
        setDbUser(data);
      } else {
        setDbUser(null);
      }
    } catch (error) {
      console.error("Error fetching database user:", error);
      setDbUser(null);
    }
  }

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

  function emailSignIn(email, password) {
    return signInWithEmailAndPassword(requireAuth(), email, password);
  }

  function emailSignUp(email, password) {
    return createUserWithEmailAndPassword(requireAuth(), email, password);
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
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        fetchDbUser(firebaseUser.email);
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    dbUser,
    authError,
    emailSignIn,
    emailSignUp,
    firebaseSignOut,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
