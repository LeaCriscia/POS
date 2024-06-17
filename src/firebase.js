// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGD5V-sPA9tQfZ8TTrg0KrpMG-i1vjvKQ",
  authDomain: "fb-crud-8a2aa.firebaseapp.com",
  databaseURL: "https://fb-crud-8a2aa-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fb-crud-8a2aa",
  storageBucket: "fb-crud-8a2aa.appspot.com",
  messagingSenderId: "808941970062",
  appId: "1:808941970062:web:106aad168e527eb0d3dfdf",
  measurementId: "G-88RD5LES35"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);


