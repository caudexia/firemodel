import admin from 'firebase-admin';

let firestoreInstance: ReturnType<typeof admin.firestore> | null = null;

/**
 * Initializes the firemodel package with the given Firebase Admin SDK credentials for server.
 * 
 * @param {admin.ServiceAccount} config - Firebase Admin SDK credentials.
 * @param {string} databaseURL - Database URL for Firebase Admin SDK.
 */
function initializeServer(config: admin.ServiceAccount, databaseURL: string): void {
  admin.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL: databaseURL
  });
  firestoreInstance = admin.firestore();
}

/**
 * Gets the initialized Firestore instance for server.
 * 
 * @returns {ReturnType<typeof admin.firestore>} - The Firestore instance for server.
 * @throws {Error} - Throws an error if the firemodel has not been initialized.
 */
function getFirestoreInstanceServer(): ReturnType<typeof admin.firestore> {
  if (!firestoreInstance) {
    throw new Error('firemodel has not been initialized. Please call the initializeServer function first.');
  }
  return firestoreInstance;
}

export { initializeServer, getFirestoreInstanceServer };
