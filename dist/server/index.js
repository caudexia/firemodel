"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerModel = exports.initializeServer = exports.getFirestoreInstanceServer = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const BaseModel_1 = require("../BaseModel");
let firestoreInstance = null;
/**
 * Gets the initialized Firestore instance for server.
 *
 * @returns {ReturnType<typeof firestore>} - The Firestore instance for server.
 * @throws {Error} - Throws an error if the firemodel has not been initialized.
 */
const getFirestoreInstanceServer = () => {
    if (!firestoreInstance) {
        throw new Error('firemodel has not been initialized. Please call the initializeServer function first.');
    }
    return firestoreInstance;
};
exports.getFirestoreInstanceServer = getFirestoreInstanceServer;
/**
 * Initializes the firemodel package with the given Firebase Admin SDK credentials for server.
 *
 * @param {admin.ServiceAccount} config - Firebase Admin SDK credentials.
 * @param {string} databaseURL - Database URL for Firebase Admin SDK.
 */
const initializeServer = (config, databaseURL) => {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(config),
        databaseURL: databaseURL
    });
    firestoreInstance = firebase_admin_1.default.firestore();
};
exports.initializeServer = initializeServer;
/**
 * Creates a server model with methods tailored for the Firebase Admin SDK.
 *
 * @template T - The type of the data model.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {ZodSchema<T>} schema - The Zod schema for data validation.
 * @returns {ReturnType<typeof createModel<T>>} - The methods associated with the server model.
 */
const createServerModel = (collectionName, schema) => {
    const baseModel = (0, BaseModel_1.createModel)(collectionName, schema);
    const db = firebase_admin_1.default.firestore();
    return {
        ...baseModel,
        /**
         * Fetches a document by its ID.
         *
         * @param {string} id - The ID of the document to fetch.
         * @returns {Promise<T | undefined>} - The fetched document or undefined if not found.
         */
        async get(id) {
            const docSnap = await db.collection(collectionName).doc(id).get();
            if (docSnap.exists) {
                return baseModel.validate(docSnap.data());
            }
            return undefined;
        },
        /**
         * Adds a new document to the collection.
         *
         * @param {T} data - The data of the document to add.
         * @returns {Promise<string>} - The ID of the added document.
         */
        async add(data) {
            const validatedData = baseModel.validate(data);
            if (!validatedData) {
                throw new Error('firemodel: Validation failed for the provided data.');
            }
            const docRef = await db.collection(collectionName).add(validatedData);
            return docRef.id;
        },
        /**
         * Updates an existing document in the collection.
         *
         * @param {string} id - The ID of the document to update.
         * @param {Partial<T>} data - The data to update in the document.
         * @returns {Promise<void>} - Resolves when the update is successful.
         * @throws {Error} - Throws an error if validation fails or if other issues arise during the update.
         */
        async update(id, data) {
            const validatedData = baseModel.validate(data);
            if (!validatedData) {
                throw new Error('firemodel: Validation failed for the provided data.');
            }
            // https://github.com/googleapis/nodejs-firestore/issues/1745
            await db.collection(collectionName).doc(id).update(validatedData);
        },
        /**
         * Deletes a document from the collection by its ID.
         *
         * @param {string} id - The ID of the document to delete.
         * @returns {Promise<void>} - Resolves when the deletion is successful.
         * @throws {Error} - Throws an error if issues arise during the deletion.
         */
        async delete(id) {
            await db.collection(collectionName).doc(id).delete();
        },
    };
};
exports.createServerModel = createServerModel;
