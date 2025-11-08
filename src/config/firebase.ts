import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();
import serviceAccount from "../../secrets/magic-room-firebase-adminsdk.json";

function initFirebaseApp() {
  if (admin.apps.length) return admin.app();


  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });


}

const app = initFirebaseApp();
export const db = admin.firestore();
export const adminAuth = admin.auth();
export default app;
