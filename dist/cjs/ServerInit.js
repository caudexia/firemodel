"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirestoreInstanceServer = exports.initializeServer = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
let firestoreInstance = null;
function initializeServer(config, databaseURL) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(config),
        databaseURL: databaseURL
    });
    firestoreInstance = firebase_admin_1.default.firestore();
}
exports.initializeServer = initializeServer;
function getFirestoreInstanceServer() {
    if (!firestoreInstance) {
        throw new Error('firemodel has not been initialized. Please call the initializeServer function first.');
    }
    return firestoreInstance;
}
exports.getFirestoreInstanceServer = getFirestoreInstanceServer;
