import { initializeApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD8wzIs2Zdrl3Q3gzseAqQkmw-xtKBI1Rw",
    authDomain: "hackthon20241227.firebaseapp.com",
    projectId: "hackthon20241227",
    storageBucket: "hackthon20241227.firebasestorage.app",
    messagingSenderId: "980992507739",
    appId: "1:980992507739:web:388de63a10fec30dd6e47e",
    measurementId: "G-X1XF1NCNET"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);