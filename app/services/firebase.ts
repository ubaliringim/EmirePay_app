import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';
import { type FirebaseAuth, type FirebaseUser, mapUser } from './firebaseTypes';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Expo Go / React Native: use the default (in-memory) persistence.
// Sessions are restored per launch via onAuthStateChanged only within the run.
const authInstance = getAuth(app);

export const firebaseAuth: FirebaseAuth = {
  signIn: async (email, password) => {
    const cred = await signInWithEmailAndPassword(authInstance, email, password);
    return mapUser(cred.user) as FirebaseUser;
  },
  signUp: async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(authInstance, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    return mapUser(cred.user) as FirebaseUser;
  },
  signOut: async () => {
    await fbSignOut(authInstance);
  },
  resetPassword: async (email) => {
    await sendPasswordResetEmail(authInstance, email);
  },
  onAuthStateChange: (cb) => {
    return onAuthStateChanged(authInstance, (user) => cb(mapUser(user)));
  },
  getCurrentUser: () => mapUser(authInstance.currentUser),
};