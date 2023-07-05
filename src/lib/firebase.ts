import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyBeXB-De5aFw6nlPDnCZp6FjlBgqRi-TeM",
    authDomain: "sveltekit-course-d4906.firebaseapp.com",
    projectId: "sveltekit-course-d4906",
    storageBucket: "sveltekit-course-d4906.appspot.com",
    messagingSenderId: "207009999570",
    appId: "1:207009999570:web:ada71abee32c2b383e1b0b",
    measurementId: "G-F1MS4SGKTM"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
