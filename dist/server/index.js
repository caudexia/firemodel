"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server/index.ts
var server_exports = {};
__export(server_exports, {
  createServerModel: () => createServerModel,
  getFirestoreInstanceServer: () => getFirestoreInstanceServer,
  initializeServer: () => initializeServer
});
module.exports = __toCommonJS(server_exports);
var import_firebase_admin = __toESM(require("firebase-admin"));

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
  import_firebase_admin.default.initializeApp({
    credential: import_firebase_admin.default.credential.cert(config),
    databaseURL
  });
  firestoreInstance = import_firebase_admin.default.firestore();
};
var createServerModel = (collectionName, schema) => {
  const baseModel = createModel(collectionName, schema);
  const db = import_firebase_admin.default.firestore();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createServerModel,
  getFirestoreInstanceServer,
  initializeServer
});
//# sourceMappingURL=index.js.map