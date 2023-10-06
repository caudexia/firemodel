let firestoreInstance = null;
function initializeWeb(config) {
    firestoreInstance = config;
}
function getFirestoreInstanceWeb() {
    if (!firestoreInstance) {
        throw new Error('firemodel has not been initialized. Please call the initializeWeb function first.');
    }
    return firestoreInstance;
}
export { initializeWeb, getFirestoreInstanceWeb };
