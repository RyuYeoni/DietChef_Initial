// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'; 
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAml1_x0_7NRN7l8xCZ8GWzv9TcuDD2rqU',
  authDomain: 'se-project-eb653.firebaseapp.com',
  projectId: 'se-project-eb653',
  storageBucket: 'se-project-eb653.appspot.com',
  messagingSenderId: '254095775113',
  appId: '1:254095775113:web:563651a46788f18ff53d58',
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
// Firebase 인증 및 Google 제공자 설정
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Realtime Database 초기화
const db = getDatabase(app);

export { auth, googleProvider, db };
export default app;
