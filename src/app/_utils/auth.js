"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [dbUser, setDbUser] = useState();

  async function fetchDbUser(email) {
    try {
      const encodedEmail = encodeURIComponent(email);
      const response = await fetch(`/api/users/email/${encodedEmail}`);
      if (response.ok) {
        const data = await response.json();
        setDbUser(data);
      } else {
        console.error("Failed to fetch database user");
        setDbUser(null);
      }
    } catch (error) {
      console.error("Error fetching database user:", error);
      setDbUser(null);
    }
  }

  function emailSignIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function emailSignUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function firebaseSignOut() {
    setDbUser(null);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchDbUser(user.email);
      } else {
        setDbUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
    dbUser,
    emailSignIn,
    emailSignUp,
    firebaseSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
