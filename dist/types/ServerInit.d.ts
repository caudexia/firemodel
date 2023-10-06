import admin from 'firebase-admin';
declare function initializeServer(config: admin.ServiceAccount, databaseURL: string): void;
declare function getFirestoreInstanceServer(): ReturnType<typeof admin.firestore>;
export { initializeServer, getFirestoreInstanceServer };
