import { getFirestore, collection, doc, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { createModel } from './BaseModel';
function createWebModel(collectionName, schema) {
    const baseModel = createModel(collectionName, schema);
    return {
        ...baseModel,
        async get(id) {
            const docSnap = await getDoc(doc(getFirestore(), collectionName, id));
            if (docSnap.exists()) {
                return baseModel.validate(docSnap.data());
            }
            return undefined;
        },
        async add(data) {
            const validatedData = baseModel.validate(data);
            if (!validatedData) {
                throw new Error('firemodel: Validation failed for the provided data.');
            }
            const docRef = await addDoc(collection(getFirestore(), collectionName), validatedData);
            return docRef.id;
        },
        async update(id, data) {
            const validatedData = baseModel.validate(data);
            if (!validatedData) {
                throw new Error('firemodel: Validation failed for the provided data.');
            }
            await updateDoc(doc(getFirestore(), collectionName, id), validatedData);
        },
        async delete(id) {
            await deleteDoc(doc(getFirestore(), collectionName, id));
        },
        subscribeToRealtimeUpdates(callback, queryFn) {
            let baseQuery = collection(getFirestore(), collectionName);
            if (queryFn) {
                baseQuery = queryFn(baseQuery);
            }
            return onSnapshot(baseQuery, snapshot => {
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
export { createWebModel };
