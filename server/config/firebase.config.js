import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// IMPORTANT: In production, you MUST provide the serviceAccountKey.json
// You can download it from Firebase Console -> Project Settings -> Service Accounts -> Generate new private key
// Place it in the config folder and uncomment the lines below.

/*
import serviceAccount from './serviceAccountKey.json' assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
*/

// For now, we will mock the initialization so the app doesn't crash without the key.
let isFirebaseInitialized = false;

export const sendFCMNotification = async (fcmToken, title, body) => {
  if (!isFirebaseInitialized) {
    console.log(`[FCM Mock]: Would send push to ${fcmToken} -> Title: "${title}", Body: "${body}"`);
    return;
  }

  try {
    const message = {
      notification: {
        title: title,
        body: body
      },
      token: fcmToken // The user's device token
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
