// src/client/index.ts
import * as firebase from "firebase/app";
import "firebase/firestore";

// src/BaseModel.ts
function createModel(_collectionName, schema) {
  return {
    validate(data) {
      return schema.parse(data);
    },
    async get(_id) {
      throw new Error("Method not implemented.");
    },
    async add(_data) {
      throw new Error("Method not implemented.");
    },
    async update(_id, _data) {
      throw new Error("Method not implemented.");
    },
    async delete(_id) {
      throw new Error("Method not implemented.");
    }
  };
}

// src/client/index.ts
import {
  getDoc,
  doc,
  getFirestore,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";
var initializeWeb = (config) => {
  if (!firebase.getApps().length) {
    firebase.initializeApp(config);
  } else {
    firebase.getApp();
  }
  const firestore = getFirestore();
  return firestore;
};
var createWebModel = (collectionName, schema) => {
  const baseModel = createModel(collectionName, schema);
  return {
    ...baseModel,
    /**
     * Fetches a document by its ID.
     * 
     * @param {string} id - The ID of the document to fetch.
     * @returns {Promise<IOutput | undefined>} - The fetched document or undefined if not found.
     */
    async get(id) {
      const docSnap = await getDoc(doc(getFirestore(), collectionName, id));
      if (docSnap.exists()) {
        return baseModel.validate(docSnap.data());
      }
      return void 0;
    },
    /**
     * Adds a new document to the collection.
     * 
     * @param {IInput} data - The data of the document to add.
     * @returns {Promise<string>} - The ID of the added document.
     */
    async add(data) {
      const validatedData = baseModel.validate(data);
      if (!validatedData) {
        throw new Error("firemodel: Validation failed for the provided data.");
      }
      const docRef = await addDoc(collection(getFirestore(), collectionName), validatedData);
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
    async update(id, data) {
      const validatedData = baseModel.validate(data);
      if (!validatedData) {
        throw new Error("firemodel: Validation failed for the provided data.");
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
    async delete(id) {
      await deleteDoc(doc(getFirestore(), collectionName, id));
    },
    /**
     * Subscribes to real-time updates for the collection. Whenever data in the collection changes,
     * the provided callback is invoked with the updated set of documents.
     * 
     * @param {function(Array<{ data: IOutput } & DocUpdate>): void} callback - The function to call with the updated documents.
     * @param ?{function(query: Query): Query} queryFn - An optional function to modify or filter the base query.
     * @returns {Unsubscribe} - A function to unsubscribe from the real-time updates.
     * @throws {Error} - Throws an error if issues arise during the subscription.
     */
    subscribeToRealtimeUpdates(callback, queryFn) {
      let baseQuery = collection(getFirestore(), collectionName);
      if (typeof queryFn === "function") {
        baseQuery = queryFn(baseQuery);
      }
      return onSnapshot(baseQuery, (snapshot) => {
        const items = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const validatedData = baseModel.validate(data);
          if (validatedData) {
            items.push({
              id: docSnap.id,
              data: validatedData,
              exists: docSnap.exists()
            });
          }
        });
        callback(items);
      });
    }
  };
};
export {
  createWebModel,
  initializeWeb
};
//# sourceMappingURL=index.mjs.map