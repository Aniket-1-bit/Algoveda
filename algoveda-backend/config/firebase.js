const admin = require('firebase-admin');
require('dotenv').config(); // Load environment variables

// Check if Firebase credentials are available
const hasFirebaseCredentials = process.env.FIREBASE_PRIVATE_KEY && 
                              process.env.FIREBASE_CLIENT_EMAIL &&
                              process.env.FIREBASE_PRIVATE_KEY_ID;

let firebaseAdmin = null;
let auth = null;
let firestore = null;
let storage = null;

if (hasFirebaseCredentials) {
  try {
    // Firebase service account configuration
    const serviceAccount = {
      "type": "service_account",
      "project_id": "algoveda-8897e",
      "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
      "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      "client_email": process.env.FIREBASE_CLIENT_EMAIL,
      "client_id": process.env.FIREBASE_CLIENT_ID,
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
    };

    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: "algoveda-8897e"
      });
    } else {
      firebaseAdmin = admin.app();
    }
    
    auth = admin.auth();
    firestore = admin.firestore();
    storage = admin.storage();
    
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error.message);
    firebaseAdmin = null;
    auth = null;
    firestore = null;
    storage = null;
  }
} else {
  console.log('ℹ️ Firebase credentials not found. Skipping Firebase initialization.');
  console.log('To enable Firebase, add the required environment variables to your .env file.');
}

module.exports = {
  firebaseAdmin,
  auth,
  firestore,
  storage,
  isFirebaseEnabled: !!firebaseAdmin
};