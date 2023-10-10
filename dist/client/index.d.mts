import * as zod from 'zod';
import { ZodSchema } from 'zod';
import * as _firebase_firestore from '@firebase/firestore';
import { Query } from 'firebase/firestore';

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
}
/**
 * Initializes the firemodel package with the given Firestore instance for web.
 *
 * @param {FirebaseConfig} config - Firestore config for web.
 */
declare const initializeWeb: (config: FirebaseConfig) => _firebase_firestore.Firestore;
/**
 * Creates a web model with methods tailored for the Firebase Web SDK.
 *
 * @template T - The type of the data model.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {ZodSchema<T>} schema - The Zod schema for data validation.
 * @returns {ReturnType<typeof createModel<T>>} - The methods associated with the web model.
 */
declare const createWebModel: <T>(collectionName: string, schema: ZodSchema<T, zod.ZodTypeDef, T>) => {
    /**
     * Fetches a document by its ID.
     *
     * @param {string} id - The ID of the document to fetch.
     * @returns {Promise<T | undefined>} - The fetched document or undefined if not found.
     */
    get(id: string): Promise<T | undefined>;
    /**
     * Adds a new document to the collection.
     *
     * @param {T} data - The data of the document to add.
     * @returns {Promise<string>} - The ID of the added document.
     */
    add(data: T): Promise<string>;
    /**
     * Updates an existing document in the collection.
     *
     * @param {string} id - The ID of the document to update.
     * @param {Partial<T>} data - The data to update in the document.
     * @returns {Promise<void>} - Resolves when the update is successful.
     * @throws {Error} - Throws an error if validation fails or if other issues arise during the update.
     */
    update(id: string, data: Partial<T>): Promise<void>;
    /**
     * Deletes a document from the collection by its ID.
     *
     * @param {string} id - The ID of the document to delete.
     * @returns {Promise<void>} - Resolves when the deletion is successful.
     * @throws {Error} - Throws an error if issues arise during the deletion.
     */
    delete(id: string): Promise<void>;
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
    subscribeToRealtimeUpdates(callback: (items: T[]) => void, queryFn?: ((query: Query) => Query) | undefined): _firebase_firestore.Unsubscribe;
    validate: (data: any) => T | undefined;
};

export { createWebModel, initializeWeb };
