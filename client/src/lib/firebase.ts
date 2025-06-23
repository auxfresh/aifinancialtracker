import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import type { User } from "@shared/schema";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth functions
export const registerUser = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });
  return userCredential.user;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

// Firestore collections
export const COLLECTIONS = {
  TRANSACTIONS: "transactions",
  BUDGETS: "budgets",
  CATEGORIES: "categories",
} as const;

// Transaction functions
export const addTransaction = async (transaction: any) => {
  const docRef = await addDoc(collection(db, COLLECTIONS.TRANSACTIONS), {
    ...transaction,
    createdAt: new Date(),
  });
  return docRef.id;
};

export const getUserTransactions = async (userId: string) => {
  const q = query(
    collection(db, COLLECTIONS.TRANSACTIONS),
    where("userId", "==", userId),
    orderBy("date", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateTransaction = async (id: string, data: any) => {
  const docRef = doc(db, COLLECTIONS.TRANSACTIONS, id);
  await updateDoc(docRef, data);
};

export const deleteTransaction = async (id: string) => {
  const docRef = doc(db, COLLECTIONS.TRANSACTIONS, id);
  await deleteDoc(docRef);
};

// Budget functions
export const addBudget = async (budget: any) => {
  const docRef = await addDoc(collection(db, COLLECTIONS.BUDGETS), {
    ...budget,
    createdAt: new Date(),
  });
  return docRef.id;
};

export const getUserBudgets = async (userId: string) => {
  const q = query(
    collection(db, COLLECTIONS.BUDGETS),
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Auth state listener
export const onAuthStateChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};
