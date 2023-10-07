import firebase from 'firebase/app';
import 'firebase/firestore';
import { createModel } from '../BaseModel';
import { getDoc, doc, getFirestore, addDoc, collection, updateDoc, deleteDoc, onSnapshot, } from 'firebase/firestore';
/**
 * Initializes the firemodel package with the given Firestore instance for web.
 *
 * @param {FirebaseConfig} config - Firestore config for web.
 */
export const initializeWeb = (config) => {
    // Initialize Firebase
    if (!firebase.getApps().length) {
        firebase.initializeApp(config);
    }
    else {
        firebase.getApp();
    }
    // Initialize Firestore
    const firestore = getFirestore();
    // You can add more configurations here, such as enabling offline support
    // firestore.enablePersistence()
    //   .catch((err) => {
    //     console.error("Firestore persistence error:", err);
    //   });
    return firestore;
};
/**
 * Creates a web model with methods tailored for the Firebase Web SDK.
 *
 * @template T - The type of the data model.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {ZodSchema<T>} schema - The Zod schema for data validation.
 * @returns {ReturnType<typeof createModel<T>>} - The methods associated with the web model.
 */
export const createWebModel = (collectionName, schema) => {
    const baseModel = createModel(collectionName, schema);
    return {
        ...baseModel,
        /**
         * Fetches a document by its ID.
         *
         * @param {string} id - The ID of the document to fetch.
         * @returns {Promise<T | undefined>} - The fetched document or undefined if not found.
         */
        async get(id) {
            const docSnap = await getDoc(doc(getFirestore(), collectionName, id));
            if (docSnap.exists()) {
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
            const docRef = await addDoc(collection(getFirestore(), collectionName), validatedData);
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
            await updateDoc(doc(getFirestore(), collectionName, id), validatedData);
        },
        /**
         * Deletes a document from the collection by its ID.
         *
         * @param {string} id - The ID of the document to delete.
         * @returns {Promise<void>} - Resolves when the deletion is successful.
         * @throws {Error} - Throws an error if issues arise during the deletion.
         */
        async delete(id) {
            await deleteDoc(doc(getFirestore(), collectionName, id));
        },
        /**
         * Subscribes to real-time updates for the collection. Whenever data in the collection changes,
         * the provided callback is invoked with the updated set of documents.
         *
         * @param {function(T[]): void} callback - The function to call with the updated documents.
         * @param {function(query: typeof Query): typeof Query} [queryFn] -
         *        An optional function to modify or filter the base query.
         * @returns {function(): void} - A function to unsubscribe from the real-time updates.
         * @throws {Error} - Throws an error if issues arise during the subscription.
         */
        subscribeToRealtimeUpdates(callback, queryFn) {
            let baseQuery = collection(getFirestore(), collectionName);
            if (queryFn) {
                baseQuery = queryFn(baseQuery);
            }
            return onSnapshot(baseQuery, snapshot => {
                const items = [];
                snapshot.forEach(docSnap => {
                    const data = docSnap.data();
                    const validatedData = baseModel.validate(data);
                    if (validatedData) {
                        items.push(validatedData);
                    }
                });
                callback(items);
            });
        },
    };
};
