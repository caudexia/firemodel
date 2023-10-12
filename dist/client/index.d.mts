import * as _firebase_firestore from '@firebase/firestore';
import { Query, Unsubscribe } from 'firebase/firestore';
import { ZodSchema, ZodTypeDef } from 'zod';

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
}
interface DocUpdate {
    id: string;
    data: Record<number | string | symbol, any>;
    exists: boolean;
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
 * @template IInput - The type of the data model used for input (to be validated).
 * @template IOutput - The type of the data model used for output (to be returned).
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {ZodSchema<IOutput, ZodTypeDef, IInput>} schema - The Zod schema for data validation.
 * @returns {ReturnType<typeof createModel<IInput, IOutput>>} - The methods associated with the web model.
 */
declare const createWebModel: <IInput, IOutput>(collectionName: string, schema: ZodSchema<IOutput, ZodTypeDef, IInput>) => {
    /**
     * Fetches a document by its ID.
     *
     * @param {string} id - The ID of the document to fetch.
     * @returns {Promise<IOutput | undefined>} - The fetched document or undefined if not found.
     */
    get(id: string): Promise<IOutput | undefined>;
    /**
     * Adds a new document to the collection.
     *
     * @param {IInput} data - The data of the document to add.
     * @returns {Promise<string>} - The ID of the added document.
     */
    add(data: IInput): Promise<string>;
    /**
     * Updates an existing document in the collection.
     *
     * @param {string} id - The ID of the document to update.
     * @param {Partial<IInput>} data - The data to update in the document.
     * @returns {Promise<void>} - Resolves when the update is successful.
     * @throws {Error} - Throws an error if validation fails or if other issues arise during the update.
     */
    update(id: string, data: Partial<IInput>): Promise<void>;
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
     * @param {function(Array<{ data: IOutput } & DocUpdate>): void} callback - The function to call with the updated documents.
     * @param ?{function(query: Query): Query} queryFn - An optional function to modify or filter the base query.
     * @returns {Unsubscribe} - A function to unsubscribe from the real-time updates.
     * @throws {Error} - Throws an error if issues arise during the subscription.
     */
    subscribeToRealtimeUpdates(callback: (items: ({
        data: IOutput;
    } & DocUpdate)[]) => void, queryFn?: ((query: Query) => Query) | undefined): Unsubscribe;
    validate: (data: Partial<IInput>) => IOutput | undefined;
};

export { DocUpdate, createWebModel, initializeWeb };
