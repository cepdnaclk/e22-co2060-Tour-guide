import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Auto-ensure user document exists in Firestore 'users' collection
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(
              userRef,
              {
                uid: user.uid,
                name: user.displayName || user.email?.split("@")[0] || "User",
                email: user.email || "",
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
              },
              { merge: true }
            );
          } else {
            await setDoc(
              userRef,
              { lastLoginAt: serverTimestamp() },
              { merge: true }
            );
          }
        } catch (err) {
          console.error("Error syncing user profile to Firestore:", err);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    currentUser,
    logout,
    authLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}