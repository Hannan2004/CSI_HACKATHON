import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBFC72LLgg9l6CbsjhR34S3L57OMFvAD_A",
  authDomain: "ai-threat-detection-platform.firebaseapp.com",
  projectId: "ai-threat-detection-platform",
  storageBucket: "ai-threat-detection-platform.firebasestorage.app",
  messagingSenderId: "736670644857",
  appId: "1:736670644857:web:166aa33d64117c24cdb2a8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };