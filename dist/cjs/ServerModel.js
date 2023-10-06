"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerModel = void 0;
const firebase_admin_1 = require("firebase-admin");
const BaseModel_1 = require("./BaseModel");
function createServerModel(collectionName, schema) {
    const baseModel = (0, BaseModel_1.createModel)(collectionName, schema);
    const db = (0, firebase_admin_1.firestore)();
    return {
        ...baseModel,
        async get(id) {
            const docSnap = await db.collection(collectionName).doc(id).get();
            if (docSnap.exists) {
                return baseModel.validate(docSnap.data());
            }
            return undefined;
        },
        async add(data) {
            const validatedData = baseModel.validate(data);
            if (!validatedData) {
                throw new Error('firemodel: Validation failed for the provided data.');
            }
            const docRef = await db.collection(collectionName).add(validatedData);
            return docRef.id;
        },
        async update(id, data) {
            const validatedData = baseModel.validate(data);
            if (!validatedData) {
                throw new Error('firemodel: Validation failed for the provided data.');
            }
            await db.collection(collectionName).doc(id).update(validatedData);
        },
        async delete(id) {
            await db.collection(collectionName).doc(id).delete();
        },
    };
}
exports.createServerModel = createServerModel;
