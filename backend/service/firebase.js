import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";

import path from "path";

let firebaseApp;

import dotenv from "dotenv";
dotenv.config();

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
    });
    console.log("Firebase Admin Initialized successfully from ENV variable.");
  } else {
    // Fix for Vercel: Avoid import.meta.url which can cause SyntaxErrors when transpiled to CJS
    const serviceAccountPath = path.join(process.cwd(), 'config', 'serviceAccountKey.json');
    
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      firebaseApp = initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("Firebase Admin Initialized successfully from file.");
    } else {
      console.warn("Firebase credentials not found. Firebase auth will fail.");
    }
  }
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

const admin = {
  auth: getAuth,
};

export default admin;
