import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzVNsB_JjtGU2GkYi3RPu1BKVcIteekrs",
  authDomain: "mzkyzakchat.firebaseapp.com",
  projectId: "mzkyzakchat",
  storageBucket: "mzkyzakchat.firebasestorage.app",
  messagingSenderId: "914234786881",
  appId: "1:914234786881:web:c678642cd340fdbfcb72c0",
  measurementId: "G-5NBYSY5JBE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let analytics = null;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);

export { app, db, auth, analytics };
