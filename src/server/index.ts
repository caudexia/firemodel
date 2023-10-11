import { ZodSchema, ZodTypeDef } from 'zod';
import admin from 'firebase-admin';
import { createModel } from '../BaseModel';

let firestoreInstance: ReturnType<typeof admin.firestore> | null = null;

/**
 * Gets the initialized Firestore instance for server.
 * 
 * @returns {ReturnType<typeof firestore>} - The Firestore instance for server.
 * @throws {Error} - Throws an error if the firemodel has not been initialized.
 */
export const getFirestoreInstanceServer = (): ReturnType<typeof admin.firestore> => {
  if (!firestoreInstance) {
    throw new Error('firemodel has not been initialized. Please call the initializeServer function first.');
  }

  return firestoreInstance;
};

/**
 * Initializes the firemodel package with the given Firebase Admin SDK credentials for server.
 * 
 * @param {admin.ServiceAccount} config - Firebase Admin SDK credentials.
 * @param {string} databaseURL - Database URL for Firebase Admin SDK.
 */
export const initializeServer = (config: admin.ServiceAccount, databaseURL: string): void => {
  admin.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL: databaseURL
  });

  firestoreInstance = admin.firestore();
};

/**
 * Creates a server model with methods tailored for the Firebase Admin SDK.
 * 
 * @template IInput - The type of the data model used for input (to be validated).
 * @template IOutput - The type of the data model used for output (to be returned).
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {ZodSchema<IOutput, ZodTypeDef, IInput>} schema - The Zod schema for data validation.
 * @returns {ReturnType<typeof createModel<IInput, IOutput>>} - The methods associated with the web model.
 */
export const createServerModel = <IInput, IOutput>(collectionName: string, schema: ZodSchema<IOutput, ZodTypeDef, IInput>) => {
  const baseModel = createModel(collectionName, schema);
  const db = admin.firestore();

  return {
    ...baseModel,

    /**
     * Fetches a document by its ID.
     * 
     * @param {string} id - The ID of the document to fetch.
     * @returns {Promise<IOutput | undefined>} - The fetched document or undefined if not found.
     */
    async get(id: string): Promise<IOutput | undefined> {
      const docSnap = await db.collection(collectionName).doc(id).get();

      if (docSnap.exists) {
        return baseModel.validate(docSnap.data() as IInput);
      }

      return undefined;
    },

    /**
     * Adds a new document to the collection.
     * 
     * @param {IInput} data - The data of the document to add.
     * @returns {Promise<string>} - The ID of the added document.
     */
    async add(data: IInput): Promise<string> {
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
     * @param {Partial<IInput>} data - The data to update in the document.
     * @returns {Promise<void>} - Resolves when the update is successful.
     * @throws {Error} - Throws an error if validation fails or if other issues arise during the update.
     */
    async update(id: string, data: Partial<IInput>): Promise<void> {
      const validatedData = baseModel.validate(data);

      if (!validatedData) {
        throw new Error('firemodel: Validation failed for the provided data.');
      }

      // https://github.com/googleapis/nodejs-firestore/issues/1745
      await db.collection(collectionName).doc(id).update(validatedData as any);
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
};
