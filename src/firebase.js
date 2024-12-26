import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBII10ZDO1AjoFS0M6MqEwbtzbprSWz9q0",
    authDomain: "assignmentproject-a812c.firebaseapp.com",
    projectId: "assignmentproject-a812c",
    storageBucket: "assignmentproject-a812c.firebasestorage.app",
    messagingSenderId: "575546272773",
    appId: "1:575546272773:web:91bcd9dcfd21f6c864406c",
    measurementId: "G-6WLWN78MBV"
  };
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);