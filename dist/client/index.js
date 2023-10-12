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

// src/client/index.ts
var client_exports = {};
__export(client_exports, {
  createWebModel: () => createWebModel,
  initializeWeb: () => initializeWeb
});
module.exports = __toCommonJS(client_exports);
var firebase = __toESM(require("firebase/app"));
var import_firestore = require("firebase/firestore");

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
var import_firestore2 = require("firebase/firestore");
var initializeWeb = (config) => {
  if (!firebase.getApps().length) {
    firebase.initializeApp(config);
  } else {
    firebase.getApp();
  }
  const firestore = (0, import_firestore2.getFirestore)();
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
      const docSnap = await (0, import_firestore2.getDoc)((0, import_firestore2.doc)((0, import_firestore2.getFirestore)(), collectionName, id));
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
      const docRef = await (0, import_firestore2.addDoc)((0, import_firestore2.collection)((0, import_firestore2.getFirestore)(), collectionName), validatedData);
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
      await (0, import_firestore2.updateDoc)((0, import_firestore2.doc)((0, import_firestore2.getFirestore)(), collectionName, id), validatedData);
    },
    /**
     * Deletes a document from the collection by its ID.
     * 
     * @param {string} id - The ID of the document to delete.
     * @returns {Promise<void>} - Resolves when the deletion is successful.
     * @throws {Error} - Throws an error if issues arise during the deletion.
     */
    async delete(id) {
      await (0, import_firestore2.deleteDoc)((0, import_firestore2.doc)((0, import_firestore2.getFirestore)(), collectionName, id));
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
      let baseQuery = (0, import_firestore2.collection)((0, import_firestore2.getFirestore)(), collectionName);
      if (typeof queryFn === "function") {
        baseQuery = queryFn(baseQuery);
      }
      return (0, import_firestore2.onSnapshot)(baseQuery, (snapshot) => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createWebModel,
  initializeWeb
});
//# sourceMappingURL=index.js.map