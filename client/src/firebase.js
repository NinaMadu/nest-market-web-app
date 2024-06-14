// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-market-a23ec.firebaseapp.com",
  projectId: "mern-market-a23ec",
  storageBucket: "mern-market-a23ec.appspot.com",
  messagingSenderId: "843437901379",
  appId: "1:843437901379:web:632799b3ee57780758b6f6",
  measurementId: "G-3350T038S1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);