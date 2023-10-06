import { Firestore as WebFirestore } from 'firebase/firestore';
declare function initializeWeb(config: WebFirestore): void;
declare function getFirestoreInstanceWeb(): WebFirestore;
export { initializeWeb, getFirestoreInstanceWeb };
