import { ZodSchema } from 'zod';
import { getFirestore, collection, doc, getDoc, addDoc, updateDoc, deleteDoc, query as firestoreQuery, onSnapshot } from 'firebase/firestore';
import { createModel } from './BaseModel';

/**
 * Creates a web model with methods tailored for the Firebase Web SDK.
 * 
 * @template T - The type of the data model.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {ZodSchema<T>} schema - The Zod schema for data validation.
 * @returns {ReturnType<typeof createModel<T>>} - The methods associated with the web model.
 */
function createWebModel<T>(collectionName: string, schema: ZodSchema<T>) {
  const baseModel = createModel(collectionName, schema);

  return {
      ...baseModel,

    /**
     * Fetches a document by its ID.
     * 
     * @param {string} id - The ID of the document to fetch.
     * @returns {Promise<T | undefined>} - The fetched document or undefined if not found.
     */
    async get(id: string): Promise<T | undefined> {
        const docSnap = await getDoc(doc(getFirestore(), collectionName, id));

        if (docSnap.exists()) {
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
    async update(id: string, data: Partial<T>): Promise<void> {
      const validatedData = baseModel.validate(data);

      if (!validatedData) {
        throw new Error('firemodel: Validation failed for the provided data.');
      }

      await updateDoc(doc(getFirestore(), collectionName, id), validatedData);
    },

    /**
     * Deletes a document from the collection by its ID.
     * 
     * @param {string} id - The ID of the document to delete.
     * @returns {Promise<void>} - Resolves when the deletion is successful.
     * @throws {Error} - Throws an error if issues arise during the deletion.
     */
    async delete(id: string): Promise<void> {
      await deleteDoc(doc(getFirestore(), collectionName, id));
    },

    /**
     * Subscribes to real-time updates for the collection. Whenever data in the collection changes,
     * the provided callback is invoked with the updated set of documents.
     * 
     * @param {function(T[]): void} callback - The function to call with the updated documents.
     * @param {function(query: ReturnType<typeof firestoreQuery>): ReturnType<typeof firestoreQuery>} [queryFn] - 
     *        An optional function to modify or filter the base query.
     * @returns {function(): void} - A function to unsubscribe from the real-time updates.
     * @throws {Error} - Throws an error if issues arise during the subscription.
     */
    subscribeToRealtimeUpdates(
        callback: (items: T[]) => void,
        queryFn?: (query: ReturnType<typeof firestoreQuery>) => ReturnType<typeof firestoreQuery>
    ) {
      let baseQuery: ReturnType<typeof firestoreQuery> = collection(getFirestore(), collectionName);

      if (queryFn) {
        baseQuery = queryFn(baseQuery);
      }

      return onSnapshot(baseQuery, snapshot => {
        const items: T[] = [];
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
}

export { createWebModel };
