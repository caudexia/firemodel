// src/server/index.ts
import admin from "firebase-admin";

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

// src/server/index.ts
var firestoreInstance = null;
var getFirestoreInstanceServer = () => {
  if (!firestoreInstance) {
    throw new Error("firemodel has not been initialized. Please call the initializeServer function first.");
  }
  return firestoreInstance;
};
var initializeServer = (config, databaseURL) => {
  admin.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL
  });
  firestoreInstance = admin.firestore();
};
var createServerModel = (collectionName, schema) => {
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
    async get(id) {
      const docSnap = await db.collection(collectionName).doc(id).get();
      if (docSnap.exists) {
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
    async update(id, data) {
      const validatedData = baseModel.validate(data);
      if (!validatedData) {
        throw new Error("firemodel: Validation failed for the provided data.");
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
    async delete(id) {
      await db.collection(collectionName).doc(id).delete();
    }
  };
};
export {
  createServerModel,
  getFirestoreInstanceServer,
  initializeServer
};
//# sourceMappingURL=index.mjs.map