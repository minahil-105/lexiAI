import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCwpWr1TcZVIgbOjPxk60-wHrJiJBXoJj4",
  authDomain: "lexiai-bd74c.firebaseapp.com",
  projectId: "lexiai-bd74c",
  storageBucket: "lexiai-bd74c.appspot.com",
  messagingSenderId: "264763261905",
  appId: "1:264763261905:web:f1412d0463433b34bb56f0",
  measurementId: "G-H3CV3N9M9F"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };