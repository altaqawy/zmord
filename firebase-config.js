/*
  ZMORD Firebase + Cloudinary Config
  ----------------------------------
  1) Create Firebase project.
  2) Enable Authentication -> Email/Password.
  3) Enable Firestore Database.
  4) Create a web app and paste config below.
  5) Create Cloudinary unsigned upload preset and paste values below.

  Important:
  This file is safe for Firebase client config.
  Do NOT put private service account keys here.
*/

window.ZMORD_FIREBASE_CONFIG = {
  apiKey: "PASTE_FIREBASE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_MESSAGING_SENDER_ID",
  appId: "PASTE_APP_ID"
};

window.ZMORD_CLOUDINARY_CONFIG = {
  cloudName: "PASTE_CLOUDINARY_CLOUD_NAME",
  uploadPreset: "PASTE_UNSIGNED_UPLOAD_PRESET",
  folder: "zmord-products"
};

// Main document path in Firestore:
// collection: zmord
// document: publicSite
