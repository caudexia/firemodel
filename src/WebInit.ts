import { Firestore as WebFirestore } from 'firebase/firestore';

let firestoreInstance: WebFirestore | null = null;

/**
 * Initializes the firemodel package with the given Firestore instance for web.
 * 
 * @param {WebFirestore} config - Firestore instance for web.
 */
function initializeWeb(config: WebFirestore): void {
  firestoreInstance = config;
}

/**
 * Gets the initialized Firestore instance for web.
 * 
 * @returns {WebFirestore} - The Firestore instance for web.
 * @throws {Error} - Throws an error if the firemodel has not been initialized.
 */
function getFirestoreInstanceWeb(): WebFirestore {
  if (!firestoreInstance) {
    throw new Error('firemodel has not been initialized. Please call the initializeWeb function first.');
  }
  return firestoreInstance;
}

export { initializeWeb, getFirestoreInstanceWeb };
