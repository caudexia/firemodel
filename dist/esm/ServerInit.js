import admin from 'firebase-admin';
let firestoreInstance = null;
function initializeServer(config, databaseURL) {
    admin.initializeApp({
        credential: admin.credential.cert(config),
        databaseURL: databaseURL
    });
    firestoreInstance = admin.firestore();
}
function getFirestoreInstanceServer() {
    if (!firestoreInstance) {
        throw new Error('firemodel has not been initialized. Please call the initializeServer function first.');
    }
    return firestoreInstance;
}
export { initializeServer, getFirestoreInstanceServer };
