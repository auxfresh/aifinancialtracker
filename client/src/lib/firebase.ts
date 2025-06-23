import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, type Auth } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc, getDoc, type Firestore } from "firebase/firestore";
import type { User } from "@shared/schema";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
};

const app = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

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
  return signOut(auth);
};

// Firestore collections
export const COLLECTIONS = {
  TRANSACTIONS: "transactions",
  BUDGETS: "budgets",
  CATEGORIES: "categories",
};

// Transaction functions
export const addTransaction = async (transaction: any) => {
  return addDoc(collection(db, COLLECTIONS.TRANSACTIONS), {
    ...transaction,
    createdAt: new Date(),
  });
};

export const getUserTransactions = async (userId: string) => {
  try {
    // First try the ordered query
    const q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    const transactions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Raw transaction data:', data); // Debug log
      return { id: doc.id, ...data };
    });
    console.log('Total transactions found:', transactions.length); // Debug log
    return transactions;
  } catch (error: any) {
    console.error('Error with ordered query:', error);
    
    // If the ordered query fails due to missing index, try without ordering
    if (error.code === 'failed-precondition') {
      console.log('Trying fallback query without ordering...');
      try {
        const fallbackQuery = query(
          collection(db, COLLECTIONS.TRANSACTIONS),
          where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(fallbackQuery);
        const transactions = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });
        
        // Sort manually by date (newest first)
        transactions.sort((a: any, b: any) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
        
        console.log('Fallback query successful, transactions found:', transactions.length);
        return transactions;
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        return [];
      }
    }
    
    return [];
  }
};

export const updateTransaction = async (id: string, data: any) => {
  const docRef = doc(db, COLLECTIONS.TRANSACTIONS, id);
  return updateDoc(docRef, data);
};

export const deleteTransaction = async (id: string) => {
  const docRef = doc(db, COLLECTIONS.TRANSACTIONS, id);
  return deleteDoc(docRef);
};

// Budget functions
export const addBudget = async (budget: any) => {
  return addDoc(collection(db, COLLECTIONS.BUDGETS), {
    ...budget,
    createdAt: new Date(),
  });
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