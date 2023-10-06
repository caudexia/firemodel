import { ZodSchema } from 'zod';
import { firestore } from 'firebase-admin';
import { createModel } from './BaseModel';

/**
 * Creates a server model with methods tailored for the Firebase Admin SDK.
 * 
 * @template T - The type of the data model.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {ZodSchema<T>} schema - The Zod schema for data validation.
 * @returns {ReturnType<typeof createModel<T>>} - The methods associated with the server model.
 */
function createServerModel<T>(collectionName: string, schema: ZodSchema<T>) {
  const baseModel = createModel(collectionName, schema);
  const db = firestore();

  return {
    ...baseModel,

    /**
     * Fetches a document by its ID.
     * 
     * @param {string} id - The ID of the document to fetch.
     * @returns {Promise<T | undefined>} - The fetched document or undefined if not found.
     */
    async get(id: string): Promise<T | undefined> {
      const docSnap = await db.collection(collectionName).doc(id).get();

      if (docSnap.exists) {
        return baseModel.validate(docSnap.data() as T);
      }

      return undefined;
    },

    /**
     * Adds a new document to the collection.
     * 
     * @param {T} data - The data of the document to add.
     * @returns {Promise<string>} - The ID of the added document.
     */
    async add(data: T): Promise<string> {
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
    async update(id: string, data: Partial<T>): Promise<void> {
      const validatedData = baseModel.validate(data);

      if (!validatedData) {
        throw new Error('firemodel: Validation failed for the provided data.');
      }

      await db.collection(collectionName).doc(id).update(validatedData);
    },

    /**
     * Deletes a document from the collection by its ID.
     * 
     * @param {string} id - The ID of the document to delete.
     * @returns {Promise<void>} - Resolves when the deletion is successful.
     * @throws {Error} - Throws an error if issues arise during the deletion.
     */
    async delete(id: string): Promise<void> {
      await db.collection(collectionName).doc(id).delete();
    },
  };
}

export { createServerModel };
