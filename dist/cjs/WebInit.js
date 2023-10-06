"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirestoreInstanceWeb = exports.initializeWeb = void 0;
let firestoreInstance = null;
function initializeWeb(config) {
    firestoreInstance = config;
}
exports.initializeWeb = initializeWeb;
function getFirestoreInstanceWeb() {
    if (!firestoreInstance) {
        throw new Error('firemodel has not been initialized. Please call the initializeWeb function first.');
    }
    return firestoreInstance;
}
exports.getFirestoreInstanceWeb = getFirestoreInstanceWeb;
