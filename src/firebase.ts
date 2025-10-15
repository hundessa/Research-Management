import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2Mmnj_3_AQSUYofhIb9TJSeljLhT3FF4",
  authDomain: "ha-geez-7f365.firebaseapp.com",
  projectId: "ha-geez-7f365",
  storageBucket: "ha-geez-7f365.appspot.com",
  messagingSenderId: "686915020763",
  appId: "1:686915020763:web:59e2429c0baf8a34e329fe",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);