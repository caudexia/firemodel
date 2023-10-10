import * as zod from 'zod';
import { ZodSchema } from 'zod';
import admin from 'firebase-admin';

/**
 * Gets the initialized Firestore instance for server.
 *
 * @returns {ReturnType<typeof firestore>} - The Firestore instance for server.
 * @throws {Error} - Throws an error if the firemodel has not been initialized.
 */
declare const getFirestoreInstanceServer: () => ReturnType<typeof admin.firestore>;
/**
 * Initializes the firemodel package with the given Firebase Admin SDK credentials for server.
 *
 * @param {admin.ServiceAccount} config - Firebase Admin SDK credentials.
 * @param {string} databaseURL - Database URL for Firebase Admin SDK.
 */
declare const initializeServer: (config: admin.ServiceAccount, databaseURL: string) => void;
/**
 * Creates a server model with methods tailored for the Firebase Admin SDK.
 *
 * @template T - The type of the data model.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {ZodSchema<T>} schema - The Zod schema for data validation.
 * @returns {ReturnType<typeof createModel<T>>} - The methods associated with the server model.
 */
declare const createServerModel: <T>(collectionName: string, schema: ZodSchema<T, zod.ZodTypeDef, T>) => {
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
    validate: (data: any) => T | undefined;
};

export { createServerModel, getFirestoreInstanceServer, initializeServer };
