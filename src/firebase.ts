// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCIWbon0AvUvjnkGdAAmIQHEKEQQGRv4s",
  authDomain: "research-management-775ab.firebaseapp.com",
  projectId: "research-management-775ab",
  storageBucket: "research-management-775ab.firebasestorage.app",
  messagingSenderId: "963851596295",
  appId: "1:963851596295:web:b903e1fa661c5bfea730a2",
  measurementId: "G-C0S39T0F39",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app);
export const storage = getStorage(app);
