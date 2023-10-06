"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebModel = void 0;
const firestore_1 = require("firebase/firestore");
const BaseModel_1 = require("./BaseModel");
function createWebModel(collectionName, schema) {
    const baseModel = (0, BaseModel_1.createModel)(collectionName, schema);
    return {
        ...baseModel,
        async get(id) {
            const docSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)((0, firestore_1.getFirestore)(), collectionName, id));
            if (docSnap.exists()) {
                return baseModel.validate(docSnap.data());
            }
            return undefined;
        },
        async add(data) {
            const validatedData = baseModel.validate(data);
            if (!validatedData) {
                throw new Error("Validation failed for the provided data.");
            }
            const docRef = await (0, firestore_1.addDoc)((0, firestore_1.collection)((0, firestore_1.getFirestore)(), collectionName), validatedData);
            return docRef.id;
        },
        async update(id, data) {
            const validatedData = baseModel.validate(data);
            if (!validatedData) {
                throw new Error("Validation failed for the provided data.");
            }
            await (0, firestore_1.updateDoc)((0, firestore_1.doc)((0, firestore_1.getFirestore)(), collectionName, id), validatedData);
        },
        async delete(id) {
            await (0, firestore_1.deleteDoc)((0, firestore_1.doc)((0, firestore_1.getFirestore)(), collectionName, id));
        },
        subscribeToRealtimeUpdates(callback, queryFn) {
            let baseQuery = (0, firestore_1.collection)((0, firestore_1.getFirestore)(), collectionName);
            if (queryFn) {
                baseQuery = queryFn(baseQuery);
            }
            return (0, firestore_1.onSnapshot)(baseQuery, snapshot => {
                const items = [];
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
exports.createWebModel = createWebModel;
