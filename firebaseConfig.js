import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA6jhpK75Kk7Vf8Co-2V3K5Y_um2D0z_Qo",
  authDomain: "app-salao-d5466.firebaseapp.com",
  projectId: "app-salao-d5466",
  storageBucket: "app-salao-d5466.appspot.com",
  messagingSenderId: "509114862012",
  appId: "1:509114862012:web:b82da0ce2046251848c3b9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };

