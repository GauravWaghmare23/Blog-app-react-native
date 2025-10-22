import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAsQ2F2QJ_dv1IBrNgdDgUY3fuKb20EVaQ",
    authDomain: "trys-204e9.firebaseapp.com",
    projectId: "trys-204e9",
    storageBucket: "trys-204e9.firebasestorage.app",
    messagingSenderId: "372548500405",
    appId: "1:372548500405:web:76241c24c53c8c6a26f7fc",
    measurementId: "G-L1KDK1B7LM"
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app)